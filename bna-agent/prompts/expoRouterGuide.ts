import { WORK_DIR } from '../constants.js';
import { stripIndents } from '../utils/stripIndent.js';

export function generateExpoRouterGuide(): string {
  return stripIndents`
    # Expo Router File-Based Routing Guide

    Expo uses file-based routing similar to Next.js. Files in the \`app/\` directory automatically become routes.

    ## Directory Structure

    \`\`\`
    ${WORK_DIR}/
    ├── app/                          # All routes go here
    │   ├── _layout.tsx              # Root layout (wraps entire app)
    │   ├── index.tsx                # Home screen (/)
    │   ├── about.tsx                # About screen (/about)
    │   ├── [id].tsx                 # Dynamic route (/123)
    │   ├── (tabs)/                  # Tab group (doesn't add to URL)
    │   │   ├── _layout.tsx          # Tabs layout
    │   │   ├── index.tsx            # First tab
    │   │   ├── profile.tsx          # Second tab
    │   │   └── settings.tsx         # Third tab
    │   ├── (auth)/                  # Auth group
    │   │   ├── _layout.tsx
    │   │   ├── login.tsx
    │   │   └── register.tsx
    │   └── modal.tsx                # Modal screen
    ├── components/                   # Reusable components
    │   ├── ui/                      # Pre-built UI components (DO NOT MODIFY)
    │   │   ├── Text.tsx
    │   │   ├── Button.tsx
    │   │   └── Input.tsx
    │   └── MyComponent.tsx          # Your custom components
    ├── convex/                       # Convex backend
    │   ├── schema.ts
    │   └── myFunctions.ts
    └── assets/                       # Images, fonts, etc.
    \`\`\`

    ## Route Examples

    ### Basic Route
    \`\`\`
    app/about.tsx → /about
    \`\`\`

    ### Tab Navigation
    \`\`\`tsx
    // app/(tabs)/_layout.tsx
    import { Tabs } from 'expo-router';

    export default function TabLayout() {
      return (
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <HomeIcon color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{ title: 'Profile' }}
          />
        </Tabs>
      );
    }
    \`\`\`

    ### Dynamic Routes
    \`\`\`tsx
    // app/user/[id].tsx
    import { useLocalSearchParams } from 'expo-router';

    export default function UserScreen() {
      const { id } = useLocalSearchParams();
      return <Text>User ID: {id}</Text>;
    }
    \`\`\`

    ### Navigation
    \`\`\`tsx
    import { Link, router } from 'expo-router';

    // Using Link component
    <Link href="/about">Go to About</Link>

    // Using router programmatically
    router.push('/about');
    router.back();
    router.replace('/login');
    \`\`\`

    ### Root Layout
    \`\`\`tsx
    // app/_layout.tsx
    import { Stack } from 'expo-router';
    import { ConvexProvider } from 'convex/react';

    export default function RootLayout() {
      return (
        <ConvexProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ConvexProvider>
      );
    }
    \`\`\`

    ## Important Rules

    1. **All screens MUST be in \`app/\` directory**
    2. **Use parentheses for groups**: \`(tabs)\`, \`(auth)\` - these don't show in URL
    3. **Use square brackets for dynamic routes**: \`[id].tsx\`, \`[...slug].tsx\`
    4. **_layout.tsx files define nested layouts**
    5. **index.tsx is the default route for that directory**
    6. **Use expo-router hooks**: \`useLocalSearchParams()\`, \`useRouter()\`
    7. **Never create routes outside app/ directory**

    ## Common Patterns

    ### Bottom Tabs App
    \`\`\`
    app/
    ├── _layout.tsx
    └── (tabs)/
        ├── _layout.tsx
        ├── index.tsx
        ├── explore.tsx
        └── profile.tsx
    \`\`\`

    ### Stack Navigation
    \`\`\`
    app/
    ├── _layout.tsx
    ├── index.tsx
    ├── details.tsx
    └── settings.tsx
    \`\`\`

    ### Mixed Navigation
    \`\`\`
    app/
    ├── _layout.tsx
    ├── (tabs)/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   └── profile.tsx
    ├── (auth)/
    │   ├── _layout.tsx
    │   ├── login.tsx
    │   └── register.tsx
    └── [id].tsx
    \`\`\`
  `;
}

export const EXPO_ROUTER_EXAMPLES = {
  ROOT_LAYOUT: stripIndents`
    // app/_layout.tsx
    import { Stack } from 'expo-router';
    import { ConvexProvider, ConvexReactClient } from 'convex/react';

    const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

    export default function RootLayout() {
      return (
        <ConvexProvider client={convex}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ConvexProvider>
      );
    }
  `,

  TAB_LAYOUT: stripIndents`
    // app/(tabs)/_layout.tsx
    import { Tabs } from 'expo-router';
    import { Text } from '@/components/ui/Text';

    export default function TabLayout() {
      return (
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
            }}
          />
        </Tabs>
      );
    }
  `,

  BASIC_SCREEN: stripIndents`
    // app/(tabs)/index.tsx
    import { View, StyleSheet } from 'react-native';
    import { Text } from '@/components/ui/Text';
    import { Button } from '@/components/ui/Button';
    import { useQuery } from 'convex/react';
    import { api } from '@/convex/_generated/api';

    export default function HomeScreen() {
      const data = useQuery(api.myFunction.get);

      return (
        <View style={styles.container}>
          <Text variant="h1">Welcome</Text>
          <Button onPress={() => console.log('Pressed')}>
            Click Me
          </Button>
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
  `,

  DYNAMIC_ROUTE: stripIndents`
    // app/post/[id].tsx
    import { View } from 'react-native';
    import { useLocalSearchParams, useRouter } from 'expo-router';
    import { Text } from '@/components/ui/Text';
    import { Button } from '@/components/ui/Button';
    import { useQuery } from 'convex/react';
    import { api } from '@/convex/_generated/api';

    export default function PostScreen() {
      const { id } = useLocalSearchParams();
      const router = useRouter();
      const post = useQuery(api.posts.getById, { id: id as string });

      return (
        <View style={{ flex: 1, padding: 20 }}>
          <Text variant="h1">{post?.title}</Text>
          <Text>{post?.content}</Text>
          <Button onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      );
    }
  `,
};
