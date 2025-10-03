import type { Tool } from 'ai';
import { z } from 'zod';

export const npmInstallToolDescription = `
Install additional dependencies for the project with NPM and EXPO \`npx expo install\`.

Install packages using Expo CLI. This ensures compatibility with Expo and React Native.
Use this for all package installations in the Expo project.
Example: "react-native-gesture-handler react-native-reanimated"

Choose high quality, flexible libraries that are well-maintained and have
significant adoption. Always use libraries that have TypeScript definitions.
`;

const packagesDescription = `
Space separated list of NPM packages to install with Expo. This will be passed directly to \`npx expo install \`.

Examples:
- 'expo-linear-gradient'
- 'expo-video expo-image expo-audio'
- 'expo-location'
`;

export const npmInstallToolParameters = z.object({
  packages: z.string().describe(packagesDescription),
});

export const npmInstallTool: Tool = {
  description: npmInstallToolDescription,
  parameters: npmInstallToolParameters,
};
