import { useParams } from '@remix-run/react';
import { type ChatHistoryItem } from '@/types/ChatHistoryItem';
import { useEditChatDescription } from '@/lib/hooks/useEditChatDescription';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DeleteProject } from './delete-project';

interface HistoryItemProps {
  item: ChatHistoryItem;
  handleDeleteClick: (item: ChatHistoryItem) => void;
}

export function HistoryItem({ item, handleDeleteClick }: HistoryItemProps) {
  const { id: urlId } = useParams();
  const isActiveChat = urlId === item.id;

  const { editing, handleChange, handleBlur, handleSubmit, handleKeyDown, currentDescription, toggleEditMode } =
    useEditChatDescription({
      initialDescription: item.description,
      customChatId: item.id,
      syncWithGlobalStore: isActiveChat,
    });

  // Chats get a description from the first message, so have a fallback so
  // they render reasonably
  const description = currentDescription ?? 'New chat…';

  return (
    <Card className='group overflow-hidden transition-colors'>
      <CardContent className='p-3'>
        {editing ? (
          <div className='flex flex-1 items-center gap-2'>
            <Input
              autoFocus
              id='description'
              className='flex-1'
              value={currentDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />

            <Button variant='ghost' className='py-1 px-1' onClick={handleSubmit}>
              <Check className='size-4 text-green-500' />
            </Button>
          </div>
        ) : (
          <a href={`/chat/${item.urlId ?? item.initialId}`} className='flex items-center justify-between gap-2 w-full'>
            <CardTitle className='truncate flex-1 min-w-0'>{description}</CardTitle>

            <div className='flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0'>
              <Button
                variant='ghost'
                className='py-1 px-1'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleEditMode();
                }}
              >
                <Pencil className='size-4' />
              </Button>

              <Button
                variant='ghost'
                className='py-1 px-1'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeleteClick(item);
                }}
              >
                <Trash2 className='size-4 text-red-500' />
              </Button>
            </div>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
