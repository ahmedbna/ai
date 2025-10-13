import * as React from 'react';
import { KeyRound, Lock } from 'lucide-react';
import { MagicWandIcon } from '@radix-ui/react-icons';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { captureMessage } from '@sentry/remix';
import { useLaunchDarkly } from '@/lib/hooks/useLaunchDarkly';
import { selectBestAvailableProvider, getAvailableApiKeys, hasApiKeySet } from '@/lib/common/apiKey';
import type { ModelSelection } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip } from '@ui/Tooltip';

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
  return <img className='size-4' height='16' width='16' src={url} alt='' />;
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
    <svg width='16' height='16' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M395.479 633.828L735.91 381.105C752.599 368.715 776.454 373.548 784.406 392.792C826.26 494.285 807.561 616.253 724.288 699.996C641.016 783.739 525.151 802.104 419.247 760.277L303.556 814.143C469.49 928.202 670.987 899.995 796.901 773.282C896.776 672.843 927.708 535.937 898.785 412.476L899.047 412.739C857.105 231.37 909.358 158.874 1016.4 10.6326C1018.93 7.11771 1021.47 3.60279 1024 0L883.144 141.651V141.212L395.392 633.916'
        fill='currentColor'
      />
      <path
        d='M325.226 695.251C206.128 580.84 226.662 403.776 328.285 301.668C403.431 226.097 526.549 195.254 634.026 240.596L749.454 186.994C728.657 171.88 702.007 155.623 671.424 144.2C533.19 86.9942 367.693 115.465 255.323 228.382C147.234 337.081 113.244 504.215 171.613 646.833C215.216 753.423 143.739 828.818 71.7385 904.916C46.2237 931.893 20.6216 958.87 0 987.429L325.139 695.339'
        fill='currentColor'
      />
    </svg>
  ),
};

export const models: Partial<
  Record<
    ModelSelection,
    {
      name: string;
      recommended?: boolean;
      requireKey: boolean;
      provider: ModelProvider;
    }
  >
> = {
  auto: {
    name: 'Auto (Smart Selection)',
    provider: 'auto',
    recommended: true,
    requireKey: true,
  },
  'claude-sonnet-4-5': {
    name: 'Claude Sonnet 4.5',
    provider: 'anthropic',
    recommended: false,
    requireKey: true,
  },
  'gpt-5': {
    name: 'GPT-5',
    provider: 'openai',
    recommended: false,
    requireKey: true,
  },
  'gemini-2.5-pro': {
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    recommended: false,
    requireKey: true,
  },
  'grok-code-fast-1': {
    name: 'Grok Code Fast 1',
    provider: 'xai',
    recommended: false,
    requireKey: true,
  },
} as const;

export const ModelSelector = React.memo(function ModelSelector({
  modelSelection,
  setModelSelection,
  size = 'md',
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const apiKey = useQuery(api.apiKeys.apiKeyForCurrentMember);
  const selectedModel = models[modelSelection];
  const { useGeminiAuto, enableGpt5 } = useLaunchDarkly();

  if (!selectedModel) {
    captureMessage(`Model ${modelSelection} not found`);
    setModelSelection('auto');
  }

  const availableModels = Object.entries(models).filter(([key]) => {
    return true;
  });

  const autoSelectionInfo = React.useMemo(() => {
    if (!apiKey) {
      return null;
    }
    return selectBestAvailableProvider(apiKey, useGeminiAuto);
  }, [apiKey, useGeminiAuto]);

  const availableApiKeys = React.useMemo(() => {
    return getAvailableApiKeys(apiKey);
  }, [apiKey]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='h-8 w-fit justify-between gap-2 text-sm'
        >
          <div className='flex items-center gap-2'>
            {selectedModel && providerToIcon[selectedModel.provider]}
            <span className='truncate'>{selectedModel?.name || 'Select model...'}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search models...' className='h-9' />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {availableModels.map(([value, model]) => {
                const canUseModel = hasApiKeySet(value as ModelSelection, useGeminiAuto, apiKey);
                const isAuto = value === 'auto';
                const autoWillWork = isAuto && availableApiKeys.length > 0;

                const isSelected = modelSelection === value;

                return (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={(currentValue) => {
                      setModelSelection(currentValue as ModelSelection);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex items-center rounded-md gap-2 cursor-pointer aria-selected:bg-green-500 aria-selected:text-accent-foreground hover:bg-secondary',
                      isSelected && 'bg-secondary',
                    )}
                  >
                    {providerToIcon[model.provider]}
                    <div className='flex-1 truncate'>
                      {model.name}
                      {isAuto && autoSelectionInfo && (
                        <span className={cn('ml-1 text-xs text-muted-foreground')}>
                          → {autoSelectionInfo.displayName}
                        </span>
                      )}
                    </div>

                    <div className='flex items-center gap-1'>
                      {/* {model.recommended && (
                        <Tooltip
                          tip="This model is recommended for most use cases. It will automatically select the best available provider based on your API keys."
                          side="right"
                        >
                          <HandThumbUpIcon className="size-4 text-muted-foreground" />
                        </Tooltip>
                      )} */}

                      {isAuto && autoWillWork && (
                        <Tooltip
                          tip={`Auto mode will use: ${autoSelectionInfo?.displayName || 'Available provider'}`}
                          side='right'
                        >
                          <KeyRound className='size-4 text-green-500' />
                        </Tooltip>
                      )}

                      {!canUseModel && (
                        <Tooltip
                          tip={
                            isAuto
                              ? 'Auto mode requires at least one API key to be set.'
                              : 'You must set an API key for the relevant provider to use this model.'
                          }
                          side='right'
                        >
                          <Lock className='size-4 text-red-500' />
                        </Tooltip>
                      )}

                      {canUseModel && !isAuto && (
                        <Tooltip tip='API key configured for this provider' side='right'>
                          <KeyRound className='size-4 text-green-500' />
                        </Tooltip>
                      )}

                      {/* {isSelected && <Check className="ml-1 h-4 w-4 text-green-600 dark:text-green-400" />} */}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
