import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  open: boolean;
  name?: string;
  projectSlug?: string;
  connected?: boolean;
  shouldDeleteConvexProject: boolean;
  setOpen: (value: boolean) => void;
  setShouldDeleteConvexProject: (value: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export const DeleteProject = ({
  open,
  setOpen,
  name,
  projectSlug,
  connected,
  shouldDeleteConvexProject,
  setShouldDeleteConvexProject,
  onConfirm,
}: Props) => {
  const [validationInput, setValidationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const projectName = name || 'New project...';
  const isValidated = validationInput === projectName;

  const handleConfirm = async () => {
    if (!isValidated) return;

    setIsDeleting(true);
    try {
      await onConfirm();
      setOpen(false);
      setValidationInput('');
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setValidationInput('');
      setShouldDeleteConvexProject(false);
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>Delete Project</DialogTitle>
          <DialogDescription>
            You are about to delete <span className='font-medium text-foreground'>{projectName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {connected && (
            <Label
              htmlFor='delete-convex-project'
              className='flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-red-600 has-[[data-state=checked]]:bg-red-50 dark:has-[[data-state=checked]]:border-red-900 dark:has-[[data-state=checked]]:bg-red-950'
            >
              <Checkbox
                id='delete-convex-project'
                checked={shouldDeleteConvexProject}
                onCheckedChange={(checked) => setShouldDeleteConvexProject(checked === true)}
                className='mt-0.5 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white dark:data-[state=checked]:border-red-700 dark:data-[state=checked]:bg-red-700'
              />
              <div className='grid gap-1.5'>
                <p className='text-sm font-medium leading-none'>Also delete the associated Convex project</p>
                <p className='text-sm text-muted-foreground'>
                  <a
                    href={`https://dashboard.convex.dev/p/${projectSlug}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline dark:text-blue-400'
                    onClick={(e) => e.stopPropagation()}
                  >
                    {projectSlug || 'project'}
                  </a>
                </p>
              </div>
            </Label>
          )}

          <div className='space-y-2'>
            <Label htmlFor='validation-input' className='text-sm font-medium'>
              Type <span className='font-mono text-destructive'>{projectName}</span> to confirm
            </Label>
            <Input
              id='validation-input'
              type='text'
              placeholder={projectName}
              value={validationInput}
              onChange={(e) => setValidationInput(e.target.value)}
              className='font-mono'
              autoComplete='off'
            />
          </div>
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <Button variant='outline' disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant='destructive' onClick={handleConfirm} disabled={!isValidated || isDeleting}>
            {isDeleting ? <Spinner /> : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
