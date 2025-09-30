import { z } from 'zod';
import type { Tool } from 'ai';
import { proseMirrorComponentReadmePrompt } from '../prompts/components/proseMirror.js';
import { presenceComponentReadmePrompt } from '../prompts/components/presence.js';
import { resendComponentReadmePrompt } from '../prompts/components/resend.js';

export const lookupDocsParameters = z.object({
  docs: z
    .array(z.string())
    .describe(
      'List of features to look up in the documentation. You should look up all the docs for the features you are implementing.',
    ),
});

export function lookupDocsTool(): Tool {
  return {
    description: `Lookup documentation for a list of features. Valid features to lookup are: \`proseMirror\` and \`presence\``,
    parameters: lookupDocsParameters,
  };
}

export type LookupDocsParameters = z.infer<typeof lookupDocsParameters>;

// Documentation content that can be looked up
export const docs = {
  proseMirror: proseMirrorComponentReadmePrompt,
  presence: presenceComponentReadmePrompt,
  resend: resendComponentReadmePrompt,
} as const;

export type DocKey = keyof typeof docs;
