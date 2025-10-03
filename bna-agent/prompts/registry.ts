import { stripIndents } from '../utils/stripIndent.js';

export function componentRegistry() {
  return stripIndents`
  <component_registry>
    This registry contains all pre-built UI components available in the project.
    ALWAYS use these components instead of creating new ones or using standard React Native components directly.
    
    <component name="Button" path="@/components/ui/button">
      <import>import { Button } from '@/components/ui/button';</import>
      
      <description>
        A versatile button component with multiple variants, sizes, and interactive animations featuring
        a liquid glass effect. Includes haptic feedback on iOS and smooth spring animations.
      </description>
      
      <props>
        <prop name="children" type="string | ReactNode" required="false">
          Button content (text or custom elements)
        </prop>
        <prop name="onPress" type="() => void" required="false">
          Function called when button is pressed
        </prop>
        <prop name="variant" type="'default' | 'destructive' | 'success' | 'outline' | 'secondary' | 'ghost' | 'link'" default="'default'">
          Visual style variant of the button
        </prop>
        <prop name="size" type="'default' | 'sm' | 'lg' | 'icon'" default="'default'">
          Size of the button
        </prop>
        <prop name="disabled" type="boolean" default="false">
          Whether the button is disabled
        </prop>
        <prop name="loading" type="boolean" default="false">
          Whether the button shows loading spinner
        </prop>
        <prop name="loadingVariant" type="SpinnerVariant" default="'default'">
          Variant of the loading spinner
        </prop>
        <prop name="animation" type="boolean" default="true">
          Enable/disable press animations
        </prop>
        <prop name="haptic" type="boolean" default="true">
          Enable/disable haptic feedback (iOS only)
        </prop>
        <prop name="icon" type="ComponentType<LucideProps>" required="false">
          Icon component from lucide-react-native to display before text
        </prop>
        <prop name="style" type="ViewStyle | ViewStyle[]" required="false">
          Additional styles for button container
        </prop>
        <prop name="textStyle" type="TextStyle" required="false">
          Additional styles for button text
        </prop>
        <prop name="label" type="string" required="false">
          Alternative to children for button text
        </prop>
      </props>
      
      <variants>
        <variant name="default">Primary button with solid background</variant>
        <variant name="destructive">Red button for destructive/dangerous actions</variant>
        <variant name="success">Green button for success actions</variant>
        <variant name="outline">Button with border and transparent background</variant>
        <variant name="secondary">Secondary button with muted colors</variant>
        <variant name="ghost">Button with no background</variant>
        <variant name="link">Text-only button with underline</variant>
      </variants>
      
      <sizes>
        <size name="default">Standard size (48px height)</size>
        <size name="sm">Small size (44px height)</size>
        <size name="lg">Large size (54px height)</size>
        <size name="icon">Square button for icons only (48x48px)</size>
      </sizes>
      
      <examples>
        <example title="Basic button">
          <code>
            <Button onPress={() => console.log('Pressed')}>
              Click me
            </Button>
          </code>
        </example>
        
        <example title="Destructive button with size">
          <code>
            <Button 
              variant="destructive" 
              size="lg"
              onPress={() => handleDelete()}
            >
              Delete Account
            </Button>
          </code>
        </example>
        
        <example title="Button with icon">
          <code>
            import { User } from 'lucide-react-native';

            <Button 
              variant="outline"
              icon={User}
              onPress={() => navigateToProfile()}
            >
              View Profile
            </Button>
          </code>
        </example>
        
        <example title="Icon-only button">
          <code>
            import { Settings } from 'lucide-react-native';

            <Button 
              size="icon"
              variant="ghost"
              icon={Settings}
              onPress={() => openSettings()}
            />
          </code>
        </example>
        
        <example title="Loading button">
          <code>
            <Button 
              loading={isLoading}
              onPress={() => handleSubmit()}
            >
              Submit
            </Button>
          </code>
        </example>
      </examples>
      
      <notes>
        - Includes liquid glass animation effect by default (scales to 1.05x on press with spring animation)
        - Haptic feedback on iOS by default
        - Automatically handles disabled and loading states
        - Minimum touch target size of 44px for accessibility
        - Use 'default' variant for primary actions, 'outline' or 'secondary' for secondary actions
      </notes>
    </component>
    
    <component name="Text" path="@/components/ui/text">
      <import>import { Text } from '@/components/ui/text';</import>
      
      <description>
        A text component that wraps React Native's Text with theme-aware styling.
      </description>
      
      <props>
        <prop name="children" type="string | ReactNode" required="true">
          Text content to display
        </prop>
        <prop name="style" type="TextStyle | TextStyle[]" required="false">
          Additional text styles
        </prop>
        <prop name="..." type="TextProps" required="false">
          All standard React Native Text props (numberOfLines, ellipsizeMode, onPress, etc.)
        </prop>
      </props>
      
      <examples>
        <example title="Basic text">
          <code>
            <Text>Hello World</Text>
          </code>
        </example>
        
        <example title="Styled text">
          <code>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
              Large Bold Text
            </Text>
          </code>
        </example>
        
        <example title="Truncated text">
          <code>
            <Text 
              numberOfLines={2} 
              ellipsizeMode="tail"
              style={{ fontSize: 14 }}
            >
              This is a long text that will be truncated after two lines...
            </Text>
          </code>
        </example>
      </examples>
      
      <notes>
        - Automatically inherits theme colors
        - Supports all React Native Text props
        - Use for all text rendering in the app
      </notes>
    </component>
    
    <component name="View" path="@/components/ui/view">
      <import>import { View } from '@/components/ui/view';</import>
      
      <description>
        A container component that wraps React Native's View with transparent background by default.
      </description>
      
      <props>
        <prop name="children" type="ReactNode" required="false">
          Child components to render
        </prop>
        <prop name="style" type="ViewStyle | ViewStyle[]" required="false">
          Additional container styles
        </prop>
        <prop name="..." type="ViewProps" required="false">
          All standard React Native View props (onLayout, testID, etc.)
        </prop>
      </props>
      
      <examples>
        <example title="Basic container">
          <code>
            <View style={{ padding: 16 }}>
              <Text>Content here</Text>
            </View>
          </code>
        </example>
        
        <example title="Flex layout">
          <code>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20
            }}>
              <Text>Left</Text>
              <Text>Right</Text>
            </View>
          </code>
        </example>
        
        <example title="Card-like container">
          <code>
            <View style={{ 
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}>
              <Text>Card content</Text>
            </View>
          </code>
        </example>
      </examples>
      
      <notes>
        - Default background is transparent
        - Use for layout and grouping components
        - Supports all React Native View props
      </notes>
    </component>
    
    <component name="ScrollView" path="@/components/ui/scroll-view">
      <import>import { ScrollView } from '@/components/ui/scroll-view';</import>
      
      <description>
        A scrollable container component that wraps React Native's ScrollView with transparent background.
      </description>
      
      <props>
        <prop name="children" type="ReactNode" required="false">
          Scrollable content
        </prop>
        <prop name="style" type="ViewStyle | ViewStyle[]" required="false">
          Container styles
        </prop>
        <prop name="..." type="ScrollViewProps" required="false">
          All standard React Native ScrollView props (horizontal, showsVerticalScrollIndicator, contentContainerStyle, onScroll, etc.)
        </prop>
      </props>
      
      <examples>
        <example title="Basic vertical scroll">
          <code>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ padding: 16 }}>
                <Text>Scrollable content</Text>
                <Text>More content...</Text>
              </View>
            </ScrollView>
          </code>
        </example>
        
        <example title="Horizontal scroll">
          <code>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ height: 100 }}
            >
              <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
                <View style={{ width: 100, height: 80, backgroundColor: '#ddd' }} />
                <View style={{ width: 100, height: 80, backgroundColor: '#ddd' }} />
                <View style={{ width: 100, height: 80, backgroundColor: '#ddd' }} />
              </View>
            </ScrollView>
          </code>
        </example>
        
        <example title="ScrollView with content padding">
          <code>
            <ScrollView 
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              <Text>Content with padding</Text>
            </ScrollView>
          </code>
        </example>
      </examples>
      
      <notes>
        - Use contentContainerStyle for padding/alignment of scrollable content
        - Use style for the ScrollView container itself
        - Default background is transparent
        - For long lists, consider using FlatList instead for better performance
      </notes>
    </component>
    
    <component name="Icon" path="@/components/ui/icon">
      <import>import { Icon } from '@/components/ui/icon';</import>
      
      <description>
        A wrapper component for lucide-react-native icons with theme-aware colors.
      </description>
      
      <props>
        <prop name="name" type="ComponentType<LucideProps>" required="true">
          Icon component from lucide-react-native
        </prop>
        <prop name="size" type="number" default="24">
          Icon size in pixels
        </prop>
        <prop name="color" type="string" required="false">
          Icon color (defaults to theme color)
        </prop>
        <prop name="strokeWidth" type="number" default="2">
          Icon stroke width
        </prop>
        <prop name="..." type="LucideProps" required="false">
          All lucide-react-native icon props
        </prop>
      </props>
      
      <examples>
        <example title="Basic icon">
          <code>
            import { User } from 'lucide-react-native';

            <Icon name={User} />
          </code>
        </example>
        
        <example title="Sized and colored icon">
          <code>
            import { Settings } from 'lucide-react-native';

            <Icon 
              name={Settings} 
              size={32} 
              color="#007AFF" 
            />
          </code>
        </example>
        
        <example title="Icon with custom stroke">
          <code>
            import { Heart } from 'lucide-react-native';

            <Icon 
              name={Heart} 
              size={20}
              color="#FF0000"
              strokeWidth={2.5}
            />
          </code>
        </example>
      </examples>
      
      <common_icons>
        User, Settings, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Home, Search, Bell, Heart, 
        Star, Menu, X, Check, AlertCircle, Info, Plus, Minus, Edit, Trash, Mail, Phone, Calendar, 
        Clock, MapPin, Image, File, Download, Upload, Share, Eye, EyeOff, Lock, Unlock, Camera, 
        Video, Mic, Volume, VolumeX, Play, Pause, SkipBack, SkipForward, RefreshCw, RotateCw, 
        LogIn, LogOut, UserPlus, Users, Filter, SortAsc, SortDesc
      </common_icons>
      
      <notes>
        - Import icon components from 'lucide-react-native'
        - Icons automatically match theme colors when used in Button component
        - All lucide-react-native icons are available
      </notes>
    </component>
    
    <usage_guidelines>
      <critical_rules>
        <rule>NEVER create custom UI components - Always use components from @/components/ui/</rule>
        <rule>NEVER use web HTML elements (div, button, span, p, h1, etc.) - This is React Native, not web</rule>
        <rule>ALWAYS import icons from lucide-react-native</rule>
        <rule>ALWAYS use StyleSheet.create() or inline styles - No Tailwind, no className</rule>
        <rule>ALWAYS use proper React Native layout - Flexbox only, no CSS Grid</rule>
        <rule>Component imports must be exact - Use paths as shown in this registry</rule>
      </critical_rules>
      
      <styling_best_practices>
        <do>
          <practice>Use StyleSheet.create() for better performance</practice>
          <practice>Use inline styles for dynamic or one-off styling</practice>
          <practice>Use flexbox for layouts (flexDirection, justifyContent, alignItems)</practice>
          <practice>Use gap for spacing between flex children</practice>
          <practice>Use React Native units (all numbers are dp/points)</practice>
        </do>
        
        <dont>
          <practice>NEVER Use HTML elements (div, button, span, p, h1, etc.)</practice>
          <practice>NEVER Use className or Tailwind classes</practice>
          <practice>NEVER Use CSS strings or CSS-in-JS libraries</practice>
          <practice>NEVER Use web-specific properties (display: grid, position: sticky, etc.)</practice>
        </dont>
      </styling_best_practices>
      
      <example_structure>
        <code>
          import { View } from '@/components/ui/view';
          import { ScrollView } from '@/components/ui/scroll-view';
          import { Text } from '@/components/ui/text';
          import { Button } from '@/components/ui/button';
          import { ChevronRight, Settings } from 'lucide-react-native';
          import { StyleSheet } from 'react-native';

          export default function MyScreen() {
            return (
              <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                  <Text style={styles.title}>Welcome</Text>
                  <Text style={styles.description}>This is a description</Text>
                  
                  <Button 
                    variant="default"
                    size="lg"
                    icon={ChevronRight}
                    onPress={() => console.log('Primary')}
                  >
                    Get Started
                  </Button>
                  
                  <Button 
                    variant="outline"
                    icon={Settings}
                    onPress={() => console.log('Secondary')}
                  >
                    Settings
                  </Button>
                </View>
              </ScrollView>
            );
          }

          const styles = StyleSheet.create({
            container: {
              padding: 16,
              gap: 12,
            },
            title: {
              fontSize: 28,
              fontWeight: 'bold',
            },
            description: {
              fontSize: 16,
              color: '#666',
            },
          });
        </code>
      </example_structure>
      
      <common_patterns>
        <pattern name="Form Layout">
          <code>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ padding: 16, gap: 16 }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                    Email
                  </Text>
                  {/* TextInput component here */}
                </View>
                
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                    Password
                  </Text>
                  {/* TextInput component here */}
                </View>
                
                <Button 
                  style={{ marginTop: 8 }}
                  onPress={() => handleSubmit()}
                >
                  Sign In
                </Button>
              </View>
            </ScrollView>
          </code>
        </pattern>
        
        <pattern name="List Item">
          <code>
            import { User, ChevronRight } from 'lucide-react-native';

            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0'
            }}>
              <Icon name={User} size={24} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>
                  John Doe
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  john@example.com
                </Text>
              </View>
              <Icon name={ChevronRight} size={20} color="#999" />
            </View>
          </code>
        </pattern>
        
        <pattern name="Card">
          <code>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                Card Title
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
                Card description goes here
              </Text>
              <Button variant="outline" size="sm">
                Action
              </Button>
            </View>
          </code>
        </pattern>
      </common_patterns>
    </usage_guidelines>
  </component_registry>
  `;
}
