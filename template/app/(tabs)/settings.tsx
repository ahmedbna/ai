import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { SignOutButton } from '@/components/auth/singout';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useColor } from '@/hooks/useColor';

export default function SettingsScreen() {
  const background = useColor('background');
  const user = useQuery(api.auth.loggedInUser);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner variant='circle' />
      </View>
    );
  }

  if (user === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Not Authenticated</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 36,
        backgroundColor: background,
      }}
    >
      <ModeToggle />

      <View style={{ alignItems: 'center' }}>
        <Text variant='title'>Your User ID</Text>
        <Text variant='caption'>{user._id}</Text>
      </View>

      <SignOutButton />
    </View>
  );
}
