// app/lib/.server/llm/provider.ts
import type { LanguageModelV1 } from 'ai';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createXai } from '@ai-sdk/xai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createVertex } from '@ai-sdk/google-vertex';
import { createOpenAI } from '@ai-sdk/openai';
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { captureException } from '@sentry/remix';
import { logger } from 'bna-agent/utils/logger';
import type { ProviderType } from '@/lib/common/annotations';
import { getEnv } from '@/lib/.server/env';
// workaround for Vercel environment from
// https://github.com/vercel/ai/issues/199#issuecomment-1605245593
import { fetch } from '@/lib/.server/fetch';

const ALLOWED_AWS_REGIONS = ['us-east-1', 'us-west-2'];

export type ModelProvider = Exclude<ProviderType, 'Unknown'>;
type Provider = {
  maxTokens: number;
  model: LanguageModelV1;
  options?: {
    xai?: {
      stream_options: { include_usage: true };
    };
    openai?: {
      reasoningEffort?: string;
    };
  };
};

export function modelForProvider(provider: ModelProvider, modelChoice: string | undefined) {
  if (modelChoice) {
    if (modelChoice === 'claude-sonnet-4-0' && provider === 'Bedrock') {
      return 'us.anthropic.claude-sonnet-4-20250514-v1:0';
    }

    if (modelChoice === 'gpt-5') {
      return 'gpt-5';
    }

    return modelChoice;
  }
  switch (provider) {
    case 'Anthropic':
      return getEnv('ANTHROPIC_MODEL') || 'claude-3-5-sonnet-20241022';
    case 'Bedrock':
      return getEnv('AMAZON_BEDROCK_MODEL') || 'us.anthropic.claude-3-5-sonnet-20241022-v2:0';
    case 'OpenAI':
      return getEnv('OPENAI_MODEL') || 'gpt-5';
    case 'XAI':
      return getEnv('XAI_MODEL') || 'grok-code-fast-1';
    case 'Google':
      return getEnv('GOOGLE_MODEL') || 'gemini-2.5-pro';
    default: {
      const _exhaustiveCheck: never = provider;
      throw new Error(`Unknown provider: ${_exhaustiveCheck}`);
    }
  }
}

function anthropicMaxTokens(modelChoice: string | undefined) {
  return modelChoice === 'claude-sonnet-4-0' ? 24576 : 8192;
}

export function getProvider(
  userApiKey: string | undefined,
  modelProvider: ModelProvider,
  modelChoice: string | undefined,
): Provider {
  let model: string;
  let provider: Provider;

  // If no user API key is provided, throw an error since all models now require API keys
  if (!userApiKey) {
    throw new Error(`API key is required for ${modelProvider}. Please add your API key in settings.`);
  }

  switch (modelProvider) {
    case 'Google': {
      model = modelForProvider(modelProvider, modelChoice);
      const google = createGoogleGenerativeAI({
        apiKey: userApiKey,
        fetch: userKeyApiFetch('Google'),
      });
      provider = {
        model: google(model),
        maxTokens: 24576,
      };
      break;
    }
    case 'XAI': {
      model = modelForProvider(modelProvider, modelChoice);
      const xai = createXai({
        apiKey: userApiKey,
        fetch: userKeyApiFetch('XAI'),
      });
      provider = {
        model: xai(model),
        maxTokens: 8192,
        options: {
          xai: {
            stream_options: { include_usage: true },
          },
        },
      };
      break;
    }
    case 'OpenAI': {
      model = modelForProvider(modelProvider, modelChoice);
      const openai = createOpenAI({
        apiKey: userApiKey,
        fetch: userKeyApiFetch('OpenAI'),
        compatibility: 'strict',
      });
      provider = {
        model: openai(model),
        maxTokens: 24576,
        options: modelChoice === 'gpt-5' ? { openai: { reasoningEffort: 'medium' } } : undefined,
      };
      break;
    }
    case 'Bedrock': {
      // Bedrock doesn't use user API keys, it uses AWS credentials
      model = modelForProvider(modelProvider, modelChoice);
      let region = getEnv('AWS_REGION');
      if (!region || !ALLOWED_AWS_REGIONS.includes(region)) {
        region = 'us-west-2';
      }

      // Check if AWS credentials are available
      const roleArn = getEnv('AWS_ROLE_ARN');
      if (!roleArn) {
        throw new Error('Bedrock requires AWS credentials to be configured. Please contact support.');
      }

      const bedrock = createAmazonBedrock({
        region,
        credentialProvider: awsCredentialsProvider({
          roleArn,
        }),
        fetch,
      });
      provider = {
        model: bedrock(model),
        maxTokens: anthropicMaxTokens(modelChoice),
        options: undefined,
      };
      break;
    }
    case 'Anthropic': {
      model = modelForProvider(modelProvider, modelChoice);

      // For user API keys, use a simpler fetch without fallback logic
      const anthropic = createAnthropic({
        apiKey: userApiKey,
        fetch: userKeyApiFetch('Anthropic'),
      });

      provider = {
        model: anthropic(model),
        maxTokens: anthropicMaxTokens(modelChoice),
      };
      break;
    }
  }

  return provider;
}

const userKeyApiFetch = (provider: ModelProvider) => {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const result = await fetch(input, init);
    if (result.status === 401) {
      const text = await result.text();
      throw new Error(
        JSON.stringify({
          error: `Invalid ${provider} API key. Please check your API key in settings.`,
          details: text,
        }),
      );
    }
    if (result.status === 413) {
      const text = await result.text();
      throw new Error(
        JSON.stringify({
          error: 'Request exceeds the maximum allowed number of bytes.',
          details: text,
        }),
      );
    }
    if (result.status === 429) {
      const text = await result.text();
      throw new Error(
        JSON.stringify({
          error: `${provider} is rate limiting your requests`,
          details: text,
        }),
      );
    }
    if (result.status === 529) {
      const text = await result.text();
      throw new Error(
        JSON.stringify({
          error: `${provider}'s API is temporarily overloaded`,
          details: text,
        }),
      );
    }
    if (!result.ok) {
      const text = await result.text();
      throw new Error(
        JSON.stringify({
          error: `${provider} returned an error (${result.status} ${result.statusText}) when using your provided API key: ${text}`,
          details: text,
        }),
      );
    }
    return result;
  };
};
