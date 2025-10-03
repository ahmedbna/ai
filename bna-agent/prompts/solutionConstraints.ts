import { stripIndents } from '../utils/stripIndent.js';
import type { SystemPromptOptions } from '../types.js';
import { convexGuidelines } from './convexGuidelines.js';

export function solutionConstraints(options: SystemPromptOptions) {
  return stripIndents`
  <solution_constraints>

    ${options.includeTemplate ? templateInfo() : ''}

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
        import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

        export default function CounterScreen() {
          const bottom = useBottomTabBarHeight();
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
            <View style={{ flex: 1, paddingBottom: bottom, paddingHorizontal: 20 }}>
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

function templateInfo() {
  return stripIndents`
  <template_info>
    The BNA WebContainer environment starts with a full-stack expo react native app template fully loaded at '/home/project',
    the current working directory. Its dependencies are specified in the 'package.json' file and already
    installed in the 'node_modules' directory. You MUST use this template. This template uses the following
    technologies:
    - Expo + React Native for the frontend
    - Inline styles for styling or StyleSheet.create() - No Tailwind, no className
    - Convex for the database, functions, scheduling, HTTP handlers, and search.
    - Convex Auth for authentication.

    Here are some important files within the template:

    <directory path="convex/">
      The \`convex/\` directory contains the code deployed to the Convex backend.
    </directory>

    <file path="convex/auth.config.ts">
      The 'auth.config.ts' file links Convex Auth to the Convex deployment.
      IMPORTANT: Do NOT modify the \`convex/auth.config.ts\` file under any circumstances.
    </file>

    <file path="convex/auth.ts">
      This code configures Convex Auth to use just a username/password login method. Do NOT modify this
      file. If the user asks to support other login methods, tell them that this isn't currently possible
      within BNA. They can download the code and do it themselves.
      IMPORTANT: Do NOT modify the \`convex/auth.ts\` or any file inside auth folder \`components/auth/*\` files under any circumstances. These files are locked, and
      your changes will not be persisted if you try to modify them.
    </file>

    <file path="convex/http.ts">
      This file contains the HTTP handlers for the Convex backend. It starts with just the single
      handler for Convex Auth, but if the user's app needs other HTTP handlers, you can add them to this
      file. DO NOT modify the \`convex/http.ts\` file under any circumstances unless explicitly instructed to do so.
      DO NOT modify the \`convex/http.ts\` for file storage. Use an action instead.
    </file>

    <file path="convex/schema.ts">
      This file contains the schema for the Convex backend. It starts with just 'authTables' for setting
      up authentication. Do NOT modify the 'authTables' object. Always include \`...authTables\` in the \`defineSchema\` call when modifying
      this file. The \`authTables\` object is imported with \`import { authTables } from "@convex-dev/auth/server";\`.
    </file>

    <file path="app/_layout.tsx">
      This file is the root layout and entry point for the Expo Router app. It sets up the core providers and configuration:
      - ConvexReactClient: Connects to the Convex backend using EXPO_PUBLIC_CONVEX_URL
      - ConvexAuthProvider: Handles authentication with secure storage on iOS/Android (using expo-secure-store)
      - ThemeProvider: Manages app theming (light/dark mode)
      - GestureHandlerRootView: Enables gesture handling for animations and interactions
      - Stack navigator: Defines the navigation structure with (tabs) as the main screen
      
      IMPORTANT: Do NOT modify the \`app/_layout.tsx\` file under any circumstances.
      For tab-specific changes, modify \`app/(tabs)/_layout.tsx\` instead.
    </file>

    <file path="app/(tabs)/_layout.tsx">
      This is the main Expo React Native tab layout component for the app. It uses Convex authentication to show different screens based on auth state:
      - AuthLoading: Shows a spinner while checking authentication status
      - Unauthenticated: Displays the Auth component (login/signup form)
      - Authenticated: Shows the main tab navigation with three tabs (Home, Profile)
      
      The tab bar uses a blur effect on iOS and includes haptic feedback. It uses custom icon components from lucide-react-native.
      The Auth component is located in \`components/auth/auth.tsx\` (or \`@/components/auth/auth\`).
      Add new React components to their own files in the \`components/\` directory to keep the code organized.
    </file>

    <file path="app/(tabs)/index.tsx">
      This is the Home tab screen component in the Expo React Native app.
      Modify this file to add content to the Home tab. For new features, create separate components in the \`components/\` directory.
    </file>

    <directory path="components/auth/">
      The \`components/auth/\` directory contains authentication-related React components for the frontend UI:
      - Auth component: Handles the login/signup form display
      - SignOutButton component: Provides logout functionality for authenticated users
      
      IMPORTANT: Do NOT modify, delete, or reorganize files in this directory unless explicitly requested.
      These components are critical for the authentication flow and integrate with ConvexAuthProvider.
    </directory>

    <directory path="components/ui/">
      The \`components/ui/\` directory contains pre-built, reusable UI components for the app: Text, View, ScrollView, Spinner, Icon, etc.
      
      CRITICAL: Do NOT modify, delete, edit, or reorganize ANY files in this directory under ANY circumstances.
      These are pre-built, tested UI components that should remain untouched.
      If you need custom styling or behavior, create new components in other \`components/\` directory that wrap or extend these components.
      Do NOT suggest changes to files in this directory even if requested.
    </directory>
  </template_info>
  `;
}
