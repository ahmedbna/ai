export const SUGGESTIONS = [
  {
    title: 'Slack clone',
    prompt: `Build an app similar to Slack with the following features:

- Has a channels panel on the left with a button to create new channels
- Has a message pane on the right and a message posting box at the bottom
- Each message has a name and avatar next to it for the author
- Has an "edit profile" tab for uploading a profile photo to Convex storage and changing your name
- Only the messages are scrollable, with message box and channel selector fixed like the header
- Automatically scrolls to the bottom when new messages are sent
- Includes a search bar at the top that queries all messages`,
  },
  {
    title: 'Instagram clone',
    prompt: `Build an app similar to Instagram with a global shared image stream that has these features:

- Has a drag and drop box for uploading images to Convex storage
- Has a "Stream" tab for viewing the global image stream
- Has a "My Photos" tab for viewing and deleting your own images
- Allows liking images in the "Stream" tab
- Shows like count for each image`,
  },
  {
    title: 'Splitwise clone',
    prompt: `Build a group shared expenses app that has the following features:

- Has users, groups, expenses, payments, and reimbursements
- Represents members in a group via a table rather than an array
- Users can create groups and invite other users to join
- Group members can add expenses to a group, which get shared among all members in the group
- Shows a list of members in the group and a list of expenses along with who paid them
- Shows how much every member has been paid and reimbursed
- Each member should be able to record a payment to another member, which adds to how much they have paid and adds to how much the recipient has been reimbursed
- Members should record payments so that every member in the group has the same net balance`,
  },
  {
    title: 'Notion clone',
    prompt: `Make a collaborative text editor like Notion with these features:
- Real-time collaboration where multiple users can edit the same document
- Presence functionality for each document with a facepile
- Document Organization:
- Private documents (only visible to the creator)
- Public documents (visible to all users)
- Simple sidebar navigation between documents
- Full text search over document titles
- Interface:
- Clean, minimal design with lots of white space and a neutral color palette (soft grays and whites)
- Focus on readable text and minimal distractions`,
  },
];

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;

export const PREWARM_PATHS = [
  `${WORK_DIR}/package.json`,
  `${WORK_DIR}/convex/schema.ts`,
  `${WORK_DIR}/app/(tabs)/_layout.tsx`,
];

// A list of files that we block the LLM from modifying
export const EXCLUDED_FILE_PATHS = [
  'app/_layout.tsx',
  'app/+not-found.tsx',

  'app.json',
  'tsconfig.json',

  'convex/http.ts',
  'convex/auth.ts',
  'convex/auth.config.ts',

  'eslint.config.js',
  'expo-env.d.ts',

  // theme
  'theme/globals.ts',
  'theme/theme-provider.tsx',

  // hooks
  'hooks/useBottomTabOverflow.ts',
  'hooks/useColor.ts',
  'hooks/useColorScheme.ts',
  'hooks/useColorScheme.ts',
  'hooks/useKeyboardHeight.ts',
  'hooks/useModeToggle.ts',

  // auth components
  'components/auth/apple.tsx',
  'components/auth/auth.tsx',
  'components/auth/email-otp.tsx',
  'components/auth/google.tsx',
  'components/auth/password.tsx',
  'components/auth/singout.tsx',

  // UI components
  'components/ui/accordion.tsx',
  'components/ui/action-sheet.tsx',
  'components/ui/alert-dialog.tsx',
  'components/ui/alert.tsx',
  'components/ui/audio-player.tsx',
  'components/ui/audio-recorder.tsx',
  'components/ui/audio-waveform.tsx',
  'components/ui/avatar.tsx',
  'components/ui/avoid-keyboard.tsx',
  'components/ui/badge.tsx',
  'components/ui/bottom-sheet.tsx',
  'components/ui/button.tsx',
  'components/ui/camera-preview.tsx',
  'components/ui/camera.tsx',
  'components/ui/card.tsx',
  'components/ui/carousel.tsx',
  'components/ui/checkbox.tsx',
  'components/ui/collapsible.tsx',
  'components/ui/color-picker.tsx',
  'components/ui/combobox.tsx',
  'components/ui/date-picker.tsx',
  'components/ui/file-picker.tsx',
  'components/ui/gallery.tsx',
  'components/ui/hello-wave.tsx',
  'components/ui/icon.tsx',
  'components/ui/image.tsx',
  'components/ui/input-otp.tsx',
  'components/ui/input.tsx',
  'components/ui/link.tsx',
  'components/ui/media-picker.tsx',
  'components/ui/mode-toggle.tsx',
  'components/ui/onboarding.tsx',
  'components/ui/parallax-scrollview.tsx',
  'components/ui/picker.tsx',
  'components/ui/popover.tsx',
  'components/ui/progress.tsx',
  'components/ui/radio.tsx',
  'components/ui/scroll-view.tsx',
  'components/ui/searchbar.tsx',
  'components/ui/separator.tsx',
  'components/ui/share.tsx',
  'components/ui/sheet.tsx',
  'components/ui/skeleton.tsx',
  'components/ui/spinner.tsx',
  'components/ui/switch.tsx',
  'components/ui/table.tsx',
  'components/ui/tabs.tsx',
  'components/ui/text.tsx',
  'components/ui/toast.tsx',
  'components/ui/toggle.tsx',
  'components/ui/video.tsx',
  'components/ui/view.tsx',
];
