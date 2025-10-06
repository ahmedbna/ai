// bna-agent/tools/componentDocsRegistry.ts
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
 */
export function generateDocsRegistry() {
  const registry: Record<string, string> = {};

  // Auto-generate UI component docs
  for (const [componentName, doc] of Object.entries(componentDocs)) {
    const key = toDocKey(componentName);
    registry[key] = formatComponentDoc(doc, componentName);
  }

  return registry;
}

// Export the generated registry
export const docsRegistry = generateDocsRegistry();

// Export available keys for reference
export const availableDocKeys = Object.keys(docsRegistry);

// Get list of UI components (without categorization)
export function getUIComponentKeys(): string[] {
  return availableDocKeys.filter((key) => key.startsWith('ui:'));
}
