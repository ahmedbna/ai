import { componentDocs } from './componentDocs.js';

// Function to retrieve docs (this would be called by the tool)
export function getComponentDocsFn(componentNames: string[]): string {
  const docs = componentNames
    .map((name) => {
      const doc = componentDocs[name];
      if (!doc) return null;

      return `# ${name}

${doc.description}

**Import**: \`${doc.importPath}\`
**Exports**: ${doc.exports.join(', ')}

## Props

${Object.entries(doc.props)
  .map(
    ([component, props]) => `
### ${component}
${Object.entries(props)
  .map(
    ([propName, propDef]) => `
- **${propName}**${propDef.required ? ' (required)' : ''}
  - Type: \`${propDef.type}\`
  ${propDef.default !== undefined ? `- Default: \`${propDef.default}\`` : ''}
  - ${propDef.description}
`,
  )
  .join('\n')}
`,
  )
  .join('\n')}

## Examples

${doc.examples
  .map(
    (ex) => `
### ${ex.name}
\`\`\`tsx
${ex.code}
\`\`\`
`,
  )
  .join('\n')}
`;
    })
    .filter(Boolean)
    .join('\n\n---\n\n');

  return docs;
}
