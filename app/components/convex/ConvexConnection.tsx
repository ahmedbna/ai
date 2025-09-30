import { useState } from 'react';
import { useConvexSessionIdOrNullOrLoading } from '~/lib/stores/sessionId';
import { useChatId } from '~/lib/stores/chatId';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { ConvexConnectButton } from '~/components/convex/ConvexConnectButton';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { AlertCircle } from 'lucide-react';

// Shadcn/ui component imports
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Alert, AlertDescription } from '~/components/ui/alert';

export function ConvexConnection() {
  const [isOpen, setIsOpen] = useState(false);

  const sessionId = useConvexSessionIdOrNullOrLoading();
  const chatId = useChatId();
  const projectInfo = useQuery(
    api.convexProjects.loadConnectedConvexProjectCredentials,
    sessionId && chatId
      ? {
          sessionId,
          chatId,
        }
      : 'skip',
  );

  const dialogTitle =
    projectInfo?.kind === 'connected'
      ? 'Connected Convex Project'
      : projectInfo?.kind === 'connecting'
        ? 'Connecting to Convex…'
        : projectInfo?.kind === 'failed'
          ? 'Failed to connect to Convex'
          : 'Connect a Convex Project';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit justify-between gap-1 h-8 text-sm">
          <img className="mr-2 size-4" src="/icons/Convex.svg" alt="Convex" />
          <ConnectionStatus projectInfo={projectInfo} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          {projectInfo?.kind === 'connected' ? (
            <ConnectedDialogContent projectInfo={projectInfo} />
          ) : projectInfo?.kind === 'failed' ? (
            <ErrorDialogContent errorMessage={projectInfo.errorMessage} />
          ) : (
            sessionId && chatId && <ConvexConnectButton />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ConnectedDialogContent({
  projectInfo,
}: {
  projectInfo: {
    kind: 'connected';
    projectSlug: string;
    teamSlug: string;
    deploymentUrl: string;
    deploymentName: string;
    adminKey: string;
    warningMessage: string | undefined;
  };
}) {
  const sessionId = useConvexSessionIdOrNullOrLoading();
  const chatId = useChatId();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-sm">
        <p className="text-muted-foreground">
          Current Project: <strong className="font-semibold text-foreground">{projectInfo.projectSlug}</strong>
        </p>
        <p className="text-muted-foreground">
          Team: <strong className="font-semibold text-foreground">{projectInfo.teamSlug}</strong>
        </p>
        <a
          className="flex items-center gap-1 text-muted-foreground hover:underline"
          href={`https://dashboard.convex.dev/d/${projectInfo.deploymentName}`}
          target="_blank"
          rel="noreferrer"
        >
          View in Convex Dashboard
          <ExternalLinkIcon className="size-4" />
        </a>
        {projectInfo.warningMessage && <p className="text-muted-foreground">{projectInfo.warningMessage}</p>}
      </div>

      <div className="border-t pt-4">
        <p className="mb-3 text-sm font-medium text-foreground">Connect to a new Convex project</p>
        {sessionId && chatId && <ConvexConnectButton />}
      </div>
    </div>
  );
}

function ErrorDialogContent({ errorMessage }: { errorMessage: string }) {
  const sessionId = useConvexSessionIdOrNullOrLoading();
  return (
    <div className="flex w-full flex-col gap-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error: {errorMessage}</AlertDescription>
      </Alert>
      {sessionId && <ConvexConnectButton />}
    </div>
  );
}

type ProjectInfo = (typeof api.convexProjects.loadConnectedConvexProjectCredentials)['_returnType'];

function ConnectionStatus({ projectInfo }: { projectInfo: ProjectInfo | undefined }) {
  if (projectInfo === undefined || projectInfo === null) {
    return <span>Connect to Convex</span>;
  }
  switch (projectInfo.kind) {
    case 'failed':
      return <span>Failed to connect</span>;
    case 'connected':
      return <span className="max-w-24 truncate">{`${projectInfo.projectSlug}`}</span>;
    case 'connecting':
      return <span>Connecting…</span>;
    default: {
      const _exhaustiveCheck: never = projectInfo;
      return <span>Connect to Convex</span>;
    }
  }
}
