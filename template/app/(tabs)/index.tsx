import { ModeToggle } from '@/components/ui/mode-toggle';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function HomeScreen() {
  const bottom = useBottomTabBarHeight();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: bottom, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          paddingTop: 64,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text variant='heading'>BNA UI</Text>

          <ModeToggle />
        </View>
      </View>

      <View
        style={{
          paddingVertical: 40,
          alignItems: 'center',
        }}
      >
        <Text variant='title'>Built with ❤️ by BNA</Text>
      </View>
    </ScrollView>
  );
}
