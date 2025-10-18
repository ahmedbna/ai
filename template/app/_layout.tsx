import { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { View } from '@/components/ui/view';
import { Spinner } from '@/components/ui/spinner';
import { Auth } from '@/components/auth/auth';
import { ThemeProvider } from '@/theme/theme-provider';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/theme/colors';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light';

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === 'dark' ? Colors.dark.background : Colors.light.background
    );
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ConvexAuthProvider
          client={convex}
          storage={
            Platform.OS === 'android' || Platform.OS === 'ios'
              ? secureStorage
              : undefined
          }
        >
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
        </ConvexAuthProvider>

        <StatusBar style='auto' />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
