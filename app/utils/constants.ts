import { WORK_DIR } from 'bna-agent/constants';

export const PROMPT_COOKIE_KEY = 'cachedPrompt';

export const IGNORED_PATHS = [`${WORK_DIR}/dist/`, `${WORK_DIR}/node_modules/`, `${WORK_DIR}/.env.local`];
export const IGNORED_RELATIVE_PATHS = ['dist', 'node_modules', '.env.local'];

export const DEFAULT_COLLAPSED_FOLDERS = new Set([
  `${WORK_DIR}/convex/_generated`,
  `${WORK_DIR}/public`,
  `${WORK_DIR}/src/components`,
  `${WORK_DIR}/src/hooks`,
  `${WORK_DIR}/src/lib`,
]);

const MIN_BACKOFF = 500;
const MAX_BACKOFF = 60000;

export function backoffTime(numFailures: number) {
  return Math.min(MIN_BACKOFF * Math.pow(2, numFailures), MAX_BACKOFF) * Math.random();
}

// These are the user facing options for the model selector, which the
// client then maps to the model provider used by the backend. For
// example, the user may specify "claude-sonnet-4-5", but then we'll
// fallback between Anthropic and Bedrock.
export type ModelSelection = 'auto' | 'gpt-5' | 'claude-sonnet-4-5' | 'grok-code-fast-1' | 'gemini-2.5-pro';

export const MAX_CONSECUTIVE_DEPLOY_ERRORS = 5;
