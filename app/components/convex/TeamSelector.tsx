import * as React from 'react';
import { useStore } from '@nanostores/react';
import { Check } from 'lucide-react';

import { convexTeamsStore } from '@/lib/stores/convexTeams';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Reusable icon for the team selector, similar to the original implementation
function TeamIcon() {
  return <img className="size-4" height="16" width="16" src="/icons/Convex.svg" alt="Team" />;
}

export interface TeamSelectorProps {
  selectedTeamSlug: string | null;
  setSelectedTeamSlug: (teamSlug: string) => void;
  description?: string;
  size?: 'sm' | 'md';
}

export const TeamSelector = React.memo(function TeamSelector({
  selectedTeamSlug,
  setSelectedTeamSlug,
  description,
  size = 'md',
}: TeamSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const teams = useStore(convexTeamsStore);

  const selectedTeam = teams?.find((t) => t.slug === selectedTeamSlug) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between gap-2 h-8 text-sm"
          disabled={!teams}
        >
          <div className="flex items-center gap-2">
            {selectedTeam && <TeamIcon />}
            <span className="truncate max-w-[150px]">{selectedTeam?.name || 'Select a team...'}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {/* Header section to display title and description, as in the original component */}
              <div className="flex flex-col gap-0.5 p-2 text-sm">
                <h5 className="font-medium">Select Team</h5>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
              </div>
              {teams?.map((team) => (
                <CommandItem
                  key={team.slug}
                  value={team.slug}
                  onSelect={(currentValue) => {
                    setSelectedTeamSlug(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', selectedTeamSlug === team.slug ? 'opacity-100' : 'opacity-0')} />
                  <div className="truncate">{team.name}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
