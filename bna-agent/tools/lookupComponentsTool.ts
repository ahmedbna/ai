// bna-agent/tools/lookupComponentsTool.ts
import { tool } from 'ai';
import { z } from 'zod';
import { docsRegistry, getUIComponentKeys, normalizeDocKey } from '../componentDocsRegistry.js';

// Re-export for convenience
export const docs = docsRegistry;
export type DocKey = keyof typeof docs;

export const lookupComponentsParameters = z.object({
  docs: z
    .array(z.string())
    .describe(
      'List of documentation keys to look up. Use "ui:" prefix for components (e.g., "ui:button", "ui:Button", "ui:avatar", "ui:Avatar" - case insensitive)',
    ),
});

export function lookupComponentsTool() {
  const uiComponents = getUIComponentKeys();

  return tool({
    description: `Look up documentation for UI components and patterns. This helps you find pre-built components before creating custom ones.
    Available UI components: ${uiComponents.join(', ')}
    IMPORTANT: Always check if a component exists before implementing custom UI. This saves tokens and ensures consistency.
    Component names are case-insensitive (e.g., "ui:avatar" and "ui:Avatar" both work).
    `,
    parameters: lookupComponentsParameters,
    execute: async ({ docs: requestedDocs }) => {
      const results: string[] = [];
      const notFound: string[] = [];

      for (const docKey of requestedDocs) {
        // Try case-insensitive lookup
        const normalizedKey = normalizeDocKey(docKey);

        if (normalizedKey && normalizedKey in docs) {
          results.push(`## ${docKey}\n\n${docs[normalizedKey as DocKey]}`);
        } else {
          notFound.push(docKey);
        }
      }

      let response = results.join('\n\n---\n\n');

      if (notFound.length > 0) {
        response += `\n\n## Not Found\nThe following documentation keys were not found: ${notFound.join(', ')}`;
        response += `\n\nAvailable keys (case-insensitive): ${uiComponents.join(', ')}`;
        response += `\n\nTip: Use "ui:componentname" format (e.g., "ui:avatar", "ui:button")`;
      }

      return response;
    },
  });
}
