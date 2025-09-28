import { Chat } from './chat/Chat';
import { ChefAuthProvider, useChefAuth } from './chat/ChefAuthWrapper';
import { useRef } from 'react';
import { useConvexChatHomepage } from '~/lib/stores/startup';
import { Toaster } from '~/components/ui/Toaster';
import { setPageLoadChatId } from '~/lib/stores/chatId';
import type { Message } from '@ai-sdk/react';
import type { PartCache } from '~/lib/hooks/useMessageParser';
import { UserProvider } from '~/components/UserProvider';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ApiKeyCard } from './settings/ApiKeyCard';
import { Spinner } from '@ui/Spinner';
import { useAuth } from '@workos-inc/authkit-react';
import { Button } from '@ui/Button';

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
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <Button
          variant="neutral"
          className="text-xs font-normal"
          icon={<img className="size-4" src="/icons/Convex.svg" alt="Convex" />}
          onClick={() => {
            void signIn();
          }}
        >
          <>
            <span>Sign in</span>
          </>
        </Button>
      </div>
    );
  }

  if (apiKey === undefined || chefAuthState.kind === 'loading') {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (apiKey === null || chefAuthState.kind !== 'fullyLoggedIn') {
    return (
      <div>
        <div className="mx-auto max-w-4xl px-4 py-8">
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
