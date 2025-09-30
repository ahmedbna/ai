import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@ui/ConfirmationDialog';
import { type ChatHistoryItem } from '@/types/ChatHistoryItem';
import { logger } from 'chef-agent/utils/logger';
import { Menu as MenuComponent, MenuItem as MenuItemComponent } from '@ui/Menu';
import { useSearchFilter } from '@/lib/hooks/useSearchFilter';
import { classNames } from '@/utils/classNames';
import { useConvex, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { getConvexAuthToken, useConvexSessionIdOrNullOrLoading } from '@/lib/stores/sessionId';
import { getKnownInitialId } from '@/lib/stores/chatId';
import { TextInput } from '@ui/TextInput';
import { Checkbox } from '@ui/Checkbox';
import { PlusIcon } from '@radix-ui/react-icons';
import { binDates } from '../sidebar/date-binning';
import { HistoryItem } from '../sidebar/HistoryItem';
import { profileStore, setProfile } from '@/lib/stores/profile';
import { useStore } from '@nanostores/react';
import { PersonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';
import { FeedbackButton } from '../header/FeedbackButton';
import { DiscordButton } from '../header/DiscordButton';
import { useAuth } from '@workos-inc/authkit-react';
import { SESSION_ID_KEY } from '@/components/chat/ChefAuthWrapper';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Link, User2 } from 'lucide-react';
import { Button } from '../ui/button';
import { DeleteProject } from '../sidebar/delete-project';

type ModalContent = { type: 'delete'; item: ChatHistoryItem } | null;

export const Projects = memo(() => {
  const sessionId = useConvexSessionIdOrNullOrLoading();
  const convex = useConvex();
  const profile = useStore(profileStore);
  const { signOut } = useAuth();

  const list = useQuery(api.messages.getAll, sessionId ? { sessionId } : 'skip') ?? [];
  const [dialogContent, setDialogContent] = useState<ModalContent>(null);
  const [shouldDeleteConvexProject, setShouldDeleteConvexProject] = useState(false);
  const convexProjectInfo = useQuery(
    api.convexProjects.loadConnectedConvexProjectCredentials,
    dialogContent?.type === 'delete' && sessionId
      ? {
          sessionId,
          chatId: dialogContent.item.initialId,
        }
      : 'skip',
  );

  const { filteredItems: filteredList, handleSearchChange } = useSearchFilter({
    items: list,
    searchFields: ['description'],
  });

  const deleteItem = useCallback(
    (item: ChatHistoryItem) => {
      const accessToken = getConvexAuthToken(convex);
      if (!sessionId || !accessToken) {
        return;
      }
      convex
        .action(api.messages.remove, {
          id: item.id,
          sessionId,
          teamSlug: convexProjectInfo?.teamSlug,
          projectSlug: convexProjectInfo?.projectSlug,
          shouldDeleteConvexProject: shouldDeleteConvexProject && convexProjectInfo?.kind === 'connected',
          accessToken,
        })
        .then((result) => {
          if (result && result.kind === 'error') {
            toast.error(result.error);
          }
          if (getKnownInitialId() === item.initialId) {
            // hard page navigation to clear the stores
            window.location.pathname = '/';
          }
        })
        .catch((error) => {
          toast.error('Failed to delete conversation');
          logger.error(error);
        });
    },
    [
      convex,
      sessionId,
      convexProjectInfo?.teamSlug,
      convexProjectInfo?.projectSlug,
      convexProjectInfo?.kind,
      shouldDeleteConvexProject,
    ],
  );

  const closeDialog = () => {
    setDialogContent(null);
    setShouldDeleteConvexProject(false);
  };

  const handleDeleteClick = useCallback((item: ChatHistoryItem) => {
    setDialogContent({ type: 'delete', item });
  }, []);

  const handleLogout = () => {
    setProfile(null);
    window.localStorage.removeItem(SESSION_ID_KEY);
    signOut({ returnTo: window.location.origin });
  };

  const handleSettingsClick = () => {
    window.location.pathname = '/settings';
  };

  // Don't show the page when logged out
  if (sessionId === null) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>Sign in to view projects</h2>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>You need to be signed in to view your projects.</p>
        </div>
      </div>
    );
  }

  return (
    <footer
      id='footer'
      className='mt-44 flex size-full min-h-[800px] flex-col rounded-t-3xl bg-white/75 backdrop-blur-lg dark:bg-black/75 '
    >
      <div className='rounded-t-3xl border-b border-gray-200 px-6 py-4 dark:border-gray-800'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Your Apps</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>Manage and organize your apps</p>
          </div>

          <div className='flex items-center gap-3'>
            <Input
              type='search'
              id='search-projects'
              placeholder='Search apps...'
              onChange={handleSearchChange}
              aria-label='Search projects'
              className='min-w-72 h-10'
            />

            {profile ? (
              <Button asChild onClick={handleSettingsClick} className='px-0 py-0' variant='ghost' size='icon'>
                <Avatar>
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-auto p-6'>
        {filteredList.length === 0 && (
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <div className='text-4xl'>📁</div>
              <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-gray-100'>
                {list.length === 0 ? 'No apps yet' : 'No apps found'}
              </h3>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                {list.length === 0
                  ? 'Start your first project to see it listed here.'
                  : 'Try adjusting your search terms.'}
              </p>
              {/* {list.length === 0 && (
                <Button className='mt-4' href='/' icon={<PlusIcon />}>
                  Create your first project
                </Button>
              )} */}
            </div>
          </div>
        )}

        {/* Projects grouped by date */}
        <div className='space-y-8'>
          {binDates(filteredList).map(({ category, items }) => (
            <div key={category} className='space-y-4'>
              <div className='flex items-center'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{category}</h2>
                <div className='ml-3 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
                  {items.length}
                </div>
              </div>

              {/* Grid layout for projects */}
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {items.map((item) => (
                  <div key={item.initialId}>
                    <HistoryItem item={item} handleDeleteClick={handleDeleteClick} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DeleteProject
        open={dialogContent?.type === 'delete'}
        setOpen={closeDialog}
        name={dialogContent?.item.description}
        connected={convexProjectInfo?.kind === 'connected'}
        projectSlug={convexProjectInfo?.projectSlug}
        shouldDeleteConvexProject={shouldDeleteConvexProject}
        setShouldDeleteConvexProject={setShouldDeleteConvexProject}
        onConfirm={() => {
          if (dialogContent?.type === 'delete') {
            deleteItem(dialogContent.item);
          }
        }}
      />

      <div className='flex w-full flex-col justify-between gap-2 p-4 transition-opacity sm:flex-row'>
        <div className='flex items-end gap-3 font-display text-sm font-medium text-content-tertiary'>
          <p className='flex items-center'>
            Made&nbsp;by{' '}
            <a
              href='https://www.convex.dev'
              className='transition-colors hover:text-content-primary'
              aria-label='Convex'
            >
              <svg
                width='223'
                height='37'
                viewBox='0 0 223 37'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='ml-1.5 mt-[0.13em] h-[.7em] w-auto'
              >
                <path
                  d='M5.29382 31.6648C1.95422 28.6785 0.284424 24.2644 0.284424 18.434C0.284424 12.6036 1.98662 8.18965 5.39652 5.20335C8.80092 2.21695 13.4591 0.720947 19.3655 0.720947C21.8188 0.720947 23.9858 0.897345 25.8717 1.26134C27.7577 1.61974 29.5626 2.22835 31.2864 3.09295V12.5524C28.6061 11.2157 25.5637 10.5445 22.1593 10.5445C19.1601 10.5445 16.9446 11.1417 15.5179 12.3363C14.0859 13.5308 13.3726 15.5615 13.3726 18.434C13.3726 21.2099 14.0751 23.2178 15.4855 24.4578C16.8905 25.7035 19.1169 26.3235 22.1647 26.3235C25.3908 26.3235 28.4548 25.5329 31.3621 23.9573V33.8547C28.136 35.3849 24.1155 36.1471 19.3006 36.1471C13.2969 36.1471 8.63342 34.6511 5.29382 31.6648Z'
                  fill='currentColor'
                />
                <path
                  d='M34.2698 18.4278C34.2698 12.6429 35.8369 8.24604 38.9711 5.23124C42.1054 2.21654 46.8284 0.714844 53.145 0.714844C59.506 0.714844 64.261 2.22224 67.422 5.23124C70.578 8.24034 72.156 12.6429 72.156 18.4278C72.156 30.2366 65.818 36.1409 53.145 36.1409C40.5599 36.1466 34.2698 30.2422 34.2698 18.4278ZM57.679 24.4573C58.609 23.2116 59.074 21.2037 59.074 18.4335C59.074 15.7089 58.609 13.7123 57.679 12.4439C56.75 11.1754 55.237 10.544 53.145 10.544C51.103 10.544 49.6222 11.1811 48.7143 12.4439C47.8065 13.7123 47.3525 15.7089 47.3525 18.4335C47.3525 21.2094 47.8065 23.2173 48.7143 24.4573C49.6222 25.7031 51.097 26.3231 53.145 26.3231C55.237 26.3231 56.744 25.6974 57.679 24.4573Z'
                  fill='currentColor'
                />
                <path
                  d='M75.1379 1.43154H87.1289L87.4699 4.01394C88.7879 3.05834 90.4689 2.26774 92.5109 1.64764C94.5539 1.02764 96.6669 0.714844 98.8499 0.714844C102.892 0.714844 105.843 1.76714 107.707 3.87174C109.571 5.97644 110.501 9.22434 110.501 13.627V35.4299H97.6939V14.9865C97.6939 13.4564 97.3639 12.3585 96.7049 11.6873C96.0459 11.0161 94.9429 10.6862 93.3979 10.6862C92.4469 10.6862 91.4679 10.9137 90.4689 11.3688C89.4689 11.8238 88.6309 12.4097 87.9449 13.1264V35.4299H75.1379V1.43154Z'
                  fill='currentColor'
                />
                <path
                  d='M110.538 1.43164H123.891L130.024 21.3688L136.158 1.43164H149.511L136.768 35.43H123.275L110.538 1.43164Z'
                  fill='currentColor'
                />
                <path
                  d='M153.543 32.5061C149.695 29.4686 147.896 24.1957 147.896 18.5018C147.896 12.9558 149.328 8.38824 152.597 5.23124C155.866 2.07434 160.849 0.714844 167.139 0.714844C172.926 0.714844 177.476 2.12554 180.8 4.94684C184.118 7.76824 185.782 11.6191 185.782 16.4939V22.4494H161.427C162.032 24.2184 162.799 25.4983 164.685 26.2889C166.571 27.0796 169.203 27.4721 172.57 27.4721C174.58 27.4721 176.633 27.3071 178.719 26.9715C179.454 26.8521 180.665 26.6644 181.302 26.5222V34.7871C178.119 35.6972 173.877 36.1523 169.095 36.1523C162.659 36.1466 157.39 35.5436 153.543 32.5061ZM172.326 15.1344C172.326 13.4507 170.484 9.82734 166.782 9.82734C163.442 9.82734 161.238 13.3938 161.238 15.1344H172.326Z'
                  fill='currentColor'
                />
                <path
                  d='M195.838 18.1435L183.846 1.43164H197.745L222.273 35.43H208.24L202.787 27.8249L197.335 35.43H183.365L195.838 18.1435Z'
                  fill='currentColor'
                />
                <path
                  d='M207.931 1.43164H221.765L211.147 16.3176L204.122 6.77854L207.931 1.43164Z'
                  fill='currentColor'
                />
              </svg>
            </a>
          </p>
          <hr className='h-4 w-0.5 bg-content-tertiary opacity-20' />
          <p className='flex items-center'>
            Powered&nbsp;by{' '}
            <a
              href='https://bolt.new'
              className='contents transition-colors hover:text-content-primary'
              aria-label='Bolt'
            >
              <svg
                width='51'
                height='21.9'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 51 21.9'
                fill='currentColor'
                className='ml-[0.4em] h-[1em] w-auto'
              >
                <path d='M24.1 19.3c-4.7 0-7-2.7-7-6.1s3.2-7.7 7.9-7.7 7 2.7 7 6.1-3.2 7.7-7.9 7.7Zm.2-4.3c1.6 0 2.7-1.5 2.7-3.1s-.8-2-2.2-2-2.7 1.5-2.7 3.1.8 2 2.2 2ZM37 19h-4.9l4-18.2H41l-4 18.1Z' />
                <path
                  d='M9.6 19.3c-1.5 0-3-.5-3.8-1.7L5.5 19 0 21.9.6 19 4.6.8h4.9L8.1 7.2c1.1-1.2 2.2-1.7 3.6-1.7 3 0 4.9 1.9 4.9 5.5s-2.3 8.3-7 8.3Zm1.9-7.3c0 1.7-1.2 3-2.8 3s-1.7-.3-2.2-.9l.8-3.3c.6-.6 1.2-.9 2-.9 1.2 0 2.2.9 2.2 2.2Z'
                  fillRule='evenodd'
                />
                <path d='M46.1 19.3c-2.8 0-4.9-1-4.9-3.3s0-.7.1-1l1.1-4.9h-2.2l1-4.2h2.2l.8-3.6L49.7 0l-.6 2.3-.8 3.6H51l-1 4.2h-2.7l-.7 3.2v.6c0 .6.4 1.1 1.2 1.1s.6 0 .7-.1v3.9c-.5.4-1.4.5-2.3.5Z' />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
});

Projects.displayName = 'Projects';
