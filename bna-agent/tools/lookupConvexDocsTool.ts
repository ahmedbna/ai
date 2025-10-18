import { z } from 'zod';
import type { Tool } from 'ai';

export const lookupConvexDocsParameters = z.object({
  topics: z
    .array(
      z.enum([
        'file-storage',
        'full-text-search',
        'pagination',
        'http-actions',
        'scheduling-cron',
        'scheduling-runtime',
        'actions-nodejs',
        'typescript-types',
        'function-calling',
        'query-advanced',
        'mutation-advanced',
      ]),
    )
    .describe(
      'List of advanced Convex topics to look up. Use this when you need features beyond basic CRUD operations.',
    ),
});

export function lookupConvexDocsTool(): Tool {
  return {
    description: `Lookup advanced Convex documentation for specific features. Use this tool when:
    - Working with file uploads/downloads (images, videos, PDFs)
    - Implementing search functionality
    - Need paginated results
    - Creating HTTP endpoints
    - Scheduling background jobs or cron tasks
    - Using Node.js APIs in actions
    - Need advanced TypeScript type guidance
    - Complex query patterns or function calling

    Available topics:
    - file-storage: File upload/download, storage IDs, signed URLs
    - full-text-search: Search indexes, search queries, filter fields
    - pagination: Paginated queries, cursors, page navigation
    - http-actions: HTTP endpoints, request/response handling
    - scheduling-cron: Cron jobs, interval scheduling
    - scheduling-runtime: Scheduled functions, ctx.scheduler
    - actions-nodejs: Node.js runtime, "use node", external APIs
    - typescript-types: Doc types, Id types, Record types
    - function-calling: ctx.runQuery, ctx.runMutation, ctx.runAction
    - query-advanced: Advanced querying patterns, ordering
    - mutation-advanced: Batch operations, transactions`,
    parameters: lookupConvexDocsParameters,
  };
}

