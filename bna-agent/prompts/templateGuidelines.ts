import { WORK_DIR } from '../constants.js';
import { stripIndents } from '../utils/stripIndent.js';

export const templateGuidelines = () => {
  return stripIndents`
    <template_info>
    
      ## Template Configuration

      The BNA WebContainer environment starts with a full-stack expo react native app template fully loaded at '/home/project',
      the current working directory. Its dependencies are specified in the 'package.json' file and already
      installed in the 'node_modules' directory. You MUST use this template. This template uses the following
      technologies:
      - Expo + React Native for the frontend
      - Inline styles for styling or StyleSheet.create() - No Tailwind, no className
      - Convex for the database, functions, scheduling, HTTP handlers, and search.
      - Convex Auth for authentication.

      Before using any prebuilt UI component, ALWAYS call the lookupComponentsTool to fetch its complete documentation. Review the docs carefully to understand its usage, props, and examples.
      
      ${generateDirectoryStructure()}

      ## CRITICAL: Theme and Styling Requirements

      <theme_requirements>
        **ALWAYS use the useColor hook for colors - NEVER hardcode color values directly in styles**

        ### Correct Usage
        \`\`\`typescript
        import { useColor } from '@/hooks/useColor';

        export function MyComponent() {
          const background = useColor('background');
          const primary = useColor('primary');
          const border = useColor('border');
          
          return (
            <View style={{ backgroundColor: background, borderColor: border }}>
              <Text style={{ color: primary }}>Themed text</Text>
            </View>
          );
        }
        \`\`\`

        ### Incorrect Usage
        \`\`\`typescript
        // NEVER do this:
        <View style={{ borderColor: '#333' }}>
        <View style={{ backgroundColor: '#FFFFFF' }}>
        <Text style={{ color: '#000000' }}>
        \`\`\`

        ### Available Color Tokens
        - \`background\` - Main screen background
        - \`foreground\` - Main text color
        - \`primary\` - Primary brand color
        - \`primaryForeground\` - Text on primary elements
        - \`secondary\` - Secondary UI elements
        - \`secondaryForeground\` - Text on secondary elements
        - \`accent\` - Accent color for highlights
        - \`accentForeground\` - Text on accent elements
        - \`card\` - Card backgrounds
        - \`cardForeground\` - Text on cards
        - \`muted\` - Muted/disabled states
        - \`mutedForeground\` - Text on muted elements
        - \`destructive\` - Delete/error actions
        - \`destructiveForeground\` - Text on destructive elements
        - \`border\` - Border color
        - \`input\` - Input field borders
        - \`ring\` - Focus ring color
        - \`blue\`, \`green\`, \`red\`, \`orange\`, \`yellow\`, \`pink\`, \`purple\`, \`teal\`, \`indigo\` - Accent colors

        ### Required for Every New Screen
        **MANDATORY: Every new screen component MUST include background color using useColor**

        \`\`\`typescript
        import { View } from '@/components/ui/view';
        import { useColor } from '@/hooks/useColor';

        export default function NewScreen() {
          const background = useColor('background');
          
          return (
            <View style={{ flex: 1, backgroundColor: background }}>
              {/* Your screen content */}
            </View>
          );
        }
        \`\`\`

        ### Custom Colors
        If you need custom colors not in the theme:
        1. Add them to \`theme/colors.ts\` in both \`lightColors\` and \`darkColors\`
        2. Then use them via \`useColor('yourCustomColor')\`

        **NEVER hardcode hex/rgb values directly in component styles**
      </theme_requirements>

      <deprecated_apis>
        **CRITICAL: Do NOT use deprecated or incompatible APIs**

        ### NEVER Use These:
        \`\`\`typescript
        // DEPRECATED - Causes errors with NativeTabs
        import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
        const bottom = useBottomTabBarHeight();

        // NEVER use hardcoded colors
        style={{ backgroundColor: '#FFFFFF' }}
        style={{ color: '#000000' }}
        \`\`\`

        ### Use Instead:
        \`\`\`typescript
        // For colors - use useColor hook
        import { useColor } from '@/hooks/useColor';
        const background = useColor('background');

        // For bottom spacing - use useSafeAreaInsets if needed
        import { useSafeAreaInsets } from 'react-native-safe-area-context';
        const insets = useSafeAreaInsets();
        // Use insets.bottom for bottom safe area padding or insets.top for top safe area padding 
        <View style={{ paddingBottom: insets.bottom }} /> or <View style={{ paddingTop: insets.top }} />
      
        \`\`\`
      </deprecated_apis>

      <ui_components_library>
        You have access to the following production-ready, pre-installed UI components at components/ui/. These components are:
        accordion, action sheet, alert dialog, alert, audio player, audio recorder, audio waveform, avatar, avoid keyboard, badge, bottom sheet, button, camera preview, camera, card, carousel, checkbox, collapsible, color picker, combobox, date picker, file picker, gallery, hello wave, icon, image, input otp, input, link, media picker, mode toggle, onboarding, parallax scrollview, picker, popover, progress, radio, scroll view, searchbar, separator, share, sheet, skeleton, spinner, switch, table, tabs, text, toast, toggle, video, view
        
        **CRITICAL:Before using any prebuilt UI component, ALWAYS call the lookupComponentsTool to fetch its complete documentation. Review the docs carefully to understand its usage, props, and examples.

        **CRITICAL: Always check for existing components before creating new ones.**

        ## Usage Workflow
        1. **Check if component exists**: Use lookupComponentsTool tool - Example: \`lookupComponentsTool({ docs: ["ui:button", "ui:dialog"] })\`
        2. **Import**: \`import { Component } from '@/components/ui/component-name'\`
        3. **Use with proper props**: Follow the examples from documentation
        4. **NEVER modify**: Files in \`components/ui/\` are locked

        **UI Components**: Use "ui:" prefix (e.g., ui:button, ui:input, ui:accordion)

        ## Critical Rules
        - ALWAYS lookup component docs before using
        - NEVER create custom versions of existing components
        - NEVER modify files in \`components/ui/\` directory
        - ALWAYS use provided props and variants
        - Only create custom components if no suitable component exists

        ## Example: Using Dialog
        \`\`\`tsx
        // DON'T create custom modal
        const CustomModal = () => { /* ... */ }

        // DO use Bottom Sheet component
        \`\`\`

        When you need a UI component, FIRST use lookupComponentsTool tool to get full documentation including:
        - All props and their types
        - Multiple usage examples
      </ui_components_library>

      ## Important Files and Directories

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
        This file is the **Root Layout (app/_layout.tsx)** and entry point for the Expo Router app. It sets up the core providers and configuration:
        - ConvexReactClient: Connects to the Convex backend using EXPO_PUBLIC_CONVEX_URL
        - ConvexAuthProvider: Handles authentication with secure storage on iOS/Android (using expo-secure-store)
        - ThemeProvider: Manages app theming (light/dark mode)
        - GestureHandlerRootView: Enables gesture handling for animations and interactions
        - Stack navigator: Defines the navigation structure with (tabs) as the main screen
        - Auth component automatically shown for unauthenticated users
        - All authentication routing and state management is handled
        - Authenticated, Unauthenticated, and AuthLoading states
        
        IMPORTANT: Do NOT modify the \`app/_layout.tsx\` file under any circumstances.
        For tab-specific changes, modify \`app/(tabs)/_layout.tsx\` and \`app/(tabs)/_layout.web.tsx\` instead.

        CRITICAL: Authentication is FULLY IMPLEMENTED in this template at \`app/_layout.tsx\`. DO NOT create custom auth flows, login screens, or authentication logic.

        import { View } from '@/components/ui/view';
        import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

        export default function RootLayout() {
          return (
            <View>
              <AuthLoading>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spinner size='lg' variant='circle' />
                </View>
              </AuthLoading>
              <Unauthenticated>
                <Auth />
              </Unauthenticated>
              <Authenticated>
                <Stack>
                  <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                  <Stack.Screen name='+not-found' />
                </Stack>
              </Authenticated>
            </View>
          )}
      </file>

      <file path="app/(tabs)/_layout.tsx">
        This is the main Expo React Native tab layout component for native platforms (iOS/Android). It uses:
        - NativeTabs from expo-router/unstable-native-tabs for native navigation
        - Platform-specific icons (SF Symbols for iOS, Feather icons for Android)
        - Convex authentication to control access
        - Optional Badge components for notifications
        
        When adding new tabs, you MUST also update \`app/(tabs)/_layout.web.tsx\`.
        Add new React components to their own files in the \`components/\` directory to keep the code organized.
      </file>

      <file path="app/(tabs)/_layout.web.tsx">
        This is the web-specific tab layout component for the Expo app. It uses:
        - Tabs from expo-router for web navigation
        - lucide-react-native icons
        - Custom Icon component from @/components/ui/icon
        - useColor hook for theme-aware colors
        
        When adding new tabs, you MUST also update \`app/(tabs)/_layout.tsx\` for native platforms.
        Ensure the \`name\` prop matches exactly between both layout files and the screen filename.
      </file>

      <file path="app/(tabs)/index.tsx">
        This is the Home tab screen component in the Expo React Native app.
        Modify this file to add content to the Home tab. For new features, create separate components in the \`components/\` directory.
      </file>

      <file path="theme/colors.ts">
        This file contains the color configuration for the app's theming system. It includes:
        - lightColors: Color palette for light mode
        - darkColors: Color palette for dark mode
        - semanticColors: Colors for success, warning, info, and error states
        - withOpacity: Utility function for adding transparency to colors
        
        Modify this file to customize the app's visual identity and brand colors.
        Change primary, secondary, accent colors to match your app's design requirements.
        See the "Customizing App Theme Colors" section in the routing guide above for detailed instructions.
      </file>

      <directory path="components/auth/">
        The  **Auth Components (components/auth/)** directory contains authentication-related React components for the frontend UI:
        - Auth component: Handles the login/signup/singout form display
        - SignOutButton component: Provides logout functionality for authenticated users
        - SignOutButton component: Ready-to-use logout functionality
        - DO NOT modify or recreate these components

        **How to use Sign Out Button:**
        \`\`\`typescript
        import { SignOutButton } from '@/components/auth/singout';

        // In your component:
        <SignOutButton />
        \`\`\`

        The SignOutButton component:
        - Automatically shows only when user is authenticated
        - Handles sign out and navigation cleanup
        - Uses destructive variant with logout icon
        - No additional configuration needed
        
        IMPORTANT: Do NOT modify, delete, or reorganize files in this directory unless explicitly requested.
        These components are critical for the authentication flow and integrate with ConvexAuthProvider.
      </directory>

      <directory path="components/ui/">
        The \`components/ui/\` directory contains pre-built, reusable UI components for the app: Text, View, ScrollView, Spinner, Icon, etc.
        
        CRITICAL: Do NOT modify, delete, edit, or reorganize ANY files in this directory under ANY circumstances.
        These are pre-built, tested UI components that should remain untouched.
        If you need custom styling or behavior, create new components in other \`components/\` subdirectories that wrap or extend these components.
        Do NOT suggest changes to files in this directory even if requested.
      </directory>

      <directory path="hooks/">
        The \`hooks/\` directory contains custom React hooks for the app:
        - useColor: Access theme colors based on the current color scheme
        - useColorScheme: Get the current color scheme (light/dark)
        - useModeToggle: Toggle between light and dark mode
        - useBottomTabOverflow: Handle bottom tab bar overflow on iOS
        - useKeyboardHeight: Track keyboard height for proper UI adjustments
        
        Use these hooks in your components to access theme values and system states.
      </directory>

      ## Development Guidelines

      ### Styling
      - **MANDATORY: Use useColor hook for ALL colors - NEVER hardcode hex/rgb values**
      - Use inline styles or StyleSheet.create() for all styling
      - DO NOT use Tailwind CSS or className props
      - Access theme colors using the useColor hook from '@/hooks/useColor'
      - Example: \`const primary = useColor('primary');\`
      - **Every screen MUST set backgroundColor using useColor('background')**

      ### Navigation
      - Use expo-router for navigation: \`import { router } from 'expo-router';\`
      - Navigate with \`router.push('/screen-name')\`
      - Access route params with \`useLocalSearchParams()\`
      - **DO NOT use useBottomTabBarHeight() - incompatible with NativeTabs**

      ### Components
      - Create new components in \`components/\` directory
      - Use pre-built UI components from \`components/ui/\`
      - Import with absolute paths: \`import { Button } from '@/components/ui/button';\`

      ### Backend (Convex)
      - Create queries in convex/ directory: \`export const myQuery = query(...)\`
      - Use mutations for data changes: \`export const myMutation = mutation(...)\`
      - Access in components: \`const data = useQuery(api.myFile.myQuery);\`

      ### Authentication
      - If you want to check auth status with \`import { useConvexAuth } from 'convex/react'; const { isAuthenticated, isLoading } = useConvexAuth();\`
      - Sign out with the SignOut component from \`@/components/auth/singout\`
      - DO NOT modify auth configuration files

      ## Common Tasks

      ### Adding a New Tab
      1. Create screen file: \`app/(tabs)/screen-name.tsx\`
      2. **Add background color**: \`const background = useColor('background')\`
      3. Update \`app/(tabs)/_layout.web.tsx\` with new Tabs.Screen
      4. Update \`app/(tabs)/_layout.tsx\` with new NativeTabs.Trigger
      5. Ensure \`name\` prop matches filename exactly

      ### Creating a New Database Table
      1. Edit \`convex/schema.ts\`
      2. Add table definition: \`tableName: defineTable({ ... })\`
      3. Always keep \`...authTables\` in defineSchema
      4. Create queries/mutations in new convex file

      ### Customizing Theme
      1. Edit \`theme/colors.ts\`
      2. Modify \`lightColors\` and \`darkColors\` objects
      3. Use hex colors or rgba values
      4. Test in both light and dark modes
      5. Access new colors via \`useColor('yourNewColor')\`

      Remember: This template is your starting point. Build upon it without modifying locked files (auth, UI components, root layout).
      **ALWAYS use useColor for colors and add background color to every new screen.**
    </template_info>
  `;
};

