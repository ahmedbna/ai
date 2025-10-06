// Tool for component lookup with comprehensive docs
export const componentLookupTool = {
  name: 'lookup_ui_components',
  description: `Look up comprehensive documentation for pre-built UI components. Returns complete prop definitions, usage examples, patterns, and warnings. ALWAYS use this before creating custom UI components.`,
  parameters: {
    components: {
      type: 'array',
      items: { type: 'string' },
      description: "List of component names to look up (e.g., ['Button', 'Dialog', 'Select'])",
    },
  },
};