// Documentation content organized by topic
export const convexDocs = {
  'file-storage': `
# File Storage

## Overview
- Convex includes built-in file storage for large files (images, videos, PDFs)
- Files stored as \`Blob\` objects with storage IDs
- **NEVER store URLs in database** - store storage IDs instead
- Use \`_storage\` system table for metadata

## Key Methods

### Generate Upload URL
\`\`\`ts
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
\`\`\`

### Get Signed URL
\`\`\`ts
const url = await ctx.storage.getUrl(storageId);
// Returns null if file doesn't exist
\`\`\`

### Get File Metadata
\`\`\`ts
import { Id } from "./_generated/dataModel";

type FileMetadata = {
  _id: Id<"_storage">;
  _creationTime: number;
  contentType?: string;
  sha256: string;
  size: number;
}

const metadata: FileMetadata | null = await ctx.db.system.get(storageId);
\`\`\`

## Complete Upload Flow

### Backend
\`\`\`ts
// 1. Generate upload URL
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// 2. Save storage ID to database
export const saveFile = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    await ctx.db.insert("files", {
      userId,
      storageId: args.storageId,
    });
  },
});

// 3. Get files with URLs
export const getFiles = query({
  handler: async (ctx) => {
    const files = await ctx.db.query("files").collect();
    
    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );
  },
});
\`\`\`

### Frontend (React Native)
\`\`\`tsx
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function FileUpload() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  
  const handleUpload = async (fileUri: string) => {
    // 1. Get upload URL
    const postUrl = await generateUploadUrl();
    
    // 2. Fetch file and convert to blob
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    // 3. Upload to Convex
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: blob,
    });
    
    const { storageId } = await result.json();
    
    // 4. Save to database
    await saveFile({ storageId });
  };
  
  return <Button onPress={() => handleUpload(selectedUri)}>Upload</Button>;
}
\`\`\`

## Schema Example
\`\`\`ts
export default defineSchema({
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    name: v.optional(v.string()),
  })
    .index("by_user", ["userId"]),
});
\`\`\`

## Important Notes
- **DO NOT** use deprecated \`ctx.storage.getMetadata\`
- Always query \`_storage\` system table for metadata
- Convert all items to/from \`Blob\` when using storage
- Signed URLs are temporary - regenerate as needed
`,

  'full-text-search': `
# Full-Text Search

## Define Search Index

\`\`\`ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    channel: v.string(),
    authorId: v.id("users"),
  })
    .searchIndex("search_body", {
      searchField: "body",
      filterFields: ["channel", "authorId"],
    }),
});
\`\`\`

## Search Index Components

1. **Name**: Unique per table (e.g., "search_body")
2. **searchField**: The field to index for full-text search (must be string)
3. **filterFields**: Additional fields for fast equality filtering (optional)

## Query with Search

\`\`\`ts
export const searchMessages = query({
  args: {
    searchQuery: v.string(),
    channel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) => 
        q.search("body", args.searchQuery)
      );
    
    // Add filters
    if (args.channel) {
      query = query.withSearchIndex("search_body", (q) =>
        q.search("body", args.searchQuery).eq("channel", args.channel)
      );
    }
    
    return await query.take(10);
  },
});
\`\`\`

## Search Nested Fields

Use dot notation for nested documents:

\`\`\`ts
messages: defineTable({
  content: v.object({
    title: v.string(),
    body: v.string(),
  }),
})
  .searchIndex("search_content", {
    searchField: "content.title",
  }),
\`\`\`

## Best Practices

- Search field must be type \`v.string()\`
- Filter fields enable fast equality checks within search results
- Combine multiple filter conditions with chaining
- Use \`.take(n)\` to limit results
`,

  pagination: `
# Pagination

## Define Paginated Query

\`\`\`ts
import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const listMessages = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
\`\`\`

## Pagination Options

\`paginationOpts\` object contains:
- \`numItems\`: number - max documents to return
- \`cursor\`: string | null - cursor for next page

You can also define manually:
\`\`\`ts
args: {
  numItems: v.number(),
  cursor: v.union(v.string(), v.null()),
}
\`\`\`

## Return Value

\`.paginate()\` returns:
- \`page\`: Array of documents
- \`isDone\`: boolean - true if last page
- \`continueCursor\`: string - cursor for next page

## Frontend Usage

\`\`\`tsx
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function MessageList({ channelId }: { channelId: Id<"channels"> }) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.listMessages,
    { channelId },
    { initialNumItems: 20 }
  );
  
  return (
    <FlatList
      data={results}
      onEndReached={() => status === "CanLoadMore" && loadMore(20)}
      renderItem={({ item }) => <MessageItem message={item} />}
    />
  );
}
\`\`\`

## Manual Pagination

\`\`\`tsx
const [page, setPage] = useState({ numItems: 20, cursor: null });
const result = useQuery(api.messages.listMessages, {
  channelId,
  paginationOpts: page,
});

const loadMore = () => {
  if (result && !result.isDone) {
    setPage({ numItems: 20, cursor: result.continueCursor });
  }
};
\`\`\`
`,

  'http-actions': `
# HTTP Actions

## Define HTTP Router

All HTTP endpoints go in \`convex/router.ts\`:

\`\`\`ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Simple endpoint
http.route({
  path: "/api/echo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.text();
    return new Response(body, { status: 200 });
  }),
});

// With JSON
http.route({
  path: "/api/users",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const data = await req.json();
    
    const userId = await ctx.runMutation(internal.users.create, {
      name: data.name,
    });
    
    return Response.json({ userId }, { status: 201 });
  }),
});

// With path parameters
http.route({
  path: "/api/users/:id",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const userId = req.pathParams.id;
    
    const user = await ctx.runQuery(internal.users.get, {
      id: userId as Id<"users">,
    });
    
    return Response.json(user);
  }),
});

export default http;
\`\`\`

## Request Methods

- \`req.text()\` - Get body as string
- \`req.json()\` - Parse JSON body
- \`req.bytes()\` - Get raw bytes
- \`req.pathParams\` - Path parameters object
- \`req.headers\` - Headers object
- \`req.method\` - HTTP method

## Response Methods

\`\`\`ts
// JSON response
return Response.json({ data: "value" }, { status: 200 });

// Text response
return new Response("Hello", { 
  status: 200,
  headers: { "Content-Type": "text/plain" },
});

// With custom headers
return new Response(body, {
  status: 200,
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "value",
  },
});
\`\`\`

## Important Notes

- Endpoints registered at exact path specified
- \`/api/route\` is registered at \`/api/route\`, not \`/route\`
- **DO NOT modify \`convex/http.ts\`** - it's for auth only
- Use \`convex/router.ts\` for custom endpoints
- HTTP actions can stream up to 20 MiB response
- No request body size limit
- 10 minute timeout
`,

  'scheduling-cron': `
# Cron Jobs

## Define Cron Jobs

Create \`convex/crons.ts\`:

\`\`\`ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

// Define the function to run
const cleanupOldData = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("Running cleanup...");
    // Cleanup logic
  },
});

// Create cron schedule
const crons = cronJobs();

// Run every 2 hours
crons.interval(
  "cleanup old data",
  { hours: 2 },
  internal.crons.cleanupOldData,
  {}
);

// Run daily at midnight
crons.cron(
  "daily report",
  "0 0 * * *", // Cron expression
  internal.crons.generateReport,
  {}
);

// Run every Monday at 9 AM
crons.cron(
  "weekly summary",
  "0 9 * * 1",
  internal.crons.sendWeeklySummary,
  {}
);

export default crons;
\`\`\`

## Interval Syntax

\`\`\`ts
crons.interval(
  "job name",
  { hours: 2, minutes: 30 }, // Every 2.5 hours
  internal.crons.myFunction,
  { arg1: "value" } // Arguments to pass
);
\`\`\`

Time units: \`hours\`, \`minutes\`, \`seconds\`

## Cron Expression Syntax

\`\`\`ts
crons.cron(
  "job name",
  "0 */6 * * *", // Every 6 hours
  internal.crons.myFunction,
  {}
);
\`\`\`

Format: \`minute hour day month dayOfWeek\`
- \`*\` - any value
- \`*/n\` - every n units
- \`1,2,3\` - specific values
- \`1-5\` - range

## Important Rules

- **DO NOT use** \`crons.hourly\`, \`crons.daily\`, \`crons.weekly\`
- **ONLY use** \`crons.interval\` or \`crons.cron\`
- Always use FunctionReference, not function directly
- Must import \`internal\` even for same-file functions
- Cron functions should be internal (not public)

## Examples

\`\`\`ts
// Every 15 minutes
crons.interval("check status", { minutes: 15 }, internal.crons.check, {});

// Every day at 3 AM
crons.cron("backup", "0 3 * * *", internal.crons.backup, {});

// Every weekday at 9 AM
crons.cron("report", "0 9 * * 1-5", internal.crons.report, {});
\`\`\`
`,

  'scheduling-runtime': `
# Runtime Scheduling

## Schedule Future Execution

Use \`ctx.scheduler.runAfter\` in mutations or actions:

\`\`\`ts
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const scheduleReminder = mutation({
  args: {
    userId: v.id("users"),
    message: v.string(),
    delayMs: v.number(),
  },
  handler: async (ctx, args) => {
    // Schedule reminder to run in the future
    await ctx.scheduler.runAfter(
      args.delayMs,
      internal.reminders.send,
      {
        userId: args.userId,
        message: args.message,
      }
    );
    
    return "Reminder scheduled";
  },
});

// The scheduled function (internal)
export const send = internalMutation({
  args: {
    userId: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      message: args.message,
      sentAt: Date.now(),
    });
  },
});
\`\`\`

## Delay Format

Delay in milliseconds:
\`\`\`ts
// 1 minute
ctx.scheduler.runAfter(60 * 1000, ...);

// 1 hour
ctx.scheduler.runAfter(60 * 60 * 1000, ...);

// 1 day
ctx.scheduler.runAfter(24 * 60 * 60 * 1000, ...);
\`\`\`

## Important Restrictions

**Auth State Does NOT Propagate:**
\`\`\`ts
// This returns null in scheduled functions
const userId = await getAuthUserId(ctx);

// Pass userId as argument instead
await ctx.scheduler.runAfter(
  delay,
  internal.myFunction,
  { userId: userId } // Pass explicitly
);
\`\`\`

**Best Practices:**
- Prefer internal functions for scheduled jobs
- Don't do access checks in scheduled functions
- Pass required IDs as arguments
- Use sparingly - not for high-frequency updates
- **Minimum interval**: 10 seconds between schedules
- **Never schedule in tight loops** (e.g., game simulations)

## Use Cases

Good uses:
- Send email after delay
- Clean up expired data
- Generate periodic reports
- Follow-up reminders

Bad uses:
- Game tick updates (use client-side instead)
- Real-time animations
- High-frequency polling
`,

  'actions-nodejs': `
# Actions with Node.js

## Enable Node.js Runtime

Add \`"use node";\` at the top of your file:

\`\`\`ts
"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateText = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: args.prompt }],
    });
    
    return completion.choices[0].message.content;
  },
});
\`\`\`

## Critical Rules

**File Restrictions:**
- Files with \`"use node"\` can **ONLY** contain actions
- **NEVER** put queries or mutations in Node.js files
- Node actions can only be called from client or other actions

**No Database Access:**
- \`ctx.db\` is NOT available in actions
- Use \`ctx.runQuery\` or \`ctx.runMutation\` instead

\`\`\`ts
"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const processData = action({
  args: {},
  handler: async (ctx) => {
    // This doesn't work
    // const data = await ctx.db.query("messages").collect();
    
    // Use this instead
    const data = await ctx.runQuery(internal.messages.list, {});
    
    // Process with Node.js libraries
    const result = await someNodeLibrary.process(data);
    
    // Save results
    await ctx.runMutation(internal.messages.save, { result });
  },
});
\`\`\`

## Common Use Cases

\`\`\`ts
"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// External API calls
export const fetchWeather = action({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch(
      \`https://api.weather.com/\${args.city}\`
    );
    return await response.json();
  },
});

// File processing
import * as fs from "fs/promises";

export const processFile = action({
  args: { data: v.string() },
  handler: async (ctx, args) => {
    // Use Node.js fs module
    // Process files, etc.
  },
});

// Image processing
import sharp from "sharp";

export const resizeImage = action({
  args: { imageUrl: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch(args.imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    
    const resized = await sharp(buffer)
      .resize(200, 200)
      .toBuffer();
    
    return resized.toString('base64');
  },
});
\`\`\`

## Environment Variables

Access in actions:
\`\`\`ts
const apiKey = process.env.OPENAI_API_KEY;
const secret = process.env.MY_SECRET;
\`\`\`

## Deployment Errors

If you see esbuild bundler errors:
- A library requires Node.js APIs
- Move it to a file with \`"use node"\`
- File must contain ONLY actions
- No queries or mutations allowed
`,

  'typescript-types': `
# TypeScript Types

## Document Types

\`\`\`ts
import { Doc, Id } from "./_generated/dataModel";

// Get document type
type User = Doc<"users">;
type Message = Doc<"messages">;

// Use in functions
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args): Promise<User | null> => {
    return await ctx.db.get(args.id);
  },
});
\`\`\`

## ID Types

\`\`\`ts
import { Id } from "./_generated/dataModel";

// Strongly typed IDs
type UserId = Id<"users">;
type MessageId = Id<"messages">;

// Use in function args
export const deleteMessage = mutation({
  args: { 
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // args.messageId is type Id<"messages">
    // args.userId is type Id<"users">
  },
});

// Be strict with IDs
// Don't use string
function processUser(id: string) { }

// Use typed ID
function processUser(id: Id<"users">) { }
\`\`\`

## Record Types

\`\`\`ts
import { Id } from "./_generated/dataModel";

// Define Record with correct types
export const getUsernames = query({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    // Type: Record<Id<"users">, string>
    const idToUsername: Record<Id<"users">, string> = {};
    
    for (const userId of args.userIds) {
      const user = await ctx.db.get(userId);
      if (user) {
        idToUsername[user._id] = user.name;
      }
    }
    
    return idToUsername;
  },
});

// Validator matches type
args: {
  userMap: v.record(v.id("users"), v.string())
}
// Type: Record<Id<"users">, string>
\`\`\`

## Array Types

\`\`\`ts
// Define arrays with const
const messages: Array<Doc<"messages">> = await ctx.db
  .query("messages")
  .collect();

// With validator
args: {
  ids: v.array(v.id("users"))
}
// Type: Array<Id<"users">>
\`\`\`

## Discriminated Unions

\`\`\`ts
import { v } from "convex/values";

// Schema with discriminated union
results: defineTable(
  v.union(
    v.object({
      kind: v.literal("error"),
      errorMessage: v.string(),
    }),
    v.object({
      kind: v.literal("success"),
      value: v.number(),
    }),
  ),
)

// Use with 'as const'
const result: Doc<"results"> = {
  kind: "success" as const,
  value: 42,
};

// Type narrowing
if (result.kind === "error") {
  console.log(result.errorMessage);
} else {
  console.log(result.value);
}
\`\`\`

## Optional Fields

\`\`\`ts
// Schema
users: defineTable({
  name: v.string(),
  bio: v.optional(v.string()),
  age: v.optional(v.number()),
})

// Type includes undefined
type User = Doc<"users">;
// { name: string, bio?: string, age?: number }

// Handle optional fields
const bio = user.bio ?? "No bio";
if (user.age !== undefined) {
  console.log(user.age);
}
\`\`\`

## Function Return Types

\`\`\`ts
// Annotate when calling same-file functions
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserName = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // Add type annotation for same-file call
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.users.getUser,
      { id: args.id }
    );
    
    return user?.name ?? "Unknown";
  },
});
\`\`\`

## Dependencies

Always add when using Node.js modules:
\`\`\`json
{
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
\`\`\`
`,

  'function-calling': `
# Function Calling

## Call Functions from Functions

### From Queries
\`\`\`ts
import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const helper = query({
  args: {},
  handler: async (ctx) => {
    return { data: "value" };
  },
});

export const main = query({
  args: {},
  handler: async (ctx) => {
    // Call another query
    const result = await ctx.runQuery(api.example.helper, {});
    return result;
  },
});
\`\`\`

### From Mutations
\`\`\`ts
import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const main = mutation({
  args: {},
  handler: async (ctx) => {
    // Call query
    const data = await ctx.runQuery(api.example.getData, {});
    
    // Call mutation
    await ctx.runMutation(api.example.updateData, { data });
    
    return null;
  },
});
\`\`\`

### From Actions
\`\`\`ts
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const main = action({
  args: {},
  handler: async (ctx) => {
    // Call query
    const data = await ctx.runQuery(api.example.getData, {});
    
    // Call mutation
    await ctx.runMutation(api.example.saveData, { data });
    
    // Call another action
    await ctx.runAction(internal.example.processData, { data });
    
    return null;
  },
});
\`\`\`

## Function References

**Must use api/internal objects:**
\`\`\`ts
import { api } from "./_generated/api";
import { internal } from "./_generated/api";

// Correct
await ctx.runQuery(api.messages.list, {});
await ctx.runMutation(internal.messages.create, {});

// Wrong - don't pass function directly
await ctx.runQuery(listMessages, {});
\`\`\`

## Same-File Calls

Add type annotation to avoid circularity:
\`\`\`ts
export const getData = query({
  args: {},
  handler: async (ctx) => {
    return { value: 42 };
  },
});

export const main = query({
  args: {},
  handler: async (ctx) => {
    // Add type annotation
    const result: { value: number } = await ctx.runQuery(
      api.example.getData,
      {}
    );
    
    return result.value * 2;
  },
});
\`\`\`

## Best Practices

**Minimize action-to-query/mutation calls:**
\`\`\`ts
// Bad - multiple round trips
export const bad = action({
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.users.get, { id });
    const posts = await ctx.runQuery(api.posts.list, { userId: id });
    const comments = await ctx.runQuery(api.comments.list, { userId: id });
    // Risk of race conditions
  },
});

// Good - single query
export const getUserData = query({
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    const posts = await ctx.db.query("posts")
      .withIndex("by_user", q => q.eq("userId", args.id))
      .collect();
    const comments = await ctx.db.query("comments")
      .withIndex("by_user", q => q.eq("userId", args.id))
      .collect();
    
    return { user, posts, comments };
  },
});

export const good = action({
  handler: async (ctx) => {
    const data = await ctx.runQuery(api.users.getUserData, { id });
    // Single transaction, no race conditions
  },
});
\`\`\`

**Don't nest actions unnecessarily:**
\`\`\`ts
// Don't call action from action for shared code
export const helperAction = action({
  handler: async (ctx, args) => {
    // Some logic
  },
});

export const mainAction = action({
  handler: async (ctx) => {
    await ctx.runAction(api.helpers.helperAction, {});
  },
});

// Extract to helper function
async function sharedLogic(ctx: ActionCtx, args: any) {
  // Shared logic here
}

export const mainAction = action({
  handler: async (ctx) => {
    await sharedLogic(ctx, {});
  },
});
\`\`\`

## Runtime Context

Actions cross runtime boundaries:
- Queries/mutations run in V8 isolate
- Actions can run in Node.js
- Only call action from action when crossing runtimes
`,

  'query-advanced': `
# Advanced Query Patterns

## Ordering

\`\`\`ts
// Default: ascending by _creationTime
const messages = await ctx.db.query("messages").collect();

// Explicit ascending
const asc = await ctx.db.query("messages").order("asc").collect();

// Descending
const desc = await ctx.db.query("messages").order("desc").collect();

// With index
const byAuthor = await ctx.db
  .query("messages")
  .withIndex("by_author", q => q.eq("author", userId))
  .order("desc") // Orders by (author, _creationTime) desc
  .collect();
\`\`\`

## Limiting Results

\`\`\`ts
// Take first N
const recent = await ctx.db
  .query("messages")
  .order("desc")
  .take(10);

// Get single document (throws if multiple)
const latest = await ctx.db
  .query("messages")
  .order("desc")
  .unique();

// Get first or null
const first = await ctx.db
  .query("messages")
  .order("desc")
  .first();
\`\`\`

## Async Iteration

\`\`\`ts
// Don't use .collect() for large datasets
for await (const message of ctx.db.query("messages")) {
  // Process one at a time
  console.log(message);
  
  // Can break early
  if (someCondition) break;
}

// Don't do this with async iteration
const results = [];
for await (const doc of query) {
  results.push(doc);
}
// Use .collect() instead
\`\`\`

## Range Queries

\`\`\`ts
// Greater than
const recent = await ctx.db
  .query("messages")
  .withIndex("by_creation_time", q => 
    q.gt("_creationTime", Date.now() - 3600000)
  )
  .collect();

// Between values
const inRange = await ctx.db
  .query("messages")
  .withIndex("by_timestamp", q =>
    q.gte("timestamp", start).lte("timestamp", end)
  )
  .collect();
\`\`\`

## Multiple Indexes

\`\`\`ts
// Query different indexes based on condition
export const searchMessages = query({
  args: {
    authorId: v.optional(v.id("users")),
    channelId: v.optional(v.id("channels")),
  },
  handler: async (ctx, args) => {
    if (args.authorId) {
      return await ctx.db
        .query("messages")
        .withIndex("by_author", q => q.eq("authorId", args.authorId))
        .collect();
    }
    
    if (args.channelId) {
      return await ctx.db
        .query("messages")
        .withIndex("by_channel", q => q.eq("channelId", args.channelId))
        .collect();
    }
    
    return await ctx.db.query("messages").collect();
  },
});
\`\`\`

## Compound Index Queries

\`\`\`ts
// Schema
messages: defineTable({
  channelId: v.id("channels"),
  authorId: v.id("users"),
  content: v.string(),
})
  .index("by_channel_and_author", ["channelId", "authorId"])

// Query both fields
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel_and_author", q =>
    q.eq("channelId", channelId).eq("authorId", authorId)
  )
  .collect();

// Query first field only
const byChannel = await ctx.db
  .query("messages")
  .withIndex("by_channel_and_author", q =>
    q.eq("channelId", channelId)
  )
  .collect();
\`\`\`

## Avoiding Table Scans

\`\`\`ts
// Table scan - slow
const filtered = await ctx.db
  .query("messages")
  .filter(q => q.eq(q.field("authorId"), userId))
  .collect();

// Index scan - fast
const indexed = await ctx.db
  .query("messages")
  .withIndex("by_author", q => q.eq("authorId", userId))
  .collect();
\`\`\`

**Rule: NEVER use .filter() - always create indexes**
`,

  'mutation-advanced': `
# Advanced Mutation Patterns

## Batch Operations

\`\`\`ts
export const createMultiple = mutation({
  args: {
    messages: v.array(v.object({
      content: v.string(),
      authorId: v.id("users"),
    })),
  },
  handler: async (ctx, args) => {
    const ids = [];
    
    for (const message of args.messages) {
      const id = await ctx.db.insert("messages", message);
      ids.push(id);
    }
    
    return ids;
  },
});
\`\`\`

## Delete Multiple

\`\`\`ts
export const deleteByAuthor = mutation({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all documents first
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_author", q => q.eq("authorId", args.authorId))
      .collect();
    
    // Delete each one
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    
    return messages.length;
  },
});
\`\`\`

## Upsert Pattern

\`\`\`ts
export const upsertProfile = mutation({
  args: {
    userId: v.id("users"),
    bio: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, { bio: args.bio });
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId: args.userId,
        bio: args.bio,
      });
    }
  },
});
\`\`\`

## Conditional Updates

\`\`\`ts
export const incrementIfExists = mutation({
  args: { counterId: v.id("counters") },
  handler: async (ctx, args) => {
    const counter = await ctx.db.get(args.counterId);
    
    if (!counter) {
      throw new Error("Counter not found");
    }
    
    if (counter.value < 100) {
      await ctx.db.patch(args.counterId, {
        value: counter.value + 1,
      });
    }
    
    return counter.value + 1;
  },
});
\`\`\`

## Transactional Updates

\`\`\`ts
export const transfer = mutation({
  args: {
    fromId: v.id("accounts"),
    toId: v.id("accounts"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // All operations are transactional
    const from = await ctx.db.get(args.fromId);
    const to = await ctx.db.get(args.toId);
    
    if (!from || !to) {
      throw new Error("Account not found");
    }
    
    if (from.balance < args.amount) {
      throw new Error("Insufficient funds");
    }
    
    // Both updates succeed or both fail
    await ctx.db.patch(args.fromId, {
      balance: from.balance - args.amount,
    });
    
    await ctx.db.patch(args.toId, {
      balance: to.balance + args.amount,
    });
    
    return null;
  },
});
\`\`\`

## Replace vs Patch

\`\`\`ts
// Patch - partial update
await ctx.db.patch(docId, {
  name: "New Name",
  // Other fields unchanged
});

// Replace - full update
await ctx.db.replace(docId, {
  name: "New Name",
  email: "email@example.com",
  // Must include ALL fields
});
\`\`\`

## Error Handling

\`\`\`ts
export const safeUpdate = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    try {
      const doc = await ctx.db.get(args.id);
      
      if (!doc) {
        throw new Error("Document not found");
      }
      
      await ctx.db.patch(args.id, {
        updatedAt: Date.now(),
      });
      
      return { success: true };
    } catch (error) {
      console.error("Update failed:", error);
      throw error; // Rolls back transaction
    }
  },
});
\`\`\`
`,
};

export type ConvexDocTopic = keyof typeof convexDocs;
