import { Combobox } from '@ui/Combobox';
import { MagicWandIcon } from '@radix-ui/react-icons';
import type { ModelSelection } from '~/utils/constants';
import React from 'react';
import { Tooltip } from '@ui/Tooltip';
import { HandThumbUpIcon, KeyIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { captureMessage } from '@sentry/remix';
import { useLaunchDarkly } from '~/lib/hooks/useLaunchDarkly';
import { selectBestAvailableProvider, getAvailableApiKeys, hasApiKeySet } from '~/lib/common/apiKey';

export type ModelProvider = 'openai' | 'google' | 'xai' | 'anthropic' | 'auto';

export function displayModelProviderName(provider: ModelProvider) {
  switch (provider) {
    case 'openai':
      return 'OpenAI';
    case 'google':
      return 'Google';
    case 'xai':
      return 'xAI';
    case 'anthropic':
      return 'Anthropic';
    case 'auto':
      return 'Auto';
    default: {
      const exhaustiveCheck: never = provider;
      throw new Error(`Unknown model provider: ${exhaustiveCheck}`);
    }
  }
}

function svgIcon(url: string) {
  return <img className="size-4" height="16" width="16" src={url} alt="" />;
}

export interface ModelSelectorProps {
  modelSelection: ModelSelection;
  setModelSelection: (modelSelection: ModelSelection) => void;
  size?: 'sm' | 'md';
}

const providerToIcon: Record<string, React.ReactNode> = {
  auto: <MagicWandIcon />,
  openai: svgIcon('/icons/openai.svg'),
  anthropic: svgIcon('/icons/claude.svg'),
  google: svgIcon('/icons/gemini.svg'),
  xai: (
    <svg width="16" height="16" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M395.479 633.828L735.91 381.105C752.599 368.715 776.454 373.548 784.406 392.792C826.26 494.285 807.561 616.253 724.288 699.996C641.016 783.739 525.151 802.104 419.247 760.277L303.556 814.143C469.49 928.202 670.987 899.995 796.901 773.282C896.776 672.843 927.708 535.937 898.785 412.476L899.047 412.739C857.105 231.37 909.358 158.874 1016.4 10.6326C1018.93 7.11771 1021.47 3.60279 1024 0L883.144 141.651V141.212L395.392 633.916"
        fill="currentColor"
      />
      <path
        d="M325.226 695.251C206.128 580.84 226.662 403.776 328.285 301.668C403.431 226.097 526.549 195.254 634.026 240.596L749.454 186.994C728.657 171.88 702.007 155.623 671.424 144.2C533.19 86.9942 367.693 115.465 255.323 228.382C147.234 337.081 113.244 504.215 171.613 646.833C215.216 753.423 143.739 828.818 71.7385 904.916C46.2237 931.893 20.6216 958.87 0 987.429L325.139 695.339"
        fill="currentColor"
      />
    </svg>
  ),
};

// Updated models configuration - all models now require API keys
export const models: Partial<
  Record<
    ModelSelection,
    {
      name: string;
      recommended?: boolean;
      requireKey: boolean; // This is now always true
      provider: ModelProvider;
    }
  >
> = {
  auto: {
    name: 'Auto (Smart Selection)',
    provider: 'auto',
    recommended: true, // Making auto recommended since it's smart now
    requireKey: true,
  },
  'claude-4-sonnet': {
    name: 'Claude 4 Sonnet',
    provider: 'anthropic',
    recommended: false,
    requireKey: true,
  },
  'gemini-2.5-pro': {
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    recommended: false,
    requireKey: true,
  },
  'gpt-4.1': {
    name: 'GPT-4.1',
    provider: 'openai',
    recommended: false,
    requireKey: true,
  },
  'gpt-5': {
    name: 'GPT-5',
    provider: 'openai',
    recommended: false,
    requireKey: true,
  },
  'grok-3-mini': {
    name: 'Grok 3 Mini',
    provider: 'xai',
    recommended: false,
    requireKey: true,
  },
  'claude-3-5-haiku': {
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    recommended: false,
    requireKey: true,
  },
  'gpt-4.1-mini': {
    name: 'GPT-4.1 Mini',
    provider: 'openai',
    recommended: false,
    requireKey: true,
  },
} as const;

export const ModelSelector = React.memo(function ModelSelector({
  modelSelection,
  setModelSelection,
  size = 'md',
}: ModelSelectorProps) {
  const apiKey = useQuery(api.apiKeys.apiKeyForCurrentMember);
  const selectedModel = models[modelSelection];
  const { useGeminiAuto, enableGpt5 } = useLaunchDarkly();

  if (!selectedModel) {
    captureMessage(`Model ${modelSelection} not found`);
    setModelSelection('auto');
  }

  const availableModels = Object.entries(models).filter(([key]) => {
    if (key === 'gpt-5') {
      return enableGpt5;
    }
    return true;
  });

  // Get information about what auto mode would select
  const autoSelectionInfo = React.useMemo(() => {
    if (!apiKey) return null;
    return selectBestAvailableProvider(apiKey, useGeminiAuto);
  }, [apiKey, useGeminiAuto]);

  const availableApiKeys = React.useMemo(() => {
    return getAvailableApiKeys(apiKey);
  }, [apiKey]);

  return (
    <Combobox
      searchPlaceholder="Search models..."
      label="Select model"
      options={availableModels.map(([value, model]) => ({
        label: model.provider + ' ' + model.name,
        value: value as ModelSelection,
      }))}
      buttonClasses="w-fit"
      size={size}
      selectedOption={modelSelection}
      setSelectedOption={(option) => {
        if (!option) {
          throw new Error('Model selection set to null');
        }
        setModelSelection(option);
      }}
      Option={({ value, inButton }) => {
        const model = models[value as ModelSelection];
        if (!model) {
          return null;
        }

        const canUseModel = hasApiKeySet(value as ModelSelection, useGeminiAuto, apiKey);

        // Special handling for auto mode
        const isAuto = value === 'auto';
        const autoWillWork = isAuto && availableApiKeys.length > 0;

        return (
          <div className={'flex items-center gap-2'}>
            {providerToIcon[model.provider]}
            <div className="max-w-48 truncate">
              {model?.name}
              {isAuto && autoSelectionInfo && !inButton && (
                <span className="ml-1 text-xs text-content-secondary">→ {autoSelectionInfo.displayName}</span>
              )}
            </div>

            {!inButton && (
              <div className="ml-auto flex gap-1">
                {model.recommended && (
                  <Tooltip
                    tip="This model is recommended for most use cases. It will automatically select the best available provider based on your API keys."
                    side="right"
                  >
                    <HandThumbUpIcon className="size-4 text-content-secondary" />
                  </Tooltip>
                )}

                {isAuto && autoWillWork && (
                  <Tooltip
                    tip={`Auto mode will use: ${autoSelectionInfo?.displayName || 'Available provider'}`}
                    side="right"
                  >
                    <CheckCircleIcon className="size-4 text-green-500" />
                  </Tooltip>
                )}

                {!canUseModel && (
                  <Tooltip
                    tip={
                      isAuto
                        ? 'Auto mode requires at least one API key to be set.'
                        : 'You must set an API key for the relevant provider to use this model.'
                    }
                    side="right"
                  >
                    <KeyIcon className="size-4 text-content-secondary" />
                  </Tooltip>
                )}

                {canUseModel && !isAuto && (
                  <Tooltip tip="API key configured for this provider" side="right">
                    <CheckCircleIcon className="size-4 text-green-500" />
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
});