function generateDirectoryStructure(): string {
  return stripIndents`
    # Expo Router File-Based Routing Guide

    ## Getting Started

    This is the provided Expo React Native template to start with. It includes:
    - **Expo Router** for file-based navigation
    - **TypeScript** for type safety
    - **Pre-built UI components** with theming support
    - **Authentication setup** with Convex
    - **Dark/Light mode** theme system
    - **Cross-platform support** (iOS, Android, Web)

    The template uses file-based routing similar to Next.js. Files in the \`app/\` directory automatically become routes.

    ## Directory Structure

    \`\`\`
    ${WORK_DIR}
    ├── app
    │   ├── _layout.tsx
    │   ├── (tabs)
    │   │   ├── _layout.tsx
    │   │   ├── _layout.web.tsx
    │   │   ├── index.tsx
    │   │   └── settings.tsx
    │   └── +not-found.tsx
    ├── app.json
    ├── assets
    │   └── images
    │       ├── icon.png
    │       └── splash.png
    ├── components
    │   ├── auth
    │   │   ├── apple.tsx
    │   │   ├── auth.tsx
    │   │   ├── email-otp.tsx
    │   │   ├── google.tsx
    │   │   ├── password.tsx
    │   │   └── singout.tsx
    │   └── ui
    │       ├── accordion.tsx
    │       ├── action-sheet.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── audio-player.tsx
    │       ├── audio-recorder.tsx
    │       ├── audio-waveform.tsx
    │       ├── avatar.tsx
    │       ├── avoid-keyboard.tsx
    │       ├── badge.tsx
    │       ├── bottom-sheet.tsx
    │       ├── button.tsx
    │       ├── camera-preview.tsx
    │       ├── camera.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── color-picker.tsx
    │       ├── combobox.tsx
    │       ├── date-picker.tsx
    │       ├── file-picker.tsx
    │       ├── gallery.tsx
    │       ├── hello-wave.tsx
    │       ├── icon.tsx
    │       ├── image.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── link.tsx
    │       ├── media-picker.tsx
    │       ├── mode-toggle.tsx
    │       ├── onboarding.tsx
    │       ├── parallax-scrollview.tsx
    │       ├── picker.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio.tsx
    │       ├── scroll-view.tsx
    │       ├── searchbar.tsx
    │       ├── separator.tsx
    │       ├── share.tsx
    │       ├── sheet.tsx
    │       ├── skeleton.tsx
    │       ├── spinner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── text.tsx
    │       ├── toast.tsx
    │       ├── toggle.tsx
    │       ├── video.tsx
    │       └── view.tsx
    ├── convex
    │   ├── _generated
    │   │   ├── api.d.ts
    │   │   ├── api.js
    │   │   ├── dataModel.d.ts
    │   │   ├── server.d.ts
    │   │   └── server.js
    │   ├── auth.config.ts
    │   ├── auth.ts
    │   ├── http.ts
    │   ├── passwordReset.ts
    │   ├── resendOTP.ts
    │   ├── resendPasswordOTP.ts
    │   ├── router.ts
    │   ├── schema.ts
    │   ├── tsconfig.json
    │   └── users.ts
    ├── eslint.config.js
    ├── expo-env.d.ts
    ├── hooks
    │   ├── useBottomTabOverflow.ts
    │   ├── useColor.ts
    │   ├── useColorScheme.ts
    │   ├── useColorScheme.web.ts
    │   ├── useKeyboardHeight.ts
    │   └── useModeToggle.tsx
    ├── package.json
    ├── theme
    │   ├── colors.ts              # Theme colors configuration
    │   ├── globals.ts
    │   └── theme-provider.tsx
    └── tsconfig.json
    \`\`\`

    ## Important Rules

    1. **All screens MUST be in \`app/(tabs)/\` directory**
    2. **Use parentheses for groups**: \`(tabs)\`, \`(auth)\` - these don't show in URL
    3. **Use square brackets for dynamic routes**: \`[id].tsx\`, \`[...slug].tsx\`
    4. **_layout.tsx files define nested layouts**
    5. **index.tsx is the default route for that directory**
    6. **Use expo-router hooks**: \`useLocalSearchParams()\`, \`useRouter()\`
    7. **Never create routes outside app/ directory**
    8. **You MUST update BOTH \`_layout.tsx\` AND \`_layout.web.tsx\` files when adding tabs**
    9. **Max number of Tabs is five no more**
    10. **ALWAYS use useColor hook for colors - NEVER hardcode color values**
    11. **Every new screen MUST set background color using useColor('background')**

    ---

    # Adding New Tabs to Expo React Native App

    ## Step-by-Step Process

    ### Step 1: Create the Screen Component
    Create a new file in \`app/(tabs)/[screen-name].tsx\`:

    \`\`\`typescript
    // app/(tabs)/profile.tsx
    import React from 'react';
    import { View } from '@/components/ui/view';
    import { Text } from '@/components/ui/text';
    import { useColor } from '@/hooks/useColor';

    export default function ProfileScreen() {
      const background = useColor('background');
      const foreground = useColor('foreground');
      
      return (
        <View style={{ flex: 1, backgroundColor: background }}>
          <Text style={{ color: foreground }}>Profile Screen</Text>
        </View>
      );
    }
    \`\`\`

    ### Step 2: Update Web Layout (\`_layout.web.tsx\`)

    Add the new tab to the web layout:

    \`\`\`typescriptreact
    // app/(tabs)/_layout.web.tsx

    import React from 'react';
    import { Tabs } from 'expo-router';
    import { Home, Settings, User } from 'lucide-react-native'; // Import icon
    import { Icon } from '@/components/ui/icon';
    import { useColor } from '@/hooks/useColor';

    export default function WebTabsLayout() {
      const primary = useColor('primary');

      return (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: primary,
          }}
        >
          <Tabs.Screen
            name='index'
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => (
                <Icon name={Home} size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name='settings'
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => (
                <Icon name={Settings} size={24} color={color} />
              ),
            }}
          />

          {/* NEW TAB - Add here */}
          <Tabs.Screen
            name='profile'
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => (
                <Icon name={User} size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      );
    }
    \`\`\`

    ### Step 3: Update Native Layout (\`_layout.tsx\`)

    Add the new tab to the native layout:

    \`\`\`typescriptreact
    // app/(tabs)/_layout.tsx

    import { Platform } from 'react-native';
    import {
      Badge,
      Icon,
      Label,
      NativeTabs,
      VectorIcon,
    } from 'expo-router/unstable-native-tabs';
    import MaterialIcons from '@expo/vector-icons/Feather';

    export default function TabsLayout() {
      return (
        <NativeTabs>
          <NativeTabs.Trigger name='index'>
            <Label>Home</Label>
            {Platform.select({
              ios: <Icon sf='house.fill' />,
              android: (
                <Icon src={<VectorIcon family={MaterialIcons} name='home' />} />
              ),
            })}
          </NativeTabs.Trigger>

          <NativeTabs.Trigger name='settings' options={{ title: 'Settings' }}>
            <Label>Settings</Label>
            {Platform.select({
              ios: <Icon sf='gear' />,
              android: (
                <Icon src={<VectorIcon family={MaterialIcons} name='settings' />} />
              ),
            })}
            <Badge>!</Badge>
          </NativeTabs.Trigger>

          {/* NEW TAB - Add here */}
          <NativeTabs.Trigger name='profile' options={{ title: 'Profile' }}>
            <Label>Profile</Label>
            {Platform.select({
              ios: <Icon sf='person.fill' />,
              android: (
                <Icon src={<VectorIcon family={MaterialIcons} name='user' />} />
              ),
            })}
          </NativeTabs.Trigger>
        </NativeTabs>
      );
    }
    \`\`\`

    ## Key Points to Remember

    ### Web Layout (\`_layout.web.tsx\`)
    - Uses \`Tabs\` from \`expo-router\`
    - Uses \`Tabs.Screen\` with \`name\` matching the filename
    - Icons come from \`lucide-react-native\`
    - Icons are passed through custom \`Icon\` component
    - \`name\` property must match the filename (without \`.tsx\`)

    ### Native Layout (\`_layout.tsx\`)
    - Uses \`NativeTabs\` from \`expo-router/unstable-native-tabs\`
    - Uses \`NativeTabs.Trigger\` with \`name\` matching the filename
    - Requires platform-specific icons:
      - iOS: SF Symbols via \`sf\` prop
      - Android: Feather icons via \`VectorIcon\`
    - Optional \`Badge\` component for notifications
    - \`name\` property must match the filename (without \`.tsx\`)

    ## Icon Reference

    ### Web Icons (lucide-react-native)
    Common icons: \`Home\`, \`Settings\`, \`User\`, \`Search\`, \`Bell\`, \`Calendar\`, \`Mail\`, \`Heart\`, \`Shield\`, \`Package\`, \`ShoppingCart\`, \`Camera\`, \`Image\`, \`File\`, \`Folder\`

    ### Native Icons

    **iOS (SF Symbols)**: 
    - \`house.fill\`, \`gear\`, \`person.fill\`, \`magnifyingglass\`, \`bell.fill\`
    - \`calendar\`, \`envelope.fill\`, \`heart.fill\`, \`shield.fill\`, \`shippingbox.fill\`
    - \`cart.fill\`, \`camera.fill\`, \`photo.fill\`, \`doc.fill\`, \`folder.fill\`

    **Android (Feather)**: 
    - \`home\`, \`settings\`, \`user\`, \`search\`, \`bell\`
    - \`calendar\`, \`mail\`, \`heart\`, \`shield\`, \`package\`
    - \`shopping-cart\`, \`camera\`, \`image\`, \`file\`, \`folder\`

    ## Complete Example: Adding a "Search" Tab

    \`\`\`typescript
    // 1. Create app/(tabs)/search.tsx
    import React from 'react';
    import { View } from '@/components/ui/view';
    import { Text } from '@/components/ui/text';
    import { useColor } from '@/hooks/useColor';

    export default function SearchScreen() {
      const background = useColor('background');
      const foreground = useColor('foreground');
      
      return (
        <View style={{ flex: 1, backgroundColor: background }}>
          <Text style={{ color: foreground }}>Search Screen</Text>
        </View>
      );
    }
    \`\`\`

    \`\`\`typescript
    // 2. Update _layout.web.tsx
    import { Search } from 'lucide-react-native'; // Add to imports

    // ... add inside <Tabs>:
    <Tabs.Screen
      name='search'
      options={{
        title: 'Search',
        tabBarIcon: ({ color }) => (
          <Icon name={Search} size={24} color={color} />
        ),
      }}
    />
    \`\`\`

    \`\`\`typescript
    // 3. Update _layout.tsx
    // ... add inside <NativeTabs>:
    <NativeTabs.Trigger name='search' options={{ title: 'Search' }}>
      <Label>Search</Label>
      {Platform.select({
        ios: <Icon sf='magnifyingglass' />,
        android: (
          <Icon src={<VectorIcon family={MaterialIcons} name='search' />} />
        ),
      })}
    </NativeTabs.Trigger>
    \`\`\`

    ---

    # Customizing App Theme Colors

    ## Theme System Overview

    The template includes a comprehensive theming system located in \`theme/colors.ts\`. The theme supports both light and dark modes with semantic color tokens.

    ## Modifying Theme Colors

    ### Step 1: Edit \`theme/colors.ts\`

    The color configuration is split into two schemes: \`lightColors\` and \`darkColors\`.

    \`\`\`typescript
    // theme/colors.ts

    const lightColors = {
      // Base colors - Background and text
      background: '#FFFFFF',      // Main background
      foreground: '#000000',      // Main text color

      // Primary brand colors - Used for main actions, selected states
      primary: '#18181b',         // Primary buttons, active tabs
      primaryForeground: '#FFFFFF', // Text on primary elements

      // Secondary colors - Used for secondary UI elements
      secondary: '#F2F2F7',
      secondaryForeground: '#18181b',

      // Accent colors - Used for highlights and emphasis
      accent: '#F2F2F7',
      accentForeground: '#18181b',

      // Card colors - Used for card components
      card: '#F2F2F7',
      cardForeground: '#000000',

      // Muted colors - Used for disabled states and subtle elements
      muted: '#78788033',
      mutedForeground: '#71717a',

      // Destructive colors - Used for delete/error actions
      destructive: '#ef4444',
      destructiveForeground: '#FFFFFF',

      // Border colors
      border: '#C6C6C8',
      input: '#e4e4e7',
      ring: '#a1a1aa',

      // accent colors
      blue: '#007AFF',
      green: '#34C759',
      red: '#FF3B30',
      orange: '#FF9500',
      yellow: '#FFCC00',
      pink: '#FF2D92',
      purple: '#AF52DE',
      teal: '#5AC8FA',
      indigo: '#5856D6',
    };

    const darkColors = {
      // Same structure but with dark mode values
      background: '#000000',
      foreground: '#FFFFFF',
      primary: '#e4e4e7',
      primaryForeground: '#18181b',
      // ... etc
    };
    \`\`\`

    ### Step 2: Using Theme Colors in Components

    **CRITICAL: ALWAYS use the useColor hook - NEVER hardcode colors**

    \`\`\`typescript
    import { useColor } from '@/hooks/useColor';
    import { View } from '@/components/ui/view';
    import { Text } from '@/components/ui/text';

    export function MyComponent() {
      const background = useColor('background');
      const primary = useColor('primary');
      const border = useColor('border');
      const foreground = useColor('foreground');
      
      return (
        <View style={{ 
          flex: 1,
          backgroundColor: background,
          borderColor: border,
          borderWidth: 1 
        }}>
          <Text style={{ color: foreground }}>Themed text</Text>
          <Text style={{ color: primary }}>Primary colored text</Text>
        </View>
      );
    }
    \`\`\`

    ### Step 3: Adding Custom Colors

    If you need additional colors:

    \`\`\`typescript
    // 1. Add to theme/colors.ts
    const lightColors = {
      // ... existing colors
      customBrand: '#FF6B6B',
      customAccent: '#4ECDC4',
    };

    const darkColors = {
      // ... existing colors
      customBrand: '#FF8787',
      customAccent: '#6FFFE9',
    };
    \`\`\`

    \`\`\`typescript
    // 2. Use in your component
    import { useColor } from '@/hooks/useColor';

    export function CustomComponent() {
      const customBrand = useColor('customBrand');
      const customAccent = useColor('customAccent');
      
      return (
        <View style={{ backgroundColor: customBrand }}>
          <Text style={{ color: customAccent }}>Custom themed content</Text>
        </View>
      );
    }
    \`\`\`

    ## Color Usage Best Practices

    ### DO:
    - Always use \`useColor()\` hook for colors
    - Set background color on every screen
    - Add both light and dark variants when creating custom colors
    - Use semantic color names (primary, secondary, muted, etc.)
    - Test in both light and dark modes

    ### DON'T:
    - Never hardcode hex values: \`style={{ color: '#000000' }}\`
    - Never hardcode rgb values: \`style={{ backgroundColor: 'rgb(255, 0, 0)' }}\`
    - Never skip background color on screens
    - Never use deprecated APIs like \`useBottomTabBarHeight()\`
    - Never modify locked files (auth, ui components, root layout)

    ## Complete Screen Template

    **Use this template for every new screen:**

    \`\`\`typescript
    import React from 'react';
    import { StyleSheet } from 'react-native';
    import { View } from '@/components/ui/view';
    import { Text } from '@/components/ui/text';
    import { ScrollView } from '@/components/ui/scroll-view';
    import { useColor } from '@/hooks/useColor';

    export default function NewScreen() {
      // Get theme colors
      const background = useColor('background');
      const foreground = useColor('foreground');
      const primary = useColor('primary');
      const border = useColor('border');
      
      return (
        <View style={[styles.container, { backgroundColor: background }]}>
          <ScrollView>
            <Text style={{ color: foreground }}>Your content here</Text>
            {/* More components */}
          </ScrollView>
        </View>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
      },
    });
    \`\`\`

    ## Summary Checklist

    When creating or modifying screens:
    - Import \`useColor\` hook
    - Get \`background\` color using \`useColor('background')\`
    - Set \`backgroundColor\` on root View
    - Use \`useColor()\` for all other colors
    - Never hardcode hex/rgb values
    - Update both \`_layout.tsx\` and \`_layout.web.tsx\` for new tabs
    - Avoid deprecated APIs like \`useBottomTabBarHeight()\`
    - Test in both light and dark modes
  `;
}
