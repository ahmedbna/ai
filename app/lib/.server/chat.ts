// app/lib/.server/chat.ts
import { type ActionFunctionArgs } from '@vercel/remix';
import { createScopedLogger } from 'chef-agent/utils/logger';
import { convexAgent } from '@/lib/.server/llm/convex-agent';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import type { LanguageModelUsage, Message, ProviderMetadata } from 'ai';
import { checkTokenUsage, recordUsage } from '@/lib/.server/usage';
import { disabledText, noTokensText } from '@/lib/convexUsage';
import type { ModelProvider } from '@/lib/.server/llm/provider';
import { getEnv } from '@/lib/.server/env';
import type { PromptCharacterCounts } from 'chef-agent/ChatContextManager';

type Messages = Message[];

const logger = createScopedLogger('api.chat');

export type Tracer = ReturnType<typeof WebTracerProvider.prototype.getTracer>;

export async function chatAction({ request }: ActionFunctionArgs) {
  const AXIOM_API_TOKEN = getEnv('AXIOM_API_TOKEN');
  const AXIOM_API_URL = getEnv('AXIOM_API_URL');
  const AXIOM_DATASET_NAME = getEnv('AXIOM_DATASET_NAME');
  const PROVISION_HOST = getEnv('PROVISION_HOST') || 'https://api.convex.dev';

  let tracer: Tracer | null = null;
  if (AXIOM_API_TOKEN && AXIOM_API_URL && AXIOM_DATASET_NAME) {
    const exporter = new OTLPTraceExporter({
      url: AXIOM_API_URL,
      headers: {
        Authorization: `Bearer ${AXIOM_API_TOKEN}`,
        'X-Axiom-Dataset': AXIOM_DATASET_NAME,
      },
    });
    const provider = new WebTracerProvider({
      spanProcessors: [
        new BatchSpanProcessor(exporter, {
          // The maximum queue size. After the size is reached spans are dropped.
          maxQueueSize: 100,
          // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
          maxExportBatchSize: 10,
          // The interval between two consecutive exports
          scheduledDelayMillis: 500,
          // How long the export can run before it is cancelled
          exportTimeoutMillis: 30000,
        }),
      ],
    });
    provider.register();
    tracer = provider.getTracer('ai');
    logger.info('✅ Axiom instrumentation registered!');
  } else {
    logger.warn('⚠️ AXIOM_API_TOKEN, AXIOM_API_URL, and AXIOM_DATASET_NAME not set, skipping Axiom instrumentation.');
  }

  const body = (await request.json()) as {
    messages: Messages;
    firstUserMessage: boolean;
    chatInitialId: string;
    token: string;
    teamSlug: string;
    deploymentName: string | undefined;
    modelProvider: ModelProvider;
    modelChoice: string | undefined;
    userApiKey:
      | { preference: 'always' | 'quotaExhausted'; value?: string; openai?: string; xai?: string; google?: string }
      | undefined;
    shouldDisableTools: boolean;
    recordRawPromptsForDebugging?: boolean;
    collapsedMessages: boolean;
    promptCharacterCounts?: PromptCharacterCounts;
    featureFlags: {
      enableResend?: boolean;
    };
  };
  const { messages, firstUserMessage, chatInitialId, deploymentName, token, teamSlug, recordRawPromptsForDebugging } =
    body;

  if (getEnv('DISABLE_BEDROCK') === '1' && body.modelProvider === 'Bedrock') {
    body.modelProvider = 'Anthropic';
  }

  // Since all models now require API keys, always use user API key
  let userApiKey: string | undefined;

  // Extract the appropriate API key based on the model provider
  if (body.modelProvider === 'Anthropic' || body.modelProvider === 'Bedrock') {
    userApiKey = body.userApiKey?.value;
    // For Bedrock, we still use Anthropic API key for the user, but the provider handles AWS credentials
    if (body.modelProvider === 'Bedrock') {
      body.modelProvider = 'Anthropic'; // Use Anthropic provider for user API key
    }
  } else if (body.modelProvider === 'OpenAI') {
    userApiKey = body.userApiKey?.openai;
  } else if (body.modelProvider === 'XAI') {
    userApiKey = body.userApiKey?.xai;
  } else if (body.modelProvider === 'Google') {
    userApiKey = body.userApiKey?.google;
  }

  // Validate that we have the required API key
  if (!userApiKey) {
    const providerName = getProviderDisplayName(body.modelProvider);
    return new Response(
      JSON.stringify({
        code: 'missing-api-key',
        error: `${providerName} API key is required. Please add your ${providerName} API key in settings to use this model.`,
      }),
      {
        status: 402,
      },
    );
  }

  logger.info(`Using model provider: ${body.modelProvider} with user API key`);

  const recordUsageCb = async (
    lastMessage: Message | undefined,
    finalGeneration: { usage: LanguageModelUsage; providerMetadata?: ProviderMetadata },
  ) => {
    // Since we're using user API keys, we don't record usage to Convex
    // Users manage their own usage through their provider accounts
    if (getEnv('DISABLE_USAGE_REPORTING') !== '1') {
      await recordUsage(
        PROVISION_HOST,
        token,
        body.modelProvider,
        teamSlug,
        deploymentName,
        lastMessage,
        finalGeneration,
      );
    }
  };

  try {
    const totalMessageContent = messages.reduce((acc, message) => acc + message.content, '');
    logger.debug(`Total message length: ${totalMessageContent.split(' ').length} words`);

    const dataStream = await convexAgent({
      chatInitialId,
      firstUserMessage,
      messages,
      tracer,
      modelProvider: body.modelProvider,
      modelChoice: body.modelChoice,
      userApiKey,
      shouldDisableTools: body.shouldDisableTools,
      recordUsageCb,
      recordRawPromptsForDebugging: !!recordRawPromptsForDebugging,
      collapsedMessages: body.collapsedMessages,
      promptCharacterCounts: body.promptCharacterCounts,
      featureFlags: {
        enableResend: body.featureFlags.enableResend ?? false,
      },
    });

    return new Response(dataStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Text-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    logger.error(error);

    if (error.message?.includes('API key')) {
      throw new Response('Invalid or missing API key', {
        status: 401,
        statusText: 'Unauthorized',
      });
    }

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

// Helper function to get display name for providers
function getProviderDisplayName(provider: ModelProvider): string {
  switch (provider) {
    case 'Anthropic':
      return 'Anthropic';
    case 'OpenAI':
      return 'OpenAI';
    case 'XAI':
      return 'xAI';
    case 'Google':
      return 'Google';
    case 'Bedrock':
      return 'Amazon Bedrock';
    default:
      return 'API';
  }
}

// This function is no longer needed since all models require user API keys
// But keeping it for backward compatibility
function hasApiKeySetForProvider(
  userApiKey:
    | { preference: 'always' | 'quotaExhausted'; value?: string; openai?: string; xai?: string; google?: string }
    | undefined,
  provider: ModelProvider,
) {
  switch (provider) {
    case 'Anthropic':
    case 'Bedrock':
      return userApiKey?.value !== undefined;
    case 'OpenAI':
      return userApiKey?.openai !== undefined;
    case 'XAI':
      return userApiKey?.xai !== undefined;
    case 'Google':
      return userApiKey?.google !== undefined;
    default:
      return false;
  }
}
