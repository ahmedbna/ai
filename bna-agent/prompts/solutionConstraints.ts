import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';
import { convexGuidelines } from './convexGuidelines.js';
import { templateGuidelines } from './templateGuidelines.js';

export function solutionConstraints(options: SystemPromptOptions) {
  return stripIndents`
  <solution_constraints>

    ${options.includeTemplate ? templateGuidelines() : ''}

    <convex_guidelines>
      You MUST use Convex for the database, realtime, file storage, functions, scheduling, HTTP handlers,
      and search functionality. Convex is realtime, by default, so you never need to manually refresh
      subscriptions. Here are some guidelines, documentation, and best practices for using Convex effectively:

      ${convexGuidelines(options)}

      <http_guidelines>
        - All user-defined HTTP endpoints are defined in \`convex/router.ts\` and require an \`httpAction\` decorator.
        - The \`convex/http.ts\` file contains the authentication handler for Convex Auth. Do NOT modify this file because it is locked. Instead define all new http actions in \`convex/router.ts\`.
      </http_guidelines>

      <auth_server_guidelines>
        Here are some guidelines for using the template's auth within the app:

        When writing Convex handlers, use the 'getAuthUserId' function to get the logged in user's ID. You
        can then pass this to 'ctx.db.get' in queries or mutations to get the user's data. But, you can only
        do this within the \`convex/\` directory. For example:
        \`\`\`ts "convex/users.ts"
        import { getAuthUserId } from "@convex-dev/auth/server";

        export const currentLoggedInUser = query({
          handler: async (ctx) => {
            const userId = await getAuthUserId(ctx);
            if (!userId) {
              return null;
            }
            const user = await ctx.db.get(userId);
            if (!user) {
              return null;
            }
            console.log("User", user.name, user.image, user.email);
            return user;
          }
        })
        \`\`\`

        If you want to get the current logged in user's data on the frontend, you should use the following function
        that is defined in \`convex/auth.ts\`:

        \`\`\`ts "convex/auth.ts"
        export const loggedInUser = query({
          handler: async (ctx) => {
            const userId = await getAuthUserId(ctx);
            if (!userId) {
              return null;
            }
            const user = await ctx.db.get(userId);
            if (!user) {
              return null;
            }
            return user;
          },
        });
        \`\`\`

        Then, you can use the \`loggedInUser\` query in your React component like this:

        \`\`\`tsx "app/(tabs)/index.tsx"
        const user = useQuery(api.auth.loggedInUser);
        \`\`\`

        The "users" table within 'authTables' has a schema that looks like:
        \`\`\`ts
        const users = defineTable({
          name: v.optional(v.string()),
          image: v.optional(v.string()),
          email: v.optional(v.string()),
          emailVerificationTime: v.optional(v.number()),
          phone: v.optional(v.string()),
          phoneVerificationTime: v.optional(v.number()),
          isAnonymous: v.optional(v.boolean()),
        })
          .index("email", ["email"])
          .index("phone", ["phone"]);
        \`\`\`

        But the project start with new user schema that looks like:
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
          .index('phone', ['phone']),
        \`\`\`
      </auth_server_guidelines>

      <client_guidelines>
        Here is an example of using Convex from an Expo React Native app:
        \`\`\`tsx
        import React from 'react';
        import { useMutation, useQuery } from 'convex/react';
        import { api } from '@/convex/_generated/api';
        import { Text } from '@/components/ui/text';
        import { View } from '@/components/ui/view';
        import { Card } from '@/components/ui/card';
        import { Button } from '@/components/ui/button';

        export default function CounterScreen() {
          const counter = useQuery(api.counter.get);
          const increment = useMutation(api.counter.increment);
          const decrement = useMutation(api.counter.decrement);
          const reset = useMutation(api.counter.reset);

          const handleIncrement = async () => {
            await increment();
          };

          const handleDecrement = async () => {
            await decrement();
          };

          const handleReset = async () => {
            await reset();
          };

          return (
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
              <Text variant='heading'>Counter App</Text>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ minWidth: 200, alignItems: 'center', padding: 20 }}>
                  <Text variant='caption'>Current Count</Text>
                  <Text variant='heading' style={{ fontSize: 64, marginVertical: 20 }}>
                    {counter ?? 0}
                  </Text>
                </Card>

                <View style={{ marginTop: 30, gap: 10, width: '100%' }}>
                  <Button onPress={handleIncrement}>Increment (+1)</Button>
                  <Button onPress={handleDecrement}>Decrement (-1)</Button>
                  <Button onPress={handleReset} variant='outline'>
                    Reset to 0
                  </Button>
                </View>
              </View>
            </View>
          );
        }
        \`\`\`

        The \`useQuery()\` hook is live-updating! It causes the React component is it used in to rerender, so Convex is a
        perfect fix for collaborative, live-updating websites.

        NEVER use \`useQuery()\` or other \`use\` hooks conditionally. The following example is invalid:

        \`\`\`tsx
        const avatarUrl = profile?.avatarId ? useQuery(api.profiles.getAvatarUrl, { storageId: profile.avatarId }) : null;
        \`\`\`

        You should do this instead:

        \`\`\`tsx
        const avatarUrl = useQuery(
          api.profiles.getAvatarUrl,
          profile?.avatarId ? { storageId: profile.avatarId } : "skip"
        );
        \`\`\`

        When writing a UI component and you want to use a Convex function, you MUST import the \`api\` object. For example:

        \`\`\`tsx
        import { api } from "../convex/_generated/api";
        \`\`\`

        You can use the \`api\` object to call any public Convex function.

        Do not use \`sharp\` for image compression, always use \`canvas\` for image compression.

        Always make sure your UIs work well with anonymous users.

        Always make sure the functions you are calling are defined in the \`convex/\` directory and use the \`api\` or \`internal\` object to call them.
        
        Always make sure you are using the correct arguments for convex functions. If arguments are not optional, make sure they are not null.
      </client_guidelines>
    </convex_guidelines>
  </solution_constraints>
  `;
}
