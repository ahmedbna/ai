// bna-agent/componentDocsRegistry.ts
// This file automatically generates the docs object from your componentDocs

import { componentDocs } from './componentDocs.js';
import type { ComponentDoc } from './componentDocs.js';

/**
 * Converts component name to doc key
 * Example: "Accordion" -> "ui:accordion"
 */
function toDocKey(componentName: string): string {
  return `ui:${componentName.toLowerCase()}`;
}

/**
 * Formats component documentation into markdown
 */
export function formatComponentDoc(doc: ComponentDoc, componentName: string): string {
  const { description, importPath, exports, props, examples } = doc;

  let formatted = `# ${componentName}\n\n${description}\n\n`;
  formatted += `**Import**: \`${importPath}\`\n`;
  formatted += `**Exports**: ${exports.join(', ')}\n\n`;

  // Props section
  formatted += `## Props\n\n`;
  for (const [component, componentProps] of Object.entries(props)) {
    formatted += `### ${component}\n\n`;
    for (const [propName, propDef] of Object.entries(componentProps)) {
      formatted += `- **${propName}**${propDef.required ? ' (required)' : ''}\n`;
      formatted += `  - Type: \`${propDef.type}\`\n`;
      if (propDef.default !== undefined) {
        formatted += `  - Default: \`${propDef.default}\`\n`;
      }
      formatted += `  - ${propDef.description}\n\n`;
    }
  }

  // Examples section
  formatted += `## Examples\n\n`;
  for (const example of examples) {
    formatted += `### ${example.name}\n\`\`\`tsx\n${example.code}\n\`\`\`\n\n`;
  }

  return formatted;
}

/**
 * Generates the complete docs registry from componentDocs
 * Creates entries for both lowercase and original casing
 */
export function generateDocsRegistry() {
  const registry: Record<string, string> = {};

  // Auto-generate UI component docs
  for (const [componentName, doc] of Object.entries(componentDocs)) {
    const lowercaseKey = toDocKey(componentName);
    const formattedDoc = formatComponentDoc(doc, componentName);

    // Add lowercase version (e.g., "ui:avatar")
    registry[lowercaseKey] = formattedDoc;

    // Also add original casing version (e.g., "ui:Avatar")
    const originalCaseKey = `ui:${componentName}`;
    registry[originalCaseKey] = formattedDoc;
  }

  return registry;
}

// Export the generated registry
export const docsRegistry = generateDocsRegistry();

// Export available keys for reference
export const availableDocKeys = Object.keys(docsRegistry);

// Get list of UI components (without categorization)
// Returns only lowercase versions for cleaner display
export function getUIComponentKeys(): string[] {
  const keys = availableDocKeys.filter((key) => key.startsWith('ui:'));
  // Return only lowercase versions to avoid duplicates
  const uniqueKeys = new Set<string>();
  keys.forEach((key) => {
    uniqueKeys.add(key.toLowerCase());
  });
  return Array.from(uniqueKeys);
}

// Helper function to normalize doc key lookup (case-insensitive)
export function normalizeDocKey(key: string): string | null {
  const lowerKey = key.toLowerCase();

  // Check if lowercase version exists
  if (lowerKey in docsRegistry) {
    return lowerKey;
  }

  // Check if original case exists
  if (key in docsRegistry) {
    return key;
  }

  return null;
}
