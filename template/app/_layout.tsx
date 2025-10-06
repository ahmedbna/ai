import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/theme/theme-provider';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { View } from '@/components/ui/view';
import { Spinner } from '@/components/ui/spinner';
import { Auth } from '@/components/auth/auth';
import * as SecureStore from 'expo-secure-store';
import 'react-native-reanimated';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
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
