import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';

export default function HomeScreen() {
  const background = useColor('background');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: background,
      }}
    >
      <Text
        variant='heading'
        style={{
          textAlign: 'center',
        }}
      >
        Built with ❤️ by BNA
      </Text>
    </View>
  );
}
