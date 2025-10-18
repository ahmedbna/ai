import MaterialIcons from '@expo/vector-icons/Feather';
import {
  Badge,
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

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
    </NativeTabs>
  );
}
