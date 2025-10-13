// @/components/chat/ApiKeyStatus.tsx
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { CheckCircleIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@ui/Tooltip';
import { Button } from '@ui/Button';
import { getAvailableApiKeys, selectBestAvailableProvider } from '@/lib/common/apiKey';
import { useLaunchDarkly } from '@/lib/hooks/useLaunchDarkly';
import type { ModelSelection } from '@/utils/constants';

interface ApiKeyStatusProps {
  modelSelection: ModelSelection;
  className?: string;
  showTitle?: boolean;
}

export function ApiKeyStatus({ modelSelection, className = '', showTitle = true }: ApiKeyStatusProps) {
  const apiKey = useQuery(api.apiKeys.apiKeyForCurrentMember);
  const { useGeminiAuto } = useLaunchDarkly();

  const availableKeys = React.useMemo(() => {
    return getAvailableApiKeys(apiKey);
  }, [apiKey]);

  const autoSelection = React.useMemo(() => {
    if (modelSelection === 'auto') {
      return selectBestAvailableProvider(apiKey, useGeminiAuto);
    }
    return null;
  }, [apiKey, modelSelection, useGeminiAuto]);

  if (!apiKey) {
    return null;
  }

  const hasAnyKeys = availableKeys.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {showTitle && (
        <div className='flex items-center gap-2'>
          <KeyIcon className='size-4 text-content-secondary' />
          <span className='text-sm font-medium'>API Key Status</span>
        </div>
      )}

      {!hasAnyKeys && (
        <div className='border-warning bg-warning/5 flex items-center gap-2 rounded-md border p-3'>
          <ExclamationCircleIcon className='text-warning size-4' />
          <div className='flex-1'>
            <p className='text-warning text-sm'>No API keys configured</p>
            <p className='text-warning/80 text-xs'>Add an API key to start using models</p>
          </div>
          <Button href='/settings' size='xs' variant='neutral'>
            Add Key
          </Button>
        </div>
      )}

      {hasAnyKeys && (
        <div className='space-y-2'>
          {modelSelection === 'auto' && autoSelection && (
            <div className='border-success bg-success/5 flex items-center gap-2 rounded-md border p-2'>
              <CheckCircleIcon className='text-success size-4' />
              <div className='flex-1'>
                <p className='text-success text-sm'>
                  Auto mode will use: <strong>{autoSelection.displayName}</strong>
                </p>
                <p className='text-success/80 text-xs'>
                  Model: {getModelNameForSelection(autoSelection.modelSelection)}
                </p>
              </div>
            </div>
          )}

          <div className='space-y-1'>
            {['anthropic', 'openai', 'google', 'xai'].map((provider) => {
              const providerKey = availableKeys.find((key) => key.provider === provider);
              const hasKey = !!providerKey?.hasKey;

              return (
                <div key={provider} className='flex items-center gap-2 text-xs'>
                  <div className='flex w-20 items-center gap-1'>
                    {hasKey ? (
                      <CheckCircleIcon className='text-success size-3' />
                    ) : (
                      <div className='size-3 rounded-full border border-content-tertiary' />
                    )}
                    <span className={hasKey ? 'text-content-primary' : 'text-content-tertiary'}>
                      {providerKey?.displayName || getProviderDisplayName(provider)}
                    </span>
                  </div>
                  {!hasKey && <span className='text-content-tertiary'>No key</span>}
                </div>
              );
            })}
          </div>

          {availableKeys.length > 0 && (
            <div className='pt-1'>
              <Button href='/settings' size='xs' className='text-xs'>
                Manage API Keys
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getModelNameForSelection(selection: ModelSelection): string {
  const modelNames: Record<ModelSelection, string> = {
    auto: 'Auto',
    'gpt-5': 'GPT-5',
    'claude-sonnet-4-5': 'Claude Sonnet 4.5',
    'grok-code-fast-1': 'Grok Code Fast 1',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
  };
  return modelNames[selection] || selection;
}

function getProviderDisplayName(provider: string): string {
  const displayNames: Record<string, string> = {
    anthropic: 'Anthropic',
    openai: 'OpenAI',
    google: 'Google',
    xai: 'xAI',
  };
  return displayNames[provider] || provider;
}
