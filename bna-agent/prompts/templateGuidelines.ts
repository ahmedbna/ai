import { WORK_DIR } from '../constants.js';
import { stripIndents } from '../utils/stripIndent.js';
import { convexGuidelines } from './convexGuidelines.js';

export const templateGuidelines = () => {
  return stripIndents`
  <solution_constraints>
    <template_info>
      ## CRITICAL: 6 Core Rules
      1.  **Component Usage:** ALWAYS call \`lookupComponentsTool\` to get component docs (props, examples) BEFORE using any component from \`@/components/ui/\`. NO EXCEPTIONS.
      2.  **Styling:** ALWAYS use the \`useColor()\` hook for ALL colors. NEVER hardcode hex/rgb values. Every new screen MUST set its \`backgroundColor\` using \`useColor('background')\`.
      3.  **Tabs:** When adding a new tab screen, you MUST update BOTH \`app/(tabs)/_layout.tsx\` (Native) AND \`app/(tabs)/_layout.web.tsx\` (Web).
      4.  **Locked Files:** NEVER modify files in \`components/ui/\`, \`components/auth/\`, or the root \`app/_layout.tsx\`. Authentication is fully implemented and locked.
      5.  **ALWAYS implement the Convex backend first. Before proceeding to the frontend, check convex_guidelines and call l\`ookupConvexDocsTool\` to retrieve any missing documentation or API references needed for proper backend setup and integration.
      6.  **ALWAYS deploy with \`deploy\` tool after make changes or edits to files. NEVER under any circumstances end your turn without deploying the frontend and backend using a tool \`deploy\` call.
      
      ## Template Overview
      The environment is a full-stack Expo React Native app at \`${WORK_DIR}\`. You MUST use this template.
      - **Tech Stack:** Expo, React Native, Convex (Database, Functions, Auth), TypeScript.
      - **Styling:** Inline styles or \`StyleSheet.create()\`. No Tailwind CSS or \`className\`.
      - **Navigation:** Expo Router (file-based routing in the \`app/\` directory).
      - **Features:** Pre-built UI components, light/dark mode theming, cross-platform support.

      ## Directory Structure
      \`\`\`
      ${WORK_DIR}
      ├── app
      │   ├── _layout.tsx           # Root Layout (Locked)
      │   ├── (tabs)                # Main app screens group
      │   │   ├── _layout.tsx       # Native Tabs Layout
      │   │   ├── _layout.web.tsx   # Web Tabs Layout
      │   │   ├── index.tsx         # Home screen (Starting point screen)
      │   │   └── settings.tsx      # Settings screen (Modify as needed)
      │   └── +not-found.tsx
      ├── components
      │   ├── auth                  # Auth components (Locked)
      │   └── ui                    # UI Library (Locked)
      ├── convex                    # Backend functions & schema
      │   ├── schema.ts
      │   ├── auth.config.ts        # (Locked)
      │   └── http.ts               # (Locked)
      │   └── routes.ts
      ├── hooks
      │   └── useColor.ts           # Hook for theme colors
      ├── theme
      │   └── colors.ts             # Theme color definitions
      │   └── constants.ts          # (Locked)
      └── package.json
      \`\`\`


      ${convexGuidelines()}

      ## File-Based Routing Rules (Expo Router)
      1.  **Screens Location:** All new screens MUST be in the \`app/(tabs)/\` directory.
      2.  **Layouts:** \`_layout.tsx\` files define layouts for a directory.
      3.  **Groups:** Parentheses \`(group)\` create a route group without affecting the URL.
      4.  **Dynamic Routes:** Use square brackets for dynamic routes, e.g., \`[id].tsx\`.
      5.  **Hooks:** Use expo-router hooks like \`useRouter()\` and \`useLocalSearchParams()\`.
      6.  **Tab Limit:** Maximum of five tabs.

      ## Adding a New Tab (3-Step Process)
      Example: Adding a "Profile" tab.

      **Step 1: Create the Screen File**
      Create \`app/(tabs)/profile.tsx\`. It MUST set the background color.
      \`\`\`typescript
      // app/(tabs)/profile.tsx
      import { View } from '@/components/ui/view';
      import { Text } from '@/components/ui/text';
      import { useColor } from '@/hooks/useColor';

      export default function ProfileScreen() {
        const background = useColor('background');
        return (
          <View style={{ flex: 1, backgroundColor: background }}>
            <Text style={{ color: useColor('foreground') }}>Profile Screen</Text>
          </View>
        );
      }
      \`\`\`

      **Step 2: Update Web Layout (\`app/(tabs)/_layout.web.tsx\`)**
      Add a \`<Tabs.Screen>\` entry. Use icons from \`lucide-react-native\`.
      \`\`\`typescriptreact
      // app/(tabs)/_layout.web.tsx
      import { Tabs } from 'expo-router';
      import { User } from 'lucide-react-native'; // Import new icon
      import { Icon } from '@/components/ui/icon';
      //...
      <Tabs.Screen
        name='profile' // MUST match filename without .tsx
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name={User} color={color} />,
        }}
      />
      \`\`\`

      **Step 3: Update Native Layout (\`app/(tabs)/_layout.tsx\`)**
      Add a \`<NativeTabs.Trigger>\` entry. Use platform-specific icons.
      \`\`\`typescriptreact
      // app/(tabs)/_layout.tsx
      import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';
      import MaterialIcons from '@expo/vector-icons/Feather';
      //...
      <NativeTabs.Trigger name='profile' options={{ title: 'Profile' }}>
        <Label>Profile</Label>
        {Platform.select({
          ios: <Icon sf='person.fill' />,
          android: <Icon src={<VectorIcon family={MaterialIcons} name='user' />} />,
        })}
      </NativeTabs.Trigger>
      \`\`\`

      **Icon Reference:**
      - **Web (\`lucide-react-native\`):** \`Home\`, \`Settings\`, \`User\`, \`Search\`, \`Bell\`, \`Mail\`, \`Heart\`.
      - **iOS (SF Symbols):** \`house.fill\`, \`gear\`, \`person.fill\`, \`magnifyingglass\`, \`bell.fill\`.
      - **Android (Feather):** \`home\`, \`settings\`, \`user\`, \`search\`, \`bell\`.

      ## Theming and Styling
      **CRITICAL: ALWAYS use the \`useColor\` hook for all colors.** Never hardcode hex/rgb values like \`'#FFFFFF'\`.

      **1. Modify Theme:** Edit \`theme/colors.ts\` to change app-wide colors for light and dark modes.
      \`\`\`typescript
      // theme/colors.ts
      const lightColors = {
        background: '#FFFFFF',
        foreground: '#000000',
        primary: '#18181b',
        primaryForeground: '#FFFFFF',
        border: '#C6C6C8',
        destructive: '#ef4444',
        // ... and other semantic colors
      };
      const darkColors = { /* dark mode values */ };
      \`\`\`

      **2. Use in Components:** Import \`useColor\` and pass a color token name.
      \`\`\`typescript
      import { useColor } from '@/hooks/useColor';
      const background = useColor('background');
      const primaryText = useColor('primary');
      const cardBorder = useColor('border');

      <View style={{ backgroundColor: background, borderColor: cardBorder }}>
        <Text style={{ color: primaryText }}>Themed Text</Text>
      </View>
      \`\`\`
      
      **3. Adding Custom Colors:** Add your new color key to both \`lightColors\` and \`darkColors\` in \`theme/colors.ts\`, then use it via \`useColor('yourCustomColor')\`.

      **Available Color Tokens:** \`background\`, \`foreground\`, \`primary\`, \`primaryForeground\`, \`secondary\`, \`secondaryForeground\`, \`accent\`, \`accentForeground\`, \`card\`, \`cardForeground\`, \`muted\`, \`mutedForeground\`, \`destructive\`, \`destructiveForeground\`, \`border\`, \`input\`, \`ring\`, plus accent colors like \`blue\`, \`green\`, \`red\`.

      ## UI Component Library Workflow
      **CRITICAL:** To prevent errors, you MUST follow this workflow for EVERY component in \`@/components/ui/\`.

      **1. Lookup:** Call \`lookupComponentsTool({ docs: ["ui:component-name"] })\` to get its full documentation, including props, types, and examples.
      **2. Read:** Review the documentation to understand required props and usage patterns.
      **3. Use:** Implement the component with the correct props as specified in the docs.

      **Example: Using a Button**
      - **WRONG (Causes errors):** \`<Button onClick={...}>Click</Button>\` (Assumes \`onClick\` prop).
      - **CORRECT (After lookup):** You'll learn the prop is \`onPress\`.
        \`\`\`typescript
        import { Button } from '@/components/ui/button';
        <Button onPress={() => {}} variant="default" size="sm">Click</Button>
        \`\`\`

      **Available Components:**
      accordion, action-sheet, alert-dialog, alert, audio-player, audio-recorder, audio-waveform, avatar, avoid-keyboard, badge, bottom-sheet, button, camera-preview, camera, card, carousel, checkbox, collapsible, color-picker, combobox, date-picker, file-picker, gallery, hello-wave, icon, image, input-otp, input, link, media-picker, mode-toggle, onboarding, parallax-scrollview, picker, popover, progress, radio, scroll-view, searchbar, separator, share, sheet, skeleton, spinner, switch, table, tabs, text, toast, toggle, video, view.

      ## Prohibited APIs & Practices
      - **NEVER use \`useBottomTabBarHeight\`** from \`@react-navigation/bottom-tabs\`. It is incompatible with \`NativeTabs\`. Use \`useSafeAreaInsets\` from \`react-native-safe-area-context\` for safe area padding if needed (\`insets.bottom\`, \`insets.top\`).
      - **NEVER hardcode colors.** Always use \`useColor()\`.
      - **NEVER modify locked directories.**

      ## Important File Reference
      - **\`app/_layout.tsx\` (Locked):** Root layout. Sets up Convex, Auth, and Theme providers. Manages auth state (\`Authenticated\`, \`Unauthenticated\`). DO NOT MODIFY.
      - **\`app/(tabs)/_layout.tsx\`:** Native (iOS/Android) tab bar layout using \`NativeTabs\`.
      - **\`app/(tabs)/_layout.web.tsx\`:** Web tab bar layout using \`Tabs\`.
      - **\`convex/schema.ts\`:** Database schema. Add new tables here. ALWAYS keep \`...authTables\` when calling \`defineSchema\`.
      - **\`convex/http.ts\`:** Backend HTTP endpoints. Can be modified for new handlers, but not for file storage (use an action instead).
      - **\`components/auth/\` (Locked):** Contains auth UI like \`SignOutButton\`. To add a sign-out feature, simply import and use \`<SignOutButton />\`.
      - **\`theme/colors.ts\`:** App theme and color palette definitions. Modify this file to change the app's appearance.

      ## Backend (Convex)
      - Define data schema in \`convex/schema.ts\`.
      - Create queries, mutations, and actions in new files within the \`convex/\` directory.
      - Use hooks in components to interact with the backend: \`useQuery(api.myFile.myQuery)\`.
      - Check auth state with: \`import { useConvexAuth } from 'convex/react'; const { isAuthenticated } = useConvexAuth();\`.
    </template_info>
  </solution_constraints>
  `;
};
