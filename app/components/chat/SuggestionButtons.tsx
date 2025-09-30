import { ArrowUpIcon, VideoIcon } from '@radix-ui/react-icons';
import { SUGGESTIONS } from 'bna-agent/constants';
import { Button } from '@/components/ui/button';

interface SuggestionButtonsProps {
  chatStarted: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  disabled?: boolean;
}

export const SuggestionButtons = ({ chatStarted, onSuggestionClick, disabled }: SuggestionButtonsProps) => {
  if (chatStarted) {
    return null;
  }

  return (
    <div id='suggestions'>
      <div className='mt-6 flex flex-wrap justify-center gap-4'>
        {SUGGESTIONS.map((suggestion) => (
          <Button key={suggestion.title} onClick={() => onSuggestionClick?.(suggestion.prompt)} disabled={disabled}>
            {suggestion.title}
          </Button>
        ))}
      </div>
    </div>
  );
};
