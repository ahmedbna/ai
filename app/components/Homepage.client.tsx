import { Chat } from './chat/Chat';
import { ChefAuthProvider, useChefAuth } from './chat/ChefAuthWrapper';
import { useRef } from 'react';
import { useConvexChatHomepage } from '@/lib/stores/startup';
import { Toaster } from '@/components/ui/Toaster';
import { setPageLoadChatId } from '@/lib/stores/chatId';
import type { Message } from '@ai-sdk/react';
import type { PartCache } from '@/lib/hooks/useMessageParser';
import { UserProvider } from '@/components/UserProvider';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ApiKeyCard } from './settings/ApiKeyCard';
import { Spinner } from '@ui/Spinner';
import { useAuth } from '@workos-inc/authkit-react';
import { Loading } from './Loading';
import Particles from '@/components/ui/particles';
import { Button } from '@/components/ui/button';

export function Homepage() {
  // Set up a temporary chat ID early in app initialization. We'll
  // eventually replace this with a slug once we receive the first
  // artifact from the model if the user submits a prompt.
  const initialId = useRef(crypto.randomUUID());
  setPageLoadChatId(initialId.current);
  // NB: On this path, we render `ChatImpl` immediately.
  return (
    <>
      <ChefAuthProvider redirectIfUnauthenticated={false}>
        <UserProvider>
          <ChatWrapper initialId={initialId.current} />
        </UserProvider>
      </ChefAuthProvider>
      <Toaster />
    </>
  );
}

const ChatWrapper = ({ initialId }: { initialId: string }) => {
  const { signIn } = useAuth();
  const chefAuthState = useChefAuth();
  const apiKey = useQuery(api.apiKeys.apiKeyForCurrentMember);

  const partCache = useRef<PartCache>(new Map());
  const { storeMessageHistory, initializeChat, initialMessages, subchats } = useConvexChatHomepage(initialId);

  if (chefAuthState.kind === 'unauthenticated') {
    return (
      <div className='relative size-full overflow-hidden'>
        <div className='absolute inset-0 z-10 flex flex-col items-center  gap-4'>
          <div className='mx-auto mb-4 px-4 pt-36 text-center md:mt-16 lg:px-0'>
            <p className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-black leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-6xl'>
              BNA
            </p>

            <span className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-3xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10'>
              Idea to fullstack mobile app in seconds
            </span>
          </div>

          <Button
            size='lg'
            className='flex items-center justify-center px-8 py-8'
            onClick={() => {
              void signIn();
            }}
          >
            <img className='mr-2 size-8' src='/icons/Convex.svg' alt='Convex' />
            <span className='text-lg'>Login with Convex</span>
          </Button>
        </div>

        {/* This is the background image layer */}
        <div
          className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: 'url(/background.png)' }}
        />

        {/* This is the particles layer */}
        <Particles size={0.2} quantity={80} className='absolute inset-0 z-0' />
      </div>
    );
  }

  if (apiKey === undefined || chefAuthState.kind === 'loading') {
    return <Loading />;
  }

  if (apiKey === null || chefAuthState.kind !== 'fullyLoggedIn') {
    return (
      <div>
        <div className='mx-auto max-w-4xl px-4 py-8'>
          <ApiKeyCard />
        </div>
      </div>
    );
  }

  return (
    <Chat
      initialMessages={initialMessages ?? emptyList}
      partCache={partCache.current}
      storeMessageHistory={storeMessageHistory}
      initializeChat={initializeChat}
      isReload={false}
      hadSuccessfulDeploy={false}
      subchats={subchats}
    />
  );
};

const emptyList: Message[] = [];
