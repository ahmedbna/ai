import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';

export function convexGuidelines(options: SystemPromptOptions) {
  return stripIndents`
  <solution_constraints>
    <convex_guidelines>
      You MUST use Convex for the database, realtime, file storage, functions, scheduling, HTTP handlers,
      and search functionality. Convex is realtime by default, so you never need to manually refresh
      subscriptions.

      ## Using the \`lookupConvexDocsTool\` Tool
      For features beyond basic queries, mutations, and schemas, you MUST use the \`lookupConvexDocsTool\` tool before writing any code. This ensures you follow the correct patterns for more complex functionality.

      ## Convex Function Syntax

      ### New Function Syntax (ALWAYS USE THIS)
      \`\`\`ts
      import { query } from "./_generated/server";
      import { v } from "convex/values";
      
      export const myQuery = query({
        args: { name: v.string() },
        handler: async (ctx, args) => {
          // Function body
        },
      });
      \`\`\`

      ### Core Validators
      - \`v.string()\` - String type
      - \`v.number()\` - Float64 type
      - \`v.boolean()\` - Boolean type
      - \`v.id(tableName)\` - Document ID type
      - \`v.null()\` - Null type (use instead of undefined)
      - \`v.array(validator)\` - Array type
      - \`v.object({ field: validator })\` - Object type
      - \`v.optional(validator)\` - Optional field
      - \`v.union(v1, v2, ...)\` - Union types

      ** NEVER use return validators when getting started writing an app.
      ** NEVER use v.map() or v.set() - they are not supported**
      ** ALWAYS use argument validators. For example:

      \`\`\`ts
      import { mutation } from "./_generated/server";
      import { v } from "convex/values";

      export default mutation({
        args: {
          simpleArray: v.array(v.union(v.string(), v.number())),
        },
        handler: async (ctx, args) => {
          //...
        },
      });
      \`\`\`

      ### Function Registration
      - **Public functions**: \`query\`, \`mutation\`, \`action\` - exposed to Internet
      - **Internal functions**: \`internalQuery\`, \`internalMutation\`, \`internalAction\` - private
      - ALWAYS include argument validators for ALL functions
      - Import from: \`./_generated/server\`

      ### Function calling

      - Use \`ctx.runQuery\` to call a query from a query, mutation, or action.
      - Use \`ctx.runMutation\` to call a mutation from a mutation or action.
      - Use \`ctx.runAction\` to call an action from an action.
      - When using \`ctx.runQuery\`, \`ctx.runMutation\`, or \`ctx.runAction\` to call a function in the same file, specify a type annotation on the return value to work around TypeScript circularity limitations.

      ### Function references

      - Function references are pointers to registered Convex functions.
      - ALWAYS use the \`api\` object defined by the framework in \`convex/_generated/api.ts\` to call public functions.
      - ALWAYS use the \`internal\` object defined by the framework in \`convex/_generated/api.ts\` to call internal (or private) functions.
      - Convex uses file-based routing, so a public function defined in \`convex/example.ts\` named \`f\` has a function reference of \`api.example.f\`.

      ### Environment variables

      Convex supports environment variables within function calls via \`process.env\`. Environment
      variables are useful for storing secrets like API keys and other per-deployment configuration.

      You can read environment variables from all functions, including queries, mutations, actions,
      and HTTP actions.
    
      ### Using Convex React Hooks in Expo React Native
      Convex provides React hooks that connect your frontend to your backend functions.
      These are designed to work seamlessly with Expo and React Native.

      The three core hooks are:
      - \`useQuery\` — reads data reactively.
      - \`useMutation\` — performs writes or updates.
      - \`useAction\` — runs long or external tasks (e.g., API calls, AI requests).

      ## Essential Schema Guidelines

      ### Schema Definition
      - Always define your schema in \`convex/schema.ts\`.
      - Always import the schema definition functions from \`convex/server\`:
      - System fields are automatically added to all documents and are prefixed with an underscore, like \`_id\` and \`_creationTime\`.
      - DO NOT remove or modify any of the user existing schema fields. You may add new fields if necessary, but the original fields must remain exactly as defined.
      
      \`\`\`ts
      import { defineSchema, defineTable } from "convex/server";
      import { v } from "convex/values";

      export default defineSchema({
        messages: defineTable({
          body: v.string(),
          authorId: v.id("users"),
        })
          .index("by_author", ["authorId"]),
      });
      \`\`\`

      ### Index Rules (CRITICAL)
      - **NEVER** add \`.index("by_creation_time", ["_creationTime"])\` - it's automatic
      - **NEVER** include \`_creationTime\` as the last column in any index you define. Convex does this automatically.
        \`.index("by_author_and_creation_time", ["author", "_creationTime"])\` is ALWAYS wrong.
      - Index names must match fields: \`["field1", "field2"]\` → \`"by_field1_and_field2"\`
      - System provides: \`"by_id"\` and \`"by_creation_time"\` automatically
      - Index definitions MUST be nonempty
      - Index names must be unique within a table.

      ### System Fields (Automatic)
      - \`_id\`: Document ID (\`v.id(tableName)\`)
      - \`_creationTime\`: Creation timestamp (\`v.number()\`)

      ## Query Guidelines
  
      ### Basic Queries
      \`\`\`ts
      // Get by ID
      const doc = await ctx.db.get(docId);

      // Query with index
      const results = await ctx.db
        .query("messages")
        .withIndex("by_author", q => q.eq("authorId", userId))
        .collect();

      // Order and limit
      const recent = await ctx.db
        .query("messages")
        .order("desc")
        .take(10);
      \`\`\`

      ### Query Rules
      - **DO NOT use .filter()** - use indexes with .withIndex() instead
      - Use \`.unique()\` for single document (throws if multiple)
      - Use \`.collect()\` or \`.take(n)\` to execute query
      - Default order: ascending by \`_creationTime\`

      ### Ordering
      - By default Convex always returns documents in ascending \`_creationTime\` order.
      - You can use \`.order('asc')\` or \`.order('desc')\` to pick whether a query is in ascending or descending order.

      ## Action guidelines
      - Always add \`"use node";\` to the top of files containing actions that use Node.js built-in modules.
      - Files that contain \`"use node";\` should NEVER contain mutations or queries, only actions.
      - Never use \`ctx.db\` inside of an action. Actions don't have access to the database.

      ## Mutation Guidelines
      - Use \`ctx.db.replace\` to fully replace an existing document.
      - Use \`ctx.db.patch\` to shallow merge updates into an existing document.

      \`\`\`ts
      // Insert
      const id = await ctx.db.insert("messages", { body: "Hello" });

      // Update (partial)
      await ctx.db.patch(docId, { body: "Updated" });

      // Replace (full)
      await ctx.db.replace(docId, { body: "Replaced", authorId: userId });

      // Delete
      await ctx.db.delete(docId);
      \`\`\`

      ## Critical Limits (MUST RESPECT)

      ### Data Limits
      - Function args/return: 8 MiB max
      - Database record: 1 MiB max
      - Arrays: 8192 elements max
      - Objects: 1024 entries max
      - Nesting depth: 16 max

      ### Operation Limits
      - Queries/mutations: read 8 MiB, 16384 docs max
      - Mutations: write 8 MiB, 8192 docs max
      - Queries/mutations: 1 second timeout
      - Actions: 10 minutes timeout

      ## React Hooks (Expo/React Native)

      \`\`\`tsx
      import { useQuery, useMutation, useAction } from "convex/react";
      import { api } from "@/convex/_generated/api";

      function MyComponent() {
        // Read data (live updates)
        const data = useQuery(api.messages.list);
        
        // Write data
        const sendMessage = useMutation(api.messages.send);
        
        // External actions
        const generateAI = useAction(api.ai.generate);

        // Handle loading
        if (data === undefined) return <Spinner />;
        if (data === null) return <Text>Not found</Text>;

        return <Button onPress={() => sendMessage({ text: "Hi" })}>Send</Button>;
      }
      \`\`\`

      ### Hook Rules
      - **NEVER use hooks conditionally**
      - Use \`"skip"\` for conditional queries:
        \`\`\`tsx
        const data = useQuery(
          api.messages.get,
          id ? { id } : "skip"
        );
        \`\`\`

      ## Authentication (Built-in)
      When writing Convex handlers, use the 'getAuthUserId' function to get the logged in user's ID. You can then pass this to 'ctx.db.get' in queries or mutations to get the user's data.

      \`\`\`ts
      import { getAuthUserId } from "@convex-dev/auth/server";

      export const currentUser = query({
        handler: async (ctx) => {
          const userId = await getAuthUserId(ctx);
          if (!userId) return null;
          return await ctx.db.get(userId);
        },
      });
      \`\`\`

      To get the current user on the frontend, use the \`loggedInUser\` query from \`convex/auth.ts\`:
      \`\`\`tsx "app/(tabs)/index.tsx"
      import { useQuery } from "convex/react";
      import { api } from "@/convex/_generated/api";

      const user = useQuery(api.auth.loggedInUser);
      \`\`\`

      **User Schema:**
      \`\`\`ts
      users: defineTable({
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        name: v.optional(v.string()),
        bio: v.optional(v.string()),
        gender: v.optional(v.string()),
        birthday: v.optional(v.number()),
        image: v.optional(v.union(v.string(), v.null())),
        emailVerificationTime: v.optional(v.float64()),
        phoneVerificationTime: v.optional(v.float64()),
        isAnonymous: v.optional(v.boolean()),
        githubId: v.optional(v.number()),
      })
        .index('email', ['email'])
        .index('phone', ['phone'])
      \`\`\`

      ## When You Need More

      For advanced features, use the \`lookupConvexDocsTool\` tool to get documentation on:
      - **File Storage**: Uploading/downloading files, images, videos
      - **Full-Text Search**: Search indexes and queries
      - **Pagination**: Paginated query results
      - **HTTP Actions**: Custom HTTP endpoints
      - **Scheduling**: Cron jobs and scheduled functions
      - **Actions**: Node.js runtime, external APIs
      - **TypeScript Types**: Advanced type usage with Doc, Id types

      **Example:** If you need file storage, call:
      \`\`\`
      lookupConvexDocsTool({ topics: ["file-storage"] })
      \`\`\`
    </convex_guidelines>
  </solution_constraints>
`;
}
