// @/lib/common/apiKey.ts
import type { Doc } from '@convex/_generated/dataModel';
import { type ModelSelection } from '@/utils/constants';

export interface ApiKeyInfo {
  provider: 'anthropic' | 'openai' | 'xai' | 'google';
  displayName: string;
  hasKey: boolean;
  lastUpdated?: number; // timestamp when key was last set
}

// Updated hasApiKeySet function - all models now require API keys
export function hasApiKeySet(
  modelSelection: ModelSelection,
  useGeminiAuto: boolean,
  apiKey?: Doc<'convexMembers'>['apiKey'] | null,
) {
  if (!apiKey) {
    return false;
  }

  switch (modelSelection) {
    case 'auto':
      // For auto, check if we have any available API key
      return hasAnyApiKeySet(apiKey);
    case 'claude-3-5-haiku':
    case 'claude-4-sonnet':
      return !!apiKey.value?.trim();
    case 'gpt-4.1':
    case 'gpt-4.1-mini':
    case 'gpt-5':
      return !!apiKey.openai?.trim();
    case 'grok-3-mini':
      return !!apiKey.xai?.trim();
    case 'gemini-2.5-pro':
      return !!apiKey.google?.trim();
    default: {
      const _exhaustiveCheck: never = modelSelection;
      return false;
    }
  }
}

export function hasAnyApiKeySet(apiKey?: Doc<'convexMembers'>['apiKey'] | null) {
  if (!apiKey) {
    return false;
  }
  return Object.entries(apiKey).some(([key, value]) => {
    if (key === 'preference') {
      return false;
    }
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return false;
  });
}

// Get all available API keys with their info
export function getAvailableApiKeys(apiKey?: Doc<'convexMembers'>['apiKey'] | null): ApiKeyInfo[] {
  if (!apiKey) {
    return [];
  }

  const providers: Array<{
    provider: 'anthropic' | 'openai' | 'xai' | 'google';
    displayName: string;
    keyField: keyof typeof apiKey;
  }> = [
    { provider: 'anthropic', displayName: 'Anthropic', keyField: 'value' },
    { provider: 'openai', displayName: 'OpenAI', keyField: 'openai' },
    { provider: 'xai', displayName: 'xAI', keyField: 'xai' },
    { provider: 'google', displayName: 'Google', keyField: 'google' },
  ];

  return providers
    .map(({ provider, displayName, keyField }) => ({
      provider,
      displayName,
      hasKey: !!(apiKey[keyField] as string)?.trim(),
      lastUpdated: (apiKey as any)[`${keyField}LastUpdated`], // assuming you track this
    }))
    .filter((info) => info.hasKey);
}

// Smart auto-selection logic
export function selectBestAvailableProvider(
  apiKey?: Doc<'convexMembers'>['apiKey'] | null,
  useGeminiAuto?: boolean,
  userPreference?: 'anthropic' | 'openai' | 'xai' | 'google',
): {
  provider: 'anthropic' | 'openai' | 'xai' | 'google';
  displayName: string;
  modelSelection: ModelSelection;
} | null {
  const availableKeys = getAvailableApiKeys(apiKey);

  if (availableKeys.length === 0) {
    return null;
  }

  // 1. If user has a specific preference and key is available, use it
  if (userPreference) {
    const preferredKey = availableKeys.find((key) => key.provider === userPreference);
    if (preferredKey) {
      return {
        provider: preferredKey.provider,
        displayName: preferredKey.displayName,
        modelSelection: getDefaultModelForProvider(preferredKey.provider),
      };
    }
  }

  // 2. Use feature flag logic for default preference
  if (useGeminiAuto && availableKeys.some((key) => key.provider === 'google')) {
    return {
      provider: 'google',
      displayName: 'Google',
      modelSelection: 'gemini-2.5-pro',
    };
  }

  // 3. Prefer Anthropic if available (default behavior)
  const anthropicKey = availableKeys.find((key) => key.provider === 'anthropic');
  if (anthropicKey) {
    return {
      provider: 'anthropic',
      displayName: 'Anthropic',
      modelSelection: 'claude-4-sonnet',
    };
  }

  // 4. Fall back to most recently updated key
  const mostRecentKey = availableKeys
    .filter((key) => key.lastUpdated)
    .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))[0];

  if (mostRecentKey) {
    return {
      provider: mostRecentKey.provider,
      displayName: mostRecentKey.displayName,
      modelSelection: getDefaultModelForProvider(mostRecentKey.provider),
    };
  }

  // 5. Fall back to first available key
  const firstAvailable = availableKeys[0];
  return {
    provider: firstAvailable.provider,
    displayName: firstAvailable.displayName,
    modelSelection: getDefaultModelForProvider(firstAvailable.provider),
  };
}

// Get default model for each provider
function getDefaultModelForProvider(provider: 'anthropic' | 'openai' | 'xai' | 'google'): ModelSelection {
  switch (provider) {
    case 'anthropic':
      return 'claude-4-sonnet';
    case 'openai':
      return 'gpt-4.1';
    case 'google':
      return 'gemini-2.5-pro';
    case 'xai':
      return 'grok-3-mini';
    default:
      return 'claude-4-sonnet';
  }
}

// Get the required provider for a model
export function getProviderForModel(
  modelSelection: ModelSelection,
  useGeminiAuto: boolean,
): {
  providerName: 'anthropic' | 'openai' | 'xai' | 'google';
  displayName: string;
} {
  switch (modelSelection) {
    case 'auto':
      if (useGeminiAuto) {
        return { providerName: 'google', displayName: 'Google' };
      }
      return { providerName: 'anthropic', displayName: 'Anthropic' };
    case 'claude-3-5-haiku':
    case 'claude-4-sonnet':
      return { providerName: 'anthropic', displayName: 'Anthropic' };
    case 'gpt-4.1':
    case 'gpt-4.1-mini':
    case 'gpt-5':
      return { providerName: 'openai', displayName: 'OpenAI' };
    case 'grok-3-mini':
      return { providerName: 'xai', displayName: 'xAI' };
    case 'gemini-2.5-pro':
      return { providerName: 'google', displayName: 'Google' };
    default: {
      const _exhaustiveCheck: never = modelSelection;
      throw new Error(`Unknown model: ${_exhaustiveCheck}`);
    }
  }
}

// Helper to get provider key field mapping
export function getProviderKeyField(
  provider: 'anthropic' | 'openai' | 'xai' | 'google',
): 'value' | 'openai' | 'xai' | 'google' {
  switch (provider) {
    case 'anthropic':
      return 'value';
    case 'openai':
      return 'openai';
    case 'xai':
      return 'xai';
    case 'google':
      return 'google';
    default:
      return 'value';
  }
}
