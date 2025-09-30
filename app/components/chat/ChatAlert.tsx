import { AnimatePresence, motion } from 'framer-motion';
import type { ActionAlert } from '@/types/actions';
import { classNames } from '@/utils/classNames';
import { ExclamationTriangleIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { MessageSquareCode } from 'lucide-react';

interface Props {
  alert: ActionAlert;
  clearAlert: () => void;
  postMessage: (message: string) => void;
}

export default function ChatAlert({ alert, clearAlert, postMessage }: Props) {
  const { description, content, source } = alert;

  const isPreview = source === 'preview';
  const title = isPreview ? 'Preview Error' : 'Terminal Error';
  const message = isPreview
    ? 'We encountered an error while running the preview. Would you like Chef to analyze and help resolve this issue?'
    : 'We encountered an error while running terminal commands. Would you like Chef to analyze and help resolve this issue?';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`rounded-lg bg-card p-4 shadow`}
      >
        <div className="flex items-start">
          {/* Icon */}
          <motion.div
            className="flex h-6 shrink-0 items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ExclamationTriangleIcon className="text-content-error" />
          </motion.div>
          {/* Content */}
          <div className="ml-3 flex-1">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`text-sm font-medium text-content-primary`}
            >
              {title}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`mt-2 text-sm text-content-secondary`}
            >
              <p>{message}</p>
              {description && (
                <div className="my-4 rounded bg-bolt-elements-background-depth-3 p-2 text-xs text-content-secondary">
                  Error: {description}
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={classNames(' flex gap-2')}>
                <Button
                  onClick={() =>
                    postMessage(
                      `*Fix this ${isPreview ? 'preview' : 'terminal'} error* \n\`\`\`${isPreview ? 'js' : 'sh'}\n${description}\n${content}\n\`\`\`\n`,
                    )
                  }
                >
                  <MessageSquareCode />
                  Ask BNA
                </Button>

                <Button variant="secondary" onClick={clearAlert}>
                  Dismiss
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
