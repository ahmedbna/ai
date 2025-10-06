// Complete UI component documentation for AI builder

interface PropDefinition {
  type: string;
  required?: boolean;
  default?: any;
  description: string;
}

interface ComponentExample {
  name: string;
  code: string;
}

interface ComponentDoc {
  description: string;
  importPath: string;
  exports: string[];
  props: Record<string, Record<string, PropDefinition>>;
  examples: ComponentExample[];
}

// Extended from your provided JSON docs
export const componentDocs: Record<string, ComponentDoc> = {
  Accordion: {
    description: 'Collapsible content panels with single or multiple expand modes',
    importPath: '@/components/ui/accordion',
    exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
    props: {
      Accordion: {
        type: {
          type: "'single' | 'multiple'",
          required: true,
          description: 'Controls whether single or multiple items can be open',
        },
        collapsible: {
          type: 'boolean',
          default: false,
          description: "For 'single' type, allows closing the open item",
        },
        defaultValue: {
          type: 'string | string[]',
          description: 'Default open item(s) - string for single, array for multiple',
        },
        value: {
          type: 'string | string[]',
          description: 'Controlled value for open item(s)',
        },
        onValueChange: {
          type: '(value: string | string[]) => void',
          description: 'Callback when accordion state changes',
        },
      },
      AccordionItem: {
        value: {
          type: 'string',
          required: true,
          description: 'Unique identifier for this accordion item',
        },
      },
      AccordionTrigger: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Trigger content (typically Text)',
        },
      },
      AccordionContent: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Collapsible content',
        },
        style: {
          type: 'object',
          description: 'Custom styles for content container',
        },
      },
    },
    examples: [
      {
        name: 'Basic Single',
        code: `<Accordion type='single' collapsible defaultValue='item-1'>
  <AccordionItem value='item-1'>
    <AccordionTrigger>Question?</AccordionTrigger>
    <AccordionContent>
      <Text>Answer</Text>
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
      {
        name: 'Multiple Open',
        code: `<Accordion type='multiple' defaultValue={['item-1', 'item-2']}>
  <AccordionItem value='item-1'>
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent><Text>Content 1</Text></AccordionContent>
  </AccordionItem>
  <AccordionItem value='item-2'>
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent><Text>Content 2</Text></AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
    ],
  },

  ActionSheet: {
    description:
      'Native action sheet for iOS, custom modal implementation for Android. Displays a list of options that slide up from the bottom of the screen.',
    importPath: '@/components/ui/action-sheet',
    exports: ['ActionSheet', 'useActionSheet', 'ActionSheetOption'],
    props: {
      ActionSheet: {
        visible: {
          type: 'boolean',
          required: true,
          description: 'Controls visibility of the action sheet',
        },
        onClose: {
          type: '() => void',
          required: true,
          description: 'Callback when action sheet is dismissed',
        },
        title: {
          type: 'string',
          description: 'Optional title displayed at top of sheet',
        },
        message: {
          type: 'string',
          description: 'Optional descriptive message below title',
        },
        options: {
          type: 'ActionSheetOption[]',
          required: true,
          description: 'Array of action options to display',
        },
        cancelButtonTitle: {
          type: 'string',
          default: "'Cancel'",
          description: 'Text for cancel button',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for the sheet container',
        },
      },
      ActionSheetOption: {
        title: {
          type: 'string',
          required: true,
          description: 'Display text for the option',
        },
        onPress: {
          type: '() => void',
          required: true,
          description: 'Callback when option is selected',
        },
        destructive: {
          type: 'boolean',
          default: false,
          description: 'Styles option as destructive (red color)',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disables the option',
        },
        icon: {
          type: 'React.ReactNode',
          description: 'Optional icon displayed before title',
        },
      },
    },
    examples: [
      {
        name: 'Basic Usage',
        code: `const [visible, setVisible] = useState(false);

<Button onPress={() => setVisible(true)}>Show Actions</Button>
<ActionSheet
  visible={visible}
  onClose={() => setVisible(false)}
  title='Choose an action'
  message='Select one of the options below'
  options={[
    { title: 'Edit', onPress: () => console.log('Edit') },
    { title: 'Share', onPress: () => console.log('Share') },
    { title: 'Delete', onPress: () => console.log('Delete'), destructive: true },
  ]}
/>`,
      },
      {
        name: 'With Icons',
        code: `<ActionSheet
  visible={visible}
  onClose={() => setVisible(false)}
  title='File Actions'
  options={[
    {
      title: 'Edit',
      onPress: () => console.log('Edit'),
      icon: <Icon name={Edit} size={20} />,
    },
    {
      title: 'Share',
      onPress: () => console.log('Share'),
      icon: <Icon name={Share} size={20} />,
    },
    {
      title: 'Delete',
      onPress: () => console.log('Delete'),
      destructive: true,
      icon: <Icon name={Trash2} size={20} />,
    },
  ]}
/>`,
      },
    ],
  },

  Alert: {
    description:
      'Dual-purpose alert system: visual inline alerts (Alert/AlertTitle/AlertDescription) and native system alerts (showNativeAlert, showSuccessAlert, etc.)',
    importPath: '@/components/ui/alert',
    exports: [
      'Alert',
      'AlertTitle',
      'AlertDescription',
      'showNativeAlert',
      'showSuccessAlert',
      'showErrorAlert',
      'showConfirmAlert',
      'createTwoButtonAlert',
      'createThreeButtonAlert',
      'NativeAlert',
    ],
    props: {
      Alert: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Alert content (typically AlertTitle and AlertDescription)',
        },
        variant: {
          type: "'default' | 'destructive'",
          default: "'default'",
          description: 'Visual style variant',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for alert container',
        },
      },
      AlertTitle: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Title text',
        },
        style: {
          type: 'TextStyle',
          description: 'Custom text styles',
        },
      },
      AlertDescription: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Description text',
        },
        style: {
          type: 'TextStyle',
          description: 'Custom text styles',
        },
      },
      NativeAlertOptions: {
        title: {
          type: 'string',
          required: true,
          description: 'Alert dialog title',
        },
        message: {
          type: 'string',
          description: 'Alert dialog message/description',
        },
        buttons: {
          type: 'AlertButton[]',
          description: 'Array of button configurations',
        },
        cancelable: {
          type: 'boolean',
          default: true,
          description: 'Whether alert can be dismissed by tapping outside (Android)',
        },
      },
      AlertButton: {
        text: {
          type: 'string',
          required: true,
          description: 'Button label text',
        },
        onPress: {
          type: '() => void',
          description: 'Callback when button is pressed',
        },
        style: {
          type: "'default' | 'cancel' | 'destructive'",
          description: 'Button style (iOS only)',
        },
      },
    },
    examples: [
      {
        name: 'Visual Alert - Default',
        code: `<Alert>
  <AlertTitle>Visual Alert</AlertTitle>
  <AlertDescription>
    This is a default visual alert that appears inline with your content.
  </AlertDescription>
</Alert>`,
      },
      {
        name: 'Visual Alert - Destructive',
        code: `<Alert variant='destructive'>
  <AlertTitle>Error Occurred</AlertTitle>
  <AlertDescription>
    Something went wrong. Please try again.
  </AlertDescription>
</Alert>`,
      },
      {
        name: 'Success Alert',
        code: `showSuccessAlert(
  'Success!',
  'Your action was completed successfully.',
  () => console.log('OK pressed')
);`,
      },
      {
        name: 'Error Alert',
        code: `showErrorAlert(
  'Error',
  'Something went wrong. Please try again.',
  () => console.log('Error acknowledged')
);`,
      },
      {
        name: 'Confirm Alert',
        code: `showConfirmAlert(
  'Confirm Action',
  'Are you sure you want to proceed?',
  () => console.log('Confirmed'),
  () => console.log('Cancelled')
);`,
      },
    ],
  },

  AudioPlayer: {
    description: 'Full-featured audio player with waveform visualization, progress tracking, and playback controls',
    importPath: '@/components/ui/audio-player',
    exports: ['AudioPlayer'],
    props: {
      AudioPlayer: {
        source: {
          type: 'AudioSource',
          required: true,
          description: 'Audio source - { uri: string } for remote files',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for the player container',
        },
        showControls: {
          type: 'boolean',
          default: true,
          description: 'Show play/pause and control buttons',
        },
        showWaveform: {
          type: 'boolean',
          default: true,
          description: 'Display animated waveform visualization',
        },
        showTimer: {
          type: 'boolean',
          default: true,
          description: 'Show current time / duration timer',
        },
        showProgressBar: {
          type: 'boolean',
          default: true,
          description: 'Display seekable progress bar',
        },
        autoPlay: {
          type: 'boolean',
          default: false,
          description: 'Start playing automatically when loaded',
        },
        onPlaybackStatusUpdate: {
          type: '(status: any) => void',
          description: 'Callback for playback status changes',
        },
      },
    },
    examples: [
      {
        name: 'Basic Player',
        code: `<AudioPlayer
  source={{ uri: 'https://example.com/audio.mp3' }}
  showControls={true}
  showWaveform={true}
  showTimer={true}
  showProgressBar={true}
/>`,
      },
    ],
  },

  AudioRecorder: {
    description:
      'Audio recording component with real-time waveform visualization, playback preview, and save functionality',
    importPath: '@/components/ui/audio-recorder',
    exports: ['AudioRecorder'],
    props: {
      AudioRecorder: {
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for recorder container',
        },
        quality: {
          type: "'high' | 'low'",
          default: 'high',
          description: 'Recording quality preset',
        },
        showWaveform: {
          type: 'boolean',
          default: true,
          description: 'Display real-time waveform during recording',
        },
        showTimer: {
          type: 'boolean',
          default: true,
          description: 'Show recording duration timer',
        },
        maxDuration: {
          type: 'number',
          description: 'Maximum recording duration in seconds',
        },
        onRecordingComplete: {
          type: '(uri: string) => void',
          description: 'Callback when recording is saved with file URI',
        },
        onRecordingStart: {
          type: '() => void',
          description: 'Callback when recording starts',
        },
        onRecordingStop: {
          type: '() => void',
          description: 'Callback when recording stops',
        },
        customRecordingOptions: {
          type: 'RecordingOptions',
          description: 'Custom recording options (overrides quality preset)',
        },
      },
    },
    examples: [
      {
        name: 'Basic Recorder',
        code: `<AudioRecorder
  quality='high'
  showWaveform={true}
  showTimer={true}
  maxDuration={300}
  onRecordingComplete={(uri) => {
    console.log('Recording saved:', uri);
  }}
/>`,
      },
      {
        name: 'Voice Notes',
        code: `<AudioRecorder
  quality='low'
  showWaveform={true}
  showTimer={true}
  maxDuration={120}
  onRecordingComplete={(uri) => {
    // Add to voice notes list
  }}
/>`,
      },
    ],
  },

  AudioWaveform: {
    description: 'Customizable audio waveform visualization with progress tracking, seeking, and real-time animation',
    importPath: '@/components/ui/audio-waveform',
    exports: ['AudioWaveform'],
    props: {
      AudioWaveform: {
        data: {
          type: 'number[]',
          description: 'Array of amplitude values (0-1). Auto-generated if not provided',
        },
        isPlaying: {
          type: 'boolean',
          default: false,
          description: 'Whether audio is currently playing (triggers animation)',
        },
        progress: {
          type: 'number',
          default: 0,
          description: 'Playback progress percentage (0-100)',
        },
        onSeek: {
          type: '(position: number) => void',
          description: 'Callback when user seeks to new position (percentage)',
        },
        onSeekStart: {
          type: '() => void',
          description: 'Callback when seeking gesture starts',
        },
        onSeekEnd: {
          type: '() => void',
          description: 'Callback when seeking gesture ends',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for waveform container',
        },
        height: {
          type: 'number',
          default: 60,
          description: 'Height of waveform in pixels',
        },
        barCount: {
          type: 'number',
          default: 50,
          description: 'Number of bars in waveform',
        },
        barWidth: {
          type: 'number',
          default: 3,
          description: 'Width of each bar in pixels',
        },
        barGap: {
          type: 'number',
          default: 2,
          description: 'Gap between bars in pixels',
        },
        activeColor: {
          type: 'string',
          description: 'Color for active/played portion',
        },
        inactiveColor: {
          type: 'string',
          description: 'Color for inactive/unplayed portion',
        },
        animated: {
          type: 'boolean',
          default: true,
          description: 'Enable animation effects',
        },
        showProgress: {
          type: 'boolean',
          default: false,
          description: 'Show progress indicator line',
        },
        interactive: {
          type: 'boolean',
          default: false,
          description: 'Enable touch/pan gestures for seeking',
        },
      },
    },
    examples: [
      {
        name: 'Basic Waveform',
        code: `const [isPlaying, setIsPlaying] = useState(false);

<AudioWaveform
  isPlaying={isPlaying}
  height={60}
  barCount={40}
  activeColor='#007AFF'
  inactiveColor='#E5E5E7'
/>`,
      },
      {
        name: 'Interactive with Progress',
        code: `const [progress, setProgress] = useState(0);

<AudioWaveform
  isPlaying={true}
  progress={progress}
  showProgress={true}
  interactive={true}
  onSeek={(pos) => setProgress(pos)}
  height={80}
  barCount={50}
/>`,
      },
    ],
  },

  Avatar: {
    description: 'User profile images with fallback text support',
    importPath: '@/components/ui/avatar',
    exports: ['Avatar', 'AvatarImage', 'AvatarFallback'],
    props: {
      Avatar: {
        size: {
          type: 'number',
          default: 40,
          description: 'Width and height in pixels (creates circle)',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles (borders, shadows, etc.)',
        },
      },
      AvatarImage: {
        source: {
          type: 'ImageSource',
          required: true,
          description: 'Image source (uri or require())',
        },
        style: {
          type: "ImageProps['style']",
          description: 'Custom image styles',
        },
      },
      AvatarFallback: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Fallback content (typically initials)',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom container styles',
        },
        textStyle: {
          type: 'TextStyle',
          description: 'Custom text styles',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `<Avatar>
  <AvatarImage source={{ uri: 'https://example.com/user.jpg' }} />
  <AvatarFallback>AB</AvatarFallback>
</Avatar>`,
      },
      {
        name: 'Avatar Group',
        code: `<View style={{ flexDirection: 'row' }}>
  <Avatar size={48} style={{ borderWidth: 2, borderColor: 'white', zIndex: 3 }}>
    <AvatarImage source={{ uri: 'url1' }} />
  </Avatar>
  <Avatar size={48} style={{ borderWidth: 2, borderColor: 'white', marginLeft: -12, zIndex: 2 }}>
    <AvatarImage source={{ uri: 'url2' }} />
  </Avatar>
  <Avatar size={48} style={{ borderWidth: 2, borderColor: 'white', marginLeft: -12, zIndex: 1 }}>
    <AvatarFallback>+3</AvatarFallback>
  </Avatar>
</View>`,
      },
    ],
  },

  AvoidKeyboard: {
    description: 'Smoothly animates content to avoid the keyboard using react-native-reanimated',
    importPath: '@/components/ui/avoid-keyboard',
    exports: ['AvoidKeyboard'],
    props: {
      AvoidKeyboard: {
        offset: {
          type: 'number',
          default: 0,
          description: 'Additional pixels of space above the keyboard',
        },
        duration: {
          type: 'number',
          default: 0,
          description: 'Extra milliseconds added to keyboard animation duration',
        },
      },
    },
    examples: [
      {
        name: 'Basic Usage',
        code: `<View style={{ flex: 1 }}>
  <Input placeholder="Type here..." />
  <AvoidKeyboard offset={40} />
</View>`,
      },
    ],
  },

  Badge: {
    description: 'Small status labels and tags with multiple variants',
    importPath: '@/components/ui/badge',
    exports: ['Badge'],
    props: {
      Badge: {
        variant: {
          type: "'default' | 'secondary' | 'destructive' | 'outline' | 'success'",
          default: 'default',
          description: 'Visual style variant',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom container styles',
        },
        textStyle: {
          type: 'TextStyle',
          description: 'Custom text styles',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Badge content (text or custom)',
        },
      },
    },
    examples: [
      {
        name: 'Basic Variants',
        code: `<Badge>Default</Badge>
<Badge variant='secondary'>Secondary</Badge>
<Badge variant='destructive'>Error</Badge>
<Badge variant='outline'>Outline</Badge>
<Badge variant='success'>Success</Badge>`,
      },
      {
        name: 'Notification Counter',
        code: `<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Text>Messages</Text>
  <Badge style={{ minWidth: 20, height: 20, paddingHorizontal: 6, paddingVertical: 2 }} textStyle={{ fontSize: 12 }}>3</Badge>
</View>`,
      },
    ],
  },

  BottomSheet: {
    description: 'Draggable bottom sheet modal with snap points, gesture controls, and keyboard avoidance',
    importPath: '@/components/ui/bottom-sheet',
    exports: ['BottomSheet', 'useBottomSheet'],
    props: {
      BottomSheet: {
        isVisible: {
          type: 'boolean',
          required: true,
          description: 'Controls visibility of the bottom sheet',
        },
        onClose: {
          type: '() => void',
          required: true,
          description: 'Callback when sheet is dismissed',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Content to display inside the sheet',
        },
        snapPoints: {
          type: 'number[]',
          default: '[0.3, 0.6, 0.9]',
          description: 'Array of heights as percentage of screen (e.g., 0.5 = 50%)',
        },
        enableBackdropDismiss: {
          type: 'boolean',
          default: true,
          description: 'Allow closing by tapping backdrop',
        },
        title: {
          type: 'string',
          description: 'Optional title shown in header',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for the sheet container',
        },
        disablePanGesture: {
          type: 'boolean',
          default: false,
          description: 'Disable drag gestures (handle tap still works)',
        },
      },
    },
    examples: [
      {
        name: 'Basic Usage',
        code: `const { isVisible, open, close } = useBottomSheet();

<View>
  <Button onPress={open}>Open Sheet</Button>
  <BottomSheet isVisible={isVisible} onClose={close} title="Settings" snapPoints={[0.2, 0.5, 0.8, 0.95]}>
    <Text>Content here</Text>
  </BottomSheet>
</View>`,
      },
    ],
  },

  Button: {
    description: 'Interactive buttons with animations, loading states, and multiple variants',
    importPath: '@/components/ui/button',
    exports: ['Button'],
    props: {
      Button: {
        variant: {
          type: "'default' | 'destructive' | 'success' | 'outline' | 'secondary' | 'ghost' | 'link'",
          default: 'default',
          description: 'Visual style variant',
        },
        size: {
          type: "'default' | 'sm' | 'lg' | 'icon'",
          default: 'default',
          description: 'Button size (sm: 44px, default: HEIGHT, lg: 54px, icon: square)',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disables button and reduces opacity',
        },
        loading: {
          type: 'boolean',
          default: false,
          description: 'Shows spinner and disables interaction',
        },
        animation: {
          type: 'boolean',
          default: true,
          description: 'Enables spring animation on press',
        },
        haptic: {
          type: 'boolean',
          default: true,
          description: 'Enables haptic feedback on iOS',
        },
        icon: {
          type: 'React.ComponentType<LucideProps>',
          description: 'Lucide icon component to display',
        },
        onPress: {
          type: '() => void',
          description: 'Press handler function',
        },
        style: {
          type: 'ViewStyle | ViewStyle[]',
          description: 'Custom styles (flex property handled specially)',
        },
        textStyle: {
          type: 'TextStyle',
          description: 'Custom text styles',
        },
        children: {
          type: 'React.ReactNode',
          description: 'Button content (string or custom)',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `<Button onPress={() => console.log('pressed')}>Click me</Button>`,
      },
      {
        name: 'Variants',
        code: `<Button variant='default'>Default</Button>
<Button variant='destructive'>Delete</Button>
<Button variant='success'>Success</Button>
<Button variant='outline'>Outline</Button>
<Button variant='secondary'>Secondary</Button>
<Button variant='ghost'>Ghost</Button>
<Button variant='link'>Link</Button>`,
      },
      {
        name: 'With Icon',
        code: `import { Download } from 'lucide-react-native';
<Button icon={Download} onPress={() => {}}>Download</Button>`,
      },
      {
        name: 'Icon Only',
        code: `import { Settings } from 'lucide-react-native';
<Button size='icon' icon={Settings} onPress={() => {}} />`,
      },
      {
        name: 'Gradient',
        code: `import { LinearGradient } from 'expo-linear-gradient';
<LinearGradient colors={['#FF6B6B', '#4ECDC4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
  <Button style={{ backgroundColor: 'transparent' }} textStyle={{ color: 'white' }}>Gradient</Button>
</LinearGradient>`,
      },
    ],
  },

  Camera: {
    description:
      'Full-featured camera component with photo/video capture, zoom controls, timer, and customizable settings',
    importPath: '@/components/ui/camera',
    exports: ['Camera', 'CameraRef', 'CaptureSuccess'],
    props: {
      Camera: {
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for camera container',
        },
        facing: {
          type: "'back' | 'front'",
          default: "'back'",
          description: 'Initial camera facing direction',
        },
        enableTorch: {
          type: 'boolean',
          default: true,
          description: 'Show torch/flashlight toggle button',
        },
        showControls: {
          type: 'boolean',
          default: true,
          description: 'Show camera control UI overlay',
        },
        enableVideo: {
          type: 'boolean',
          default: true,
          description: 'Enable video recording mode',
        },
        maxVideoDuration: {
          type: 'number',
          default: 60,
          description: 'Maximum video recording duration in seconds',
        },
        timerOptions: {
          type: 'number[]',
          default: '[0, 3, 10]',
          description: 'Available timer countdown options in seconds',
        },
        onClose: {
          type: '() => void',
          description: 'Callback when close button is pressed',
        },
        onCapture: {
          type: '({ type, uri, cameraHeight }: CaptureSuccess) => void',
          description: 'Callback when photo is captured',
        },
        onVideoCapture: {
          type: '({ type, uri, cameraHeight }: CaptureSuccess) => void',
          description: 'Callback when video recording completes',
        },
      },
    },
    examples: [
      {
        name: 'Basic Usage',
        code: `const handleCapture = ({ uri, type }: { uri: string; type: string }) => {
  Alert.alert('Picture Captured', \`Saved to: \${uri}\`);
};

const handleVideoCapture = ({ uri, type }: { uri: string; type: string }) => {
  Alert.alert('Video Recorded', \`Saved to: \${uri}\`);
};

<Camera
  onCapture={handleCapture}
  onVideoCapture={handleVideoCapture}
  style={{ height: 400 }}
/>`,
      },
    ],
  },

  CameraPreview: {
    description: 'Complete camera workflow with preview, save to library, and upload actions',
    importPath: '@/components/ui/camera-preview',
    exports: ['CameraPreview'],
    props: {
      CameraPreview: {
        // Component has no external props - fully self-contained
      },
    },

    examples: [
      {
        name: 'Basic Usage',
        code: `import { CameraPreview } from '@/components/ui/camera-preview';

export function CameraPreviewDemo() {
  return <CameraPreview />;
}`,
      },
    ],
  },

  Card: {
    description: 'Flexible card container with header, content, and footer sections',
    importPath: '@/components/ui/card',
    exports: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
    props: {
      Card: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Card sections (Header, Content, Footer)',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for card container',
        },
      },
      CardHeader: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Header content (typically CardTitle and CardDescription)',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for header',
        },
      },
      CardTitle: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Title text',
        },
        style: {
          type: 'TextStyle',
          description: 'Custom styles for title',
        },
      },
      CardDescription: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Description text',
        },
        style: {
          type: 'TextStyle',
          description: 'Custom styles for description',
        },
      },
      CardContent: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Main card content',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for content',
        },
      },
      CardFooter: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Footer content (typically buttons)',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for footer',
        },
      },
    },
    examples: [
      {
        name: 'Complete Card',
        code: `<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Main content goes here</Text>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>`,
      },
    ],
  },

  Carousel: {
    description: 'Swipeable carousel/slider component with indicators, arrows, and auto-play support',
    importPath: '@/components/ui/carousel',
    exports: ['Carousel', 'CarouselItem', 'CarouselContent', 'CarouselIndicators', 'CarouselArrow', 'CarouselRef'],
    props: {
      Carousel: {
        children: {
          type: 'React.ReactNode[]',
          required: true,
          description: 'Array of CarouselItem components to display',
        },
        autoPlay: {
          type: 'boolean',
          default: false,
          description: 'Enable automatic slide advancement',
        },
        autoPlayInterval: {
          type: 'number',
          default: 3000,
          description: 'Interval in milliseconds between auto-advances',
        },
        showIndicators: {
          type: 'boolean',
          default: true,
          description: 'Display dot indicators below carousel',
        },
        showArrows: {
          type: 'boolean',
          default: false,
          description: 'Display navigation arrows on slides',
        },
        loop: {
          type: 'boolean',
          default: false,
          description: 'Allow looping from last to first slide',
        },
        itemWidth: {
          type: 'number',
          description: 'Custom width for each slide (enables multi-item view)',
        },
        spacing: {
          type: 'number',
          default: 0,
          description: 'Space between slides when using itemWidth',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for carousel container',
        },
        onIndexChange: {
          type: '(index: number) => void',
          description: 'Callback when active slide changes',
        },
        ref: {
          type: 'CarouselRef',
          description: 'Ref for programmatic control (goToSlide, goToNext, goToPrevious, getCurrentIndex)',
        },
      },
      CarouselItem: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Content to display in the slide',
        },
        style: {
          type: 'ViewStyle | ViewStyle[]',
          description: 'Custom styles for the item container',
        },
      },
      CarouselContent: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Wrapper for carousel content',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for content wrapper',
        },
      },
      CarouselIndicators: {
        total: {
          type: 'number',
          required: true,
          description: 'Total number of slides',
        },
        current: {
          type: 'number',
          required: true,
          description: 'Current active slide index',
        },
        onPress: {
          type: '(index: number) => void',
          description: 'Callback when indicator is pressed',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for indicators container',
        },
      },
      CarouselArrow: {
        direction: {
          type: "'left' | 'right'",
          required: true,
          description: 'Arrow direction',
        },
        onPress: {
          type: '() => void',
          required: true,
          description: 'Callback when arrow is pressed',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable arrow interaction',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for arrow button',
        },
      },
    },
    examples: [
      {
        name: 'Basic Auto-Play',
        code: `<Carousel autoPlay loop showIndicators showArrows>
  <CarouselItem>
    <Text>Slide 1</Text>
  </CarouselItem>
  <CarouselItem>
    <Text>Slide 2</Text>
  </CarouselItem>
</Carousel>`,
      },
    ],
  },

  Checkbox: {
    description: 'Customizable checkbox input with label support',
    importPath: '@/components/ui/checkbox',
    exports: ['Checkbox'],
    props: {
      Checkbox: {
        checked: {
          type: 'boolean',
          required: true,
          description: 'Checked state of the checkbox',
        },
        onCheckedChange: {
          type: '(checked: boolean) => void',
          required: true,
          description: 'Callback when checkbox state changes',
        },
        label: {
          type: 'string',
          description: 'Text label displayed next to checkbox',
        },
        error: {
          type: 'string',
          description: 'Error message (changes label color to danger)',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable checkbox interaction',
        },
        labelStyle: {
          type: 'TextStyle',
          description: 'Custom styles for label text',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onCheckedChange={setChecked} label='Accept terms' />`,
      },
      {
        name: 'Multiple Selection',
        code: `const [items, setItems] = useState<string[]>([]);
{options.map((option) => (
  <Checkbox
    key={option.id}
    checked={items.includes(option.id)}
    onCheckedChange={(checked) => {
      setItems(checked ? [...items, option.id] : items.filter(id => id !== option.id));
    }}
    label={option.label}
  />
))}`,
      },
    ],
  },

  Collapsible: {
    description: 'Expandable/collapsible content section with chevron indicator',
    importPath: '@/components/ui/collapsible',
    exports: ['Collapsible'],
    props: {
      Collapsible: {
        title: {
          type: 'string',
          required: true,
          description: 'Title text displayed in the trigger',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Content shown when expanded',
        },
      },
    },
    examples: [
      {
        name: 'Multiple Sections',
        code: `<View style={{ gap: 16 }}>
  <Collapsible title='Section 1'>
    <Text>Content 1</Text>
  </Collapsible>
  <Collapsible title='Section 2'>
    <Text>Content 2</Text>
  </Collapsible>
</View>`,
      },
    ],
  },

  ColorPicker: {
    description: 'HSV color picker with modal interface and color swatch preview',
    importPath: '@/components/ui/color-picker',
    exports: ['ColorPicker', 'ColorSwatch'],
    props: {
      ColorPicker: {
        value: {
          type: 'string',
          default: '#ff0000',
          description: 'Current color value in hex format',
        },
        onColorChange: {
          type: '(color: string) => void',
          description: 'Callback during color selection (real-time)',
        },
        onColorSelect: {
          type: '(color: string) => void',
          description: 'Callback when "Done" is pressed in modal',
        },
        swatchSize: {
          type: 'number',
          default: 'HEIGHT',
          description: 'Size of the color swatch button',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable color picker interaction',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for swatch container',
        },
      },
      ColorSwatch: {
        color: {
          type: 'string',
          required: true,
          description: 'Color to display in hex format',
        },
        size: {
          type: 'number',
          default: 32,
          description: 'Size of the color swatch',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for swatch',
        },
        onPress: {
          type: '() => void',
          description: 'Callback when swatch is pressed',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `const [color, setColor] = useState('#ff0000');
<ColorPicker value={color} onColorChange={setColor} onColorSelect={setColor} />`,
      },
    ],
  },

  Combobox: {
    description: 'Searchable dropdown with keyboard navigation and grouping support',
    importPath: '@/components/ui/combobox',
    exports: [
      'Combobox',
      'ComboboxTrigger',
      'ComboboxValue',
      'ComboboxContent',
      'ComboboxInput',
      'ComboboxList',
      'ComboboxEmpty',
      'ComboboxGroup',
      'ComboboxItem',
      'OptionType',
    ],
    props: {
      Combobox: {
        value: {
          type: 'OptionType | null',
          description: 'Selected option for single-select mode',
        },
        onValueChange: {
          type: '(option: OptionType | null) => void',
          description: 'Callback when selection changes (single mode)',
        },
        values: {
          type: 'OptionType[]',
          description: 'Selected options for multi-select mode',
        },
        onValuesChange: {
          type: '(options: OptionType[]) => void',
          description: 'Callback when selection changes (multiple mode)',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable combobox interaction',
        },
        multiple: {
          type: 'boolean',
          default: false,
          description: 'Enable multi-select mode',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Combobox components (Trigger, Content)',
        },
      },
      ComboboxTrigger: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Trigger content (typically ComboboxValue)',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for trigger button',
        },
        error: {
          type: 'boolean',
          default: false,
          description: 'Show error state styling',
        },
      },
      ComboboxValue: {
        placeholder: {
          type: 'string',
          default: 'Select...',
          description: 'Placeholder text when no selection',
        },
        style: {
          type: 'TextStyle',
          description: 'Custom styles for value text',
        },
      },
      ComboboxContent: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Content components (Input, List)',
        },
        maxHeight: {
          type: 'number',
          default: 400,
          description: 'Maximum height of dropdown',
        },
      },
      ComboboxInput: {
        placeholder: {
          type: 'string',
          default: 'Search...',
          description: 'Search input placeholder',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for input container',
        },
        autoFocus: {
          type: 'boolean',
          default: true,
          description: 'Auto-focus search input when opened',
        },
      },
      ComboboxList: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'List items or groups',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for list container',
        },
      },
      ComboboxEmpty: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Content shown when no results found',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for empty state',
        },
      },
      ComboboxGroup: {
        heading: {
          type: 'string',
          description: 'Group heading text',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'ComboboxItem components',
        },
      },
      ComboboxItem: {
        value: {
          type: 'string',
          required: true,
          description: 'Unique value for the option',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Display content (typically Text)',
        },
        onSelect: {
          type: '(value: OptionType) => void',
          description: 'Callback when item is selected',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable item selection',
        },
        searchValue: {
          type: 'string',
          description: 'Custom search text (defaults to label)',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for item',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `const [value, setValue] = useState<OptionType | null>(null);
<Combobox value={value} onValueChange={setValue}>
  <ComboboxTrigger>
    <ComboboxValue placeholder='Select...' />
  </ComboboxTrigger>
  <ComboboxContent>
    <ComboboxInput placeholder='Search...' />
    <ComboboxList>
      <ComboboxEmpty>No results found.</ComboboxEmpty>
      <ComboboxItem value='react'>React</ComboboxItem>
      <ComboboxItem value='vue'>Vue</ComboboxItem>
    </ComboboxList>
  </ComboboxContent>
</Combobox>`,
      },
    ],
  },

  DatePicker: {
    description: 'Versatile date and time picker with support for single dates, ranges, and datetime selection',
    importPath: '@/components/ui/date-picker',
    exports: ['DatePicker', 'DateRange'],
    props: {
      DatePicker: {
        mode: {
          type: "'date' | 'time' | 'datetime' | 'range'",
          default: "'date'",
          description: 'Selection mode - date, time, datetime, or range',
        },
        value: {
          type: 'Date | DateRange | undefined',
          description: 'Selected date(s) - Date for single, DateRange for range mode',
        },
        onChange: {
          type: '(value: Date | DateRange | undefined) => void',
          description: 'Callback when selection changes',
        },
        label: {
          type: 'string',
          description: 'Label text displayed inside the picker',
        },
        placeholder: {
          type: 'string',
          default: "'Select date'",
          description: 'Placeholder when no value selected',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disables the picker',
        },
        minimumDate: {
          type: 'Date',
          description: 'Earliest selectable date',
        },
        maximumDate: {
          type: 'Date',
          description: 'Latest selectable date',
        },
        timeFormat: {
          type: "'12' | '24'",
          default: "'24'",
          description: 'Time format for time/datetime modes',
        },
        variant: {
          type: "'filled' | 'outline' | 'group'",
          default: "'filled'",
          description: 'Visual style variant',
        },
        error: {
          type: 'string',
          description: 'Error message to display',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for the picker container',
        },
      },
      DateRange: {
        startDate: {
          type: 'Date | null',
          description: 'Start date of the range',
        },
        endDate: {
          type: 'Date | null',
          description: 'End date of the range',
        },
      },
    },
    examples: [
      {
        name: 'Basic Date',
        code: `const [date, setDate] = useState<Date | undefined>();
<DatePicker
  label='Select Date'
  value={date}
  onChange={setDate}
  placeholder='Choose a date'
/>`,
      },
      {
        name: 'Date Range',
        code: `const [range, setRange] = useState<DateRange | undefined>();
<DatePicker
  mode='range'
  label='Select Range'
  value={range}
  onChange={setRange}
  placeholder='Choose a range'
/>`,
      },
      {
        name: 'DateTime with 12-hour',
        code: `const [dateTime, setDateTime] = useState<Date | undefined>();
<DatePicker
  mode='datetime'
  label='Date & Time'
  value={dateTime}
  onChange={setDateTime}
  timeFormat='12'
/>`,
      },
      {
        name: 'Time Only',
        code: `const [time, setTime] = useState<Date | undefined>();
<DatePicker
  mode='time'
  label='Select Time'
  value={time}
  onChange={setTime}
  timeFormat='24'
/>`,
      },
    ],
  },

  FilePicker: {
    description: 'File selection component with validation, preview, and multiple file support',
    importPath: '@/components/ui/file-picker',
    exports: ['FilePicker', 'SelectedFile', 'useFilePicker', 'createFileFromUri', 'validateFiles'],
    props: {
      FilePicker: {
        onFilesSelected: {
          type: '(files: SelectedFile[]) => void',
          required: true,
          description: 'Callback when files are selected',
        },
        onError: {
          type: '(error: string) => void',
          description: 'Callback for validation errors',
        },
        fileType: {
          type: "'image' | 'document' | 'all'",
          default: "'all'",
          description: 'Type filter for file picker',
        },
        multiple: {
          type: 'boolean',
          default: false,
          description: 'Allow multiple file selection',
        },
        maxFiles: {
          type: 'number',
          default: 10,
          description: 'Maximum number of files allowed',
        },
        maxSizeBytes: {
          type: 'number',
          default: 10485760,
          description: 'Maximum file size in bytes (default 10MB)',
        },
        allowedExtensions: {
          type: 'string[]',
          description: "File extensions allowed (e.g., ['pdf', 'jpg'])",
        },
        placeholder: {
          type: 'string',
          default: "'Select files'",
          description: 'Placeholder text for picker button',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disables the picker',
        },
        showFileInfo: {
          type: 'boolean',
          default: true,
          description: 'Show file size in preview',
        },
        variant: {
          type: 'ButtonVariant',
          default: "'outline'",
          description: 'Button style variant',
        },
        style: {
          type: 'ViewStyle',
          description: 'Custom styles for picker button',
        },
      },
      SelectedFile: {
        uri: {
          type: 'string',
          required: true,
          description: 'File URI',
        },
        name: {
          type: 'string',
          required: true,
          description: 'File name',
        },
        size: {
          type: 'number',
          description: 'File size in bytes',
        },
        mimeType: {
          type: 'string',
          description: 'MIME type of file',
        },
      },
      useFilePicker: {
        maxFiles: {
          type: 'number',
          description: 'Maximum files allowed',
        },
        maxSizeBytes: {
          type: 'number',
          description: 'Maximum file size',
        },
        allowedExtensions: {
          type: 'string[]',
          description: 'Allowed file extensions',
        },
        onError: {
          type: '(error: string) => void',
          description: 'Error callback',
        },
      },
    },
    examples: [
      {
        name: 'Basic Usage',
        code: `<FilePicker
  onFilesSelected={(files) => console.log(files)}
  onError={(error) => console.error(error)}
  multiple={true}
  maxFiles={5}
/>`,
      },
    ],
  },

  Gallery: {
    description: 'Advanced image gallery component with grid layout, fullscreen modal, zoom, and pan gestures',
    importPath: '@/components/ui/gallery',
    exports: ['Gallery', 'GalleryItem', 'useImageZoom'],
    props: {
      Gallery: {
        items: {
          type: 'GalleryItem[]',
          required: true,
          description: 'Array of gallery items to display',
        },
        columns: {
          type: 'number',
          default: 4,
          description: 'Number of columns in grid layout',
        },
        spacing: {
          type: 'number',
          default: 0,
          description: 'Gap between grid items in pixels',
        },
        borderRadius: {
          type: 'number',
          default: 0,
          description: 'Border radius for grid images',
        },
        aspectRatio: {
          type: 'number',
          default: 1,
          description: 'Aspect ratio for grid items (width/height)',
        },
        showPages: {
          type: 'boolean',
          default: false,
          description: 'Show page counter in fullscreen mode',
        },
        showTitles: {
          type: 'boolean',
          default: false,
          description: 'Display titles below grid items',
        },
        showDescriptions: {
          type: 'boolean',
          default: false,
          description: 'Display descriptions below grid items',
        },
        enableFullscreen: {
          type: 'boolean',
          default: true,
          description: 'Enable fullscreen modal on tap',
        },
        enableZoom: {
          type: 'boolean',
          default: true,
          description: 'Enable pinch-to-zoom and double-tap zoom in fullscreen',
        },
        enableDownload: {
          type: 'boolean',
          default: false,
          description: 'Show download button in fullscreen',
        },
        enableShare: {
          type: 'boolean',
          default: false,
          description: 'Show share button in fullscreen',
        },
        onItemPress: {
          type: '(item: GalleryItem, index: number) => void',
          description: 'Custom handler for grid item press (overrides fullscreen)',
        },
        onDownload: {
          type: '(item: GalleryItem) => void',
          description: 'Download button handler (required if enableDownload is true)',
        },
        onShare: {
          type: '(item: GalleryItem) => void',
          description: 'Share button handler (required if enableShare is true)',
        },
        renderCustomOverlay: {
          type: '(item: GalleryItem, index: number) => React.ReactNode',
          description: 'Custom overlay renderer for grid items',
        },
      },
    },
    examples: [
      {
        name: 'Basic Grid',
        code: `import { Gallery, GalleryItem } from '@/components/ui/gallery';

const sampleImages: GalleryItem[] = [
  {
    id: '1',
    uri: 'https://images.com/',
    title: 'City Skyline',
    description: 'Modern architecture at sunset',
    thumbnail:'https://images.com/',
  },
  {
    id: '2',
    uri: 'https://images.com/',
    title: 'Winter Wonderland',
    description: 'Snow-covered peaks and pristine wilderness',
    thumbnail:'https://images.com/',
  },
  {
    id: '3',
    uri: 'https://images.com/,
    title: 'Ocean Waves',
    description: 'Peaceful ocean scene with rolling waves',
    thumbnail:'https://images.com/',
  },
  {
    id: '4',
    uri: 'https://images.com/',
    title: 'Forest Path',
    description: 'A winding path through ancient trees',
    thumbnail: 'https://images.com/',
  },

];

export function GalleryDemo() {
  return (
    <Gallery
      items={sampleImages}
      columns={2}
      spacing={8}
      borderRadius={12}
      enableFullscreen={true}
      enableZoom={true}
    />
  );
}
`,
      },
    ],
  },

  HelloWave: {
    description: 'Animated waving emoji or custom content with rotation animation',
    importPath: '@/components/ui/hello-wave',
    exports: ['HelloWave'],
    props: {
      HelloWave: {
        size: {
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: 'Size variant - sm: 20px, md: 28px, lg: 36px',
        },
        children: {
          type: 'React.ReactNode',
          default: "'👋'",
          description: 'Content to animate (emoji, text, or component)',
        },
      },
    },
    examples: [
      {
        name: 'Basic Wave',
        code: `<HelloWave />`,
      },
      {
        name: 'Custom Emoji',
        code: `<HelloWave>🎉</HelloWave>
<HelloWave>🌟</HelloWave>
<HelloWave>💎</HelloWave>`,
      },
    ],
  },

  Icon: {
    description: 'Themed icon wrapper for lucide-react-native with automatic color theming',
    importPath: '@/components/ui/icon',
    exports: ['Icon'],
    props: {
      Icon: {
        name: {
          type: 'React.ComponentType<LucideProps>',
          required: true,
          description: 'Lucide icon component (e.g., Heart, Star)',
        },
        size: {
          type: 'number',
          default: 24,
          description: 'Icon size in pixels',
        },
        color: {
          type: 'string',
          description: 'Icon color (overrides theme colors)',
        },
        lightColor: {
          type: 'string',
          description: 'Color for light theme',
        },
        darkColor: {
          type: 'string',
          description: 'Color for dark theme',
        },
        strokeWidth: {
          type: 'number',
          default: 1.8,
          description: 'Stroke width for icon',
        },
        fill: {
          type: 'string',
          description: 'Fill color for icon',
        },
        fillOpacity: {
          type: 'number',
          description: 'Fill opacity (0-1)',
        },
      },
    },
    examples: [
      {
        name: 'Basic Icon',
        code: `import { Heart } from 'lucide-react-native';

<Icon name={Heart} size={24} />`,
      },
      {
        name: 'Different Sizes',
        code: `import { Heart } from 'lucide-react-native';

<Icon name={Heart} size={16} />
<Icon name={Heart} size={24} />
<Icon name={Heart} size={32} />
<Icon name={Heart} size={48} />`,
      },
    ],
  },

  Image: {
    description: 'Enhanced image component with loading states, error handling, and variant styles',
    importPath: '@/components/ui/image',
    exports: ['Image', 'ImageProps'],
    props: {
      Image: {
        variant: {
          type: "'rounded' | 'circle' | 'default'",
          default: "'rounded'",
          description: 'Visual style variant',
        },
        source: {
          type: 'ImageSource',
          required: true,
          description: 'Image source (uri or local require)',
        },
        style: {
          type: 'ExpoImageProps["style"]',
          description: 'Custom image styles',
        },
        containerStyle: {
          type: 'any',
          description: 'Custom container styles',
        },
        showLoadingIndicator: {
          type: 'boolean',
          default: true,
          description: 'Show loading spinner while image loads',
        },
        showErrorFallback: {
          type: 'boolean',
          default: true,
          description: 'Show error message if image fails to load',
        },
        errorFallbackText: {
          type: 'string',
          default: "'Failed to load image'",
          description: 'Custom error message text',
        },
        loadingIndicatorSize: {
          type: "'small' | 'large'",
          default: "'small'",
          description: 'Size of loading spinner',
        },
        loadingIndicatorColor: {
          type: 'string',
          description: 'Custom loading spinner color',
        },
        aspectRatio: {
          type: 'number',
          description: 'Image aspect ratio (width/height)',
        },
        width: {
          type: 'number | string',
          description: 'Image width (number or percentage)',
        },
        height: {
          type: 'number | string',
          description: 'Image height (number or percentage)',
        },
        contentFit: {
          type: "'cover' | 'contain' | 'fill' | 'scale-down' | 'none'",
          default: "'cover'",
          description: 'How image should be resized to fit container',
        },
        transition: {
          type: 'number',
          default: 200,
          description: 'Fade-in transition duration in ms',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `<Image
  source={{ uri: 'https://picsum.photos/400' }}
  aspectRatio={1}
/>`,
      },
    ],
  },

  Input: {
    description: 'Flexible input component with labels, icons, validation, and textarea support',
    importPath: '@/components/ui/input',
    exports: ['Input', 'GroupedInput', 'GroupedInputItem'],
    props: {
      Input: {
        label: {
          type: 'string',
          description: 'Label text displayed in/above the input',
        },
        error: {
          type: 'string',
          description: 'Error message to display below input',
        },
        icon: {
          type: 'React.ComponentType<LucideProps>',
          description: 'Left icon component from lucide-react-native',
        },
        rightComponent: {
          type: 'React.ReactNode | (() => React.ReactNode)',
          description: 'Component or function returning component for right side',
        },
        variant: {
          type: "'filled' | 'outline'",
          default: "'filled'",
          description: 'Visual style variant',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disables input interaction',
        },
        type: {
          type: "'input' | 'textarea'",
          default: "'input'",
          description: 'Single-line input or multi-line textarea',
        },
        rows: {
          type: 'number',
          default: 4,
          description: 'Number of rows for textarea type',
        },
        containerStyle: {
          type: 'ViewStyle',
          description: 'Custom styles for outer container',
        },
        inputStyle: {
          type: 'TextStyle',
          description: 'Custom styles for TextInput',
        },
        labelStyle: {
          type: 'TextStyle',
          description: 'Custom styles for label text',
        },
      },
      GroupedInput: {
        title: {
          type: 'string',
          description: 'Title displayed above grouped inputs',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'GroupedInputItem components',
        },
        containerStyle: {
          type: 'ViewStyle',
          description: 'Custom styles for group container',
        },
      },
      GroupedInputItem: {
        label: {
          type: 'string',
          description: 'Label text for the input item',
        },
        error: {
          type: 'string',
          description: 'Error message (collected and displayed by parent)',
        },
        icon: {
          type: 'React.ComponentType<LucideProps>',
          description: 'Left icon component',
        },
        rightComponent: {
          type: 'React.ReactNode | (() => React.ReactNode)',
          description: 'Right-side component',
        },
        type: {
          type: "'input' | 'textarea'",
          default: "'input'",
          description: 'Input or textarea type',
        },
        rows: {
          type: 'number',
          default: 3,
          description: 'Rows for textarea',
        },
      },
    },
    examples: [
      {
        name: 'Input',
        code: `const [email, setEmail] = useState('');
const error = email && !email.includes('@') ? 'Invalid email' : '';

<Input
  label='Email'
  icon={Mail}
  value={email}
  onChangeText={setEmail}
  error={error}
  keyboardType='email-address'
/>`,
      },
      {
        name: 'Textarea',
        code: `<Input
  type='textarea'
  rows={5}
  label='Message'
  placeholder='Type your message...'
/>`,
      },
      {
        name: 'Grouped Inputs',
        code: `<GroupedInput title='Personal Information'>
  <GroupedInputItem label='Name' icon={User} />
  <GroupedInputItem label='Email' icon={Mail} />
  <GroupedInputItem label='Phone' icon={Phone} />
</GroupedInput>`,
      },
    ],
  },

  InputOTP: {
    description: 'One-time password input component with individual digit slots',
    importPath: '@/components/ui/input-otp',
    exports: ['InputOTP', 'InputOTPWithSeparator', 'InputOTPRef', 'InputOTPProps'],
    props: {
      InputOTP: {
        length: {
          type: 'number',
          default: 6,
          description: 'Number of OTP digits',
        },
        value: {
          type: 'string',
          description: 'Current OTP value',
        },
        onChangeText: {
          type: '(value: string) => void',
          description: 'Called when value changes',
        },
        onComplete: {
          type: '(value: string) => void',
          description: 'Called when all digits are entered',
        },
        error: {
          type: 'string',
          description: 'Error message to display below input',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Disable input',
        },
        masked: {
          type: 'boolean',
          default: false,
          description: 'Show dots instead of numbers',
        },
        separator: {
          type: 'React.ReactNode',
          description: 'Custom separator component between slots',
        },
        showCursor: {
          type: 'boolean',
          default: true,
          description: 'Show cursor in active slot',
        },
        containerStyle: {
          type: 'ViewStyle',
          description: 'Custom container styles',
        },
        slotStyle: {
          type: 'ViewStyle',
          description: 'Custom styles for individual slots',
        },
        errorStyle: {
          type: 'TextStyle',
          description: 'Custom error text styles',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `const [otp, setOtp] = useState('');

<InputOTP
  length={6}
  value={otp}
  onChangeText={setOtp}
  onComplete={(value) => {
    console.log('Complete:', value);
  }}
/>`,
      },
      {
        name: 'With Error',
        code: `<InputOTP
  length={6}
  value={otp}
  onChangeText={setOtp}
  error='Invalid code. Please try again.'
/>`,
      },
    ],
  },

  Link: {
    description: 'Universal link component supporting internal navigation and external URLs',
    importPath: '@/components/ui/link',
    exports: ['Link'],
    props: {
      Link: {
        href: {
          type: 'Href (string | object)',
          required: true,
          description: 'Navigation destination (path or URL)',
        },
        asChild: {
          type: 'boolean',
          default: false,
          description: 'Pass props to child component instead of wrapping',
        },
        browser: {
          type: "'in-app' | 'external'",
          default: "'in-app'",
          description: 'Browser mode for external URLs (native only)',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Link content (text or component)',
        },
      },
    },
    examples: [
      {
        name: 'Internal Navigation',
        code: `<Link href='/'>Home</Link>
<Link href='/profile'>Profile</Link>
<Link href={{ pathname: '/user', params: { id: '123' } }}>
  User Details
</Link>`,
      },
      {
        name: 'External URLs',
        code: `<Link href='https://github.com'>GitHub</Link>
<Link href='https://expo.dev' browser='external'>
  Open in External Browser
</Link>`,
      },
      {
        name: 'Communication Links',
        code: `<Link href='mailto:hello@example.com'>Email</Link>
<Link href='tel:+1234567890'>Call</Link>
<Link href='sms:+1234567890'>SMS</Link>`,
      },
    ],
  },

  MediaPicker: {
    description: 'Media selection component supporting images, videos, gallery view, and previews',
    importPath: '@/components/ui/media-picker',
    exports: ['MediaPicker', 'MediaAsset (type)'],
    props: {
      MediaPicker: {
        mediaType: {
          type: "'image' | 'video' | 'all'",
          default: "'all'",
          description: 'Type of media to allow selection',
        },
        multiple: {
          type: 'boolean',
          default: false,
          description: 'Allow multiple media selection',
        },
        maxSelection: {
          type: 'number',
          default: 10,
          description: 'Maximum number of items when multiple=true',
        },
        quality: {
          type: "'low' | 'medium' | 'high'",
          default: "'high'",
          description: 'Image quality for compression',
        },
        gallery: {
          type: 'boolean',
          default: false,
          description: 'Show full-screen gallery picker instead of system picker',
        },
        showPreview: {
          type: 'boolean',
          default: true,
          description: 'Display thumbnail previews of selected media',
        },
        previewSize: {
          type: 'number',
          default: 80,
          description: 'Size of preview thumbnails in pixels',
        },
        selectedAssets: {
          type: 'MediaAsset[]',
          description: 'Controlled selected assets',
        },
        onSelectionChange: {
          type: '(assets: MediaAsset[]) => void',
          description: 'Callback when selection changes',
        },
        onError: {
          type: '(error: string) => void',
          description: 'Callback for permission or selection errors',
        },
        buttonText: {
          type: 'string',
          description: 'Custom button text',
        },
        variant: {
          type: 'ButtonVariant',
          description: 'Button style variant',
        },
        size: {
          type: 'ButtonSize',
          description: 'Button size',
        },
        icon: {
          type: 'React.ComponentType<LucideProps>',
          description: 'Button icon',
        },
      },
    },
    examples: [
      {
        name: 'Basic Picker',
        code: `<MediaPicker
  mediaType='all'
  onSelectionChange={(assets) => console.log(assets)}
/>`,
      },
    ],
  },

  ModeToggle: {
    description: 'Animated dark/light mode toggle button with sun/moon icons',
    importPath: '@/components/ui/mode-toggle',
    exports: ['ModeToggle'],
    props: {
      ModeToggle: {
        variant: {
          type: 'ButtonVariant',
          default: "'outline'",
          description: 'Button variant style',
        },
        size: {
          type: 'ButtonSize',
          default: "'icon'",
          description: 'Button size',
        },
      },
    },
    examples: [
      {
        name: 'Basic',
        code: `<ModeToggle />`,
      },
    ],
  },

  Onboarding: {
    description: 'Multi-step onboarding flow with swipe gestures, progress indicators, and state management',
    importPath: '@/components/ui/onboarding',
    exports: ['Onboarding', 'OnboardingStep (type)', 'useOnboarding (hook)'],
    props: {
      Onboarding: {
        steps: {
          type: 'OnboardingStep[]',
          required: true,
          description: 'Array of onboarding steps',
        },
        onComplete: {
          type: '() => void',
          required: true,
          description: 'Callback when user completes onboarding',
        },
        onSkip: {
          type: '() => void',
          description: 'Callback when user skips (defaults to onComplete)',
        },
        showSkip: {
          type: 'boolean',
          default: true,
          description: 'Show skip button on non-final steps',
        },
        showProgress: {
          type: 'boolean',
          default: true,
          description: 'Show progress dots indicator',
        },
        swipeEnabled: {
          type: 'boolean',
          default: true,
          description: 'Enable swipe gesture navigation',
        },
        primaryButtonText: {
          type: 'string',
          default: "'Get Started'",
          description: 'Text for final step button',
        },
        nextButtonText: {
          type: 'string',
          default: "'Next'",
          description: 'Text for next button',
        },
        backButtonText: {
          type: 'string',
          default: "'Back'",
          description: 'Text for back button',
        },
        skipButtonText: {
          type: 'string',
          default: "'Skip'",
          description: 'Text for skip button',
        },
      },
      OnboardingStep: {
        id: {
          type: 'string',
          required: true,
          description: 'Unique identifier for step',
        },
        title: {
          type: 'string',
          required: true,
          description: 'Step title',
        },
        description: {
          type: 'string',
          required: true,
          description: 'Step description text',
        },
        image: {
          type: 'React.ReactNode',
          description: 'Header image/component',
        },
        icon: {
          type: 'React.ReactNode',
          description: 'Icon (used if no image provided)',
        },
        backgroundColor: {
          type: 'string',
          description: 'Custom background color for this step',
        },
      },
    },
    examples: [
      {
        name: 'Basic Onboarding',
        code: `const steps = [
  {
    id: '1',
    title: 'Welcome',
    description: 'Get started with our app',
    icon: <Text style={{ fontSize: 80 }}>👋</Text>,
  },
  {
    id: '2',
    title: 'Features',
    description: 'Discover powerful features',
    icon: <Text style={{ fontSize: 80 }}>⚡</Text>,
  },
];

<Onboarding
  steps={steps}
  onComplete={() => console.log('Complete!')}
/>`,
      },
    ],
  },

  ParallaxScrollView: {
    description: 'ScrollView with parallax header animation that scales and translates on scroll',
    importPath: '@/components/ui/parallax-scrollview',
    exports: ['ParallaxScrollView'],
    props: {
      ParallaxScrollView: {
        headerImage: {
          type: 'ReactElement',
          required: true,
          description: 'Component to display in parallax header (typically Image)',
        },
        headerHeight: {
          type: 'number',
          default: 250,
          description: 'Height of header in pixels',
        },
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Scrollable content below header',
        },
      },
    },
    examples: [
      {
        name: 'Basic Parallax',
        code: `<ParallaxScrollView
  headerHeight={300}
  headerImage={
    <Image
      source={{ uri: 'https://...' }}
      style={{ width: '100%', height: '100%' }}
      contentFit='cover'
    />
  }
>
  <View style={{ gap: 16 }}>
    <Text variant='heading'>Content</Text>
    <Text>Scroll to see parallax effect</Text>
  </View>
</ParallaxScrollView>`,
      },
      {
        name: 'With Gradient Overlay',
        code: `<ParallaxScrollView
  headerHeight={300}
  headerImage={
    <View style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image source={{ uri: '...' }} style={{ width: '100%', height: '100%' }} />
      <LinearGradient
        colors={['transparent', 'black']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
        }}
      />
      <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Title
        </Text>
      </View>
    </View>
  }
>
  <Text>Content...</Text>
</ParallaxScrollView>`,
      },
    ],
  },

  Picker: {
    description: 'Dropdown selector with single/multiple selection, search, and sections support',
    importPath: '@/components/ui/picker',
    exports: ['Picker'],
    props: {
      Picker: {
        options: {
          type: 'PickerOption[]',
          description: 'Array of picker options',
        },
        sections: {
          type: 'PickerSection[]',
          description: 'Grouped options with section titles',
        },
        value: {
          type: 'string',
          description: 'Selected value (single mode)',
        },
        values: {
          type: 'string[]',
          description: 'Selected values (multiple mode)',
        },
        placeholder: {
          type: 'string',
          default: "'Select an option...'",
          description: 'Placeholder text when no selection',
        },
        variant: {
          type: "'outline' | 'filled' | 'group'",
          default: "'filled'",
          description: 'Visual style variant',
        },
        multiple: {
          type: 'boolean',
          default: 'false',
          description: 'Enable multiple selection',
        },
        searchable: {
          type: 'boolean',
          default: 'false',
          description: 'Enable search functionality',
        },
        onValueChange: {
          type: '(value: string) => void',
          description: 'Callback for single selection',
        },
        onValuesChange: {
          type: '(values: string[]) => void',
          description: 'Callback for multiple selection',
        },
        label: {
          type: 'string',
          description: 'Label text displayed with icon',
        },
        icon: {
          type: 'React.ComponentType<LucideProps>',
          description: 'Icon component from lucide-react-native',
        },
        error: {
          type: 'string',
          description: 'Error message to display',
        },
        disabled: {
          type: 'boolean',
          default: 'false',
          description: 'Disable picker interaction',
        },
      },
    },
    examples: [
      {
        name: 'Basic Picker',
        code: `<Picker
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ]}
  value={selected}
  onValueChange={setSelected}
  placeholder='Choose an option'
/>`,
      },
      {
        name: 'Searchable with Sections',
        code: `<Picker
  searchable
  sections={[
    {
      title: 'Fruits',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
      ],
    },
    {
      title: 'Vegetables',
      options: [
        { label: 'Carrot', value: 'carrot' },
        { label: 'Lettuce', value: 'lettuce' },
      ],
    },
  ]}
  value={selected}
  onValueChange={setSelected}
/>`,
      },
    ],
  },

  Popover: {
    description: 'Floating content container with positioning and anchor support',
    importPath: '@/components/ui/popover',
    exports: [
      'Popover',
      'PopoverTrigger',
      'PopoverContent',
      'PopoverHeader',
      'PopoverBody',
      'PopoverFooter',
      'PopoverClose',
    ],
    props: {
      Popover: {
        open: {
          type: 'boolean',
          default: 'false',
          description: 'Controlled open state',
        },
        onOpenChange: {
          type: '(open: boolean) => void',
          description: 'Callback when open state changes',
        },
      },
      PopoverTrigger: {
        asChild: {
          type: 'boolean',
          default: 'false',
          description: 'Use child element as trigger',
        },
      },
      PopoverContent: {
        align: {
          type: "'start' | 'center' | 'end'",
          default: "'center'",
          description: 'Alignment relative to trigger',
        },
        side: {
          type: "'top' | 'right' | 'bottom' | 'left'",
          default: "'bottom'",
          description: 'Side relative to trigger',
        },
        sideOffset: {
          type: 'number',
          default: '8',
          description: 'Distance from trigger in pixels',
        },
        maxWidth: {
          type: 'number',
          default: '300',
          description: 'Maximum content width',
        },
        maxHeight: {
          type: 'number',
          default: '400',
          description: 'Maximum content height',
        },
      },
    },
    examples: [
      {
        name: 'Basic Popover',
        code: `<Popover>
  <PopoverTrigger>
    <Text>Click me</Text>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <Text variant='title'>Title</Text>
    </PopoverHeader>
    <PopoverBody>
      <Text>Popover content here</Text>
    </PopoverBody>
  </PopoverContent>
</Popover>`,
      },
      {
        name: 'With Custom Position',
        code: `<Popover>
  <PopoverTrigger asChild>
    <Button>Options</Button>
  </PopoverTrigger>
  <PopoverContent side='right' align='start'>
    <PopoverBody>
      <Button variant='ghost'>Edit</Button>
      <Button variant='ghost'>Delete</Button>
    </PopoverBody>
  </PopoverContent>
</Popover>`,
      },
    ],
  },

  Progress: {
    description: 'Progress bar with optional interactive seek functionality',
    importPath: '@/components/ui/progress',
    exports: ['Progress'],
    props: {
      Progress: {
        value: {
          type: 'number',
          required: true,
          description: 'Progress value (0-100)',
        },
        height: {
          type: 'number',
          default: 'HEIGHT',
          description: 'Bar height in pixels',
        },
        interactive: {
          type: 'boolean',
          default: 'false',
          description: 'Enable click/drag to seek',
        },
        onValueChange: {
          type: '(value: number) => void',
          description: 'Callback when value changes (interactive mode)',
        },
        onSeekStart: {
          type: '() => void',
          description: 'Callback when seek begins',
        },
        onSeekEnd: {
          type: '() => void',
          description: 'Callback when seek ends',
        },
      },
    },
    examples: [
      {
        name: 'Simple Progress',
        code: `<Progress value={progress} />`,
      },
      {
        name: 'Interactive Seekbar',
        code: `<Progress
  value={currentTime}
  interactive
  onValueChange={(val) => seek(val)}
  onSeekStart={() => pause()}
  onSeekEnd={() => play()}
/>`,
      },
    ],
  },

  RadioGroup: {
    description: 'Radio button group for single selection from multiple options',
    importPath: '@/components/ui/radio',
    exports: ['RadioGroup', 'RadioButton'],
    props: {
      RadioGroup: {
        options: {
          type: 'RadioOption[]',
          required: true,
          description: 'Array of radio options',
        },
        value: {
          type: 'string',
          description: 'Selected value',
        },
        onValueChange: {
          type: '(value: string) => void',
          description: 'Callback when selection changes',
        },
        orientation: {
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: 'Layout direction',
        },
        disabled: {
          type: 'boolean',
          default: 'false',
          description: 'Disable all options',
        },
      },
    },
    examples: [
      {
        name: 'Basic Radio Group',
        code: `<RadioGroup
  options={[
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ]}
  value={selected}
  onValueChange={setSelected}
/>`,
      },
      {
        name: 'Horizontal Layout',
        code: `<RadioGroup
  orientation='horizontal'
  options={[
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]}
  value={answer}
  onValueChange={setAnswer}
/>`,
      },
    ],
  },

  SearchBar: {
    description: 'Search input with debouncing, loading state, and suggestions',
    importPath: '@/components/ui/searchbar',
    exports: ['SearchBar', 'SearchBarWithSuggestions'],
    props: {
      SearchBar: {
        value: {
          type: 'string',
          description: 'Controlled search value',
        },
        onChangeText: {
          type: '(text: string) => void',
          description: 'Callback for text changes',
        },
        onSearch: {
          type: '(query: string) => void',
          description: 'Debounced search callback',
        },
        debounceMs: {
          type: 'number',
          default: '300',
          description: 'Debounce delay in milliseconds',
        },
        loading: {
          type: 'boolean',
          default: 'false',
          description: 'Show loading indicator',
        },
        showClearButton: {
          type: 'boolean',
          default: 'true',
          description: 'Show clear button when text present',
        },
        onClear: {
          type: '() => void',
          description: 'Callback when clear button pressed',
        },
      },
      SearchBarWithSuggestions: {
        suggestions: {
          type: 'string[]',
          description: 'Array of suggestion strings',
        },
        onSuggestionPress: {
          type: '(suggestion: string) => void',
          description: 'Callback when suggestion selected',
        },
        maxSuggestions: {
          type: 'number',
          default: '5',
          description: 'Maximum suggestions to display',
        },
      },
    },
    examples: [
      {
        name: 'Basic SearchBar',
        code: `<SearchBar
  value={query}
  onChangeText={setQuery}
  onSearch={handleSearch}
  placeholder='Search products...'
/>`,
      },
      {
        name: 'With Suggestions',
        code: `<SearchBarWithSuggestions
  value={query}
  onChangeText={setQuery}
  suggestions={['Apple', 'Banana', 'Orange']}
  onSuggestionPress={(item) => setQuery(item)}
/>`,
      },
    ],
  },

  Separator: {
    description: 'Visual divider for content sections',
    importPath: '@/components/ui/separator',
    exports: ['Separator'],
    props: {
      Separator: {
        orientation: {
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'Separator direction',
        },
      },
    },
    examples: [
      {
        name: 'Horizontal Separator',
        code: `<View>
  <Text>Section 1</Text>
  <Separator />
  <Text>Section 2</Text>
</View>`,
      },
    ],
  },

  Share: {
    description: 'Native share functionality with custom button and content validation',
    importPath: '@/components/ui/share',
    exports: ['ShareButton', 'useShare'],
    props: {
      ShareButton: {
        content: {
          type: 'ShareContent',
          required: true,
          description: 'Content to share (message, url, title)',
        },
        variant: {
          type: 'ButtonVariant',
          default: "'default'",
          description: 'Button style variant',
        },
        showIcon: {
          type: 'boolean',
          default: 'true',
          description: 'Show share icon',
        },
        onShareSuccess: {
          type: '(activityType?: string) => void',
          description: 'Callback on successful share',
        },
        onShareError: {
          type: '(error: Error) => void',
          description: 'Callback on share error',
        },
      },
    },
    examples: [
      {
        name: 'Share Button',
        code: `<ShareButton
  content={{
    message: 'Check out this app!',
    url: 'https://example.com',
  }}
>
  Share
</ShareButton>`,
      },
      {
        name: 'Using Hook',
        code: `const { shareUrl } = useShare();

<Button onPress={() => shareUrl('https://example.com', 'Check this out!')}>
  Share Link
</Button>`,
      },
    ],
  },

  Sheet: {
    description: 'Slide-in panel from left or right with backdrop',
    importPath: '@/components/ui/sheet',
    exports: ['Sheet', 'SheetTrigger', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription'],
    props: {
      Sheet: {
        open: {
          type: 'boolean',
          required: true,
          description: 'Control sheet visibility',
        },
        onOpenChange: {
          type: '(open: boolean) => void',
          required: true,
          description: 'Callback when open state changes',
        },
        side: {
          type: "'left' | 'right'",
          default: "'right'",
          description: 'Side from which sheet appears',
        },
      },
    },
    examples: [
      {
        name: 'Basic Sheet',
        code: `const [open, setOpen] = useState(false);

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger>
    <Button>Open Menu</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Configure your preferences</SheetDescription>
    </SheetHeader>
    <View style={{ padding: 24 }}>
      <Text>Content here</Text>
    </View>
  </SheetContent>
</Sheet>`,
      },
    ],
  },

  Skeleton: {
    description: 'Loading placeholder with pulsing animation',
    importPath: '@/components/ui/skeleton',
    exports: ['Skeleton'],
    props: {
      Skeleton: {
        width: {
          type: 'number | string',
          default: "'100%'",
          description: 'Skeleton width',
        },
        height: {
          type: 'number',
          default: '100',
          description: 'Skeleton height in pixels',
        },
        variant: {
          type: "'default' | 'rounded'",
          default: "'default'",
          description: 'Border radius style',
        },
      },
    },
    examples: [
      {
        name: 'Content Skeleton',
        code: `<View>
  <Skeleton height={24} width='60%' />
  <Skeleton height={100} style={{ marginTop: 12 }} />
  <Skeleton height={16} width='80%' style={{ marginTop: 8 }} />
</View>`,
      },
    ],
  },

  Spinner: {
    description: 'Loading indicator with multiple variants and sizes',
    importPath: '@/components/ui/spinner',
    exports: ['Spinner', 'LoadingOverlay', 'InlineLoader', 'ButtonSpinner'],
    props: {
      Spinner: {
        size: {
          type: "'default' | 'sm' | 'lg' | 'icon'",
          default: "'default'",
          description: 'Spinner size',
        },
        variant: {
          type: "'default' | 'cirlce' | 'dots' | 'pulse' | 'bars'",
          default: "'default'",
          description: 'Visual style',
        },
        label: {
          type: 'string',
          description: 'Text label below spinner',
        },
        showLabel: {
          type: 'boolean',
          default: 'false',
          description: 'Show "Loading..." label',
        },
        speed: {
          type: "'slow' | 'normal' | 'fast'",
          default: "'normal'",
          description: 'Animation speed',
        },
      },
      LoadingOverlay: {
        visible: {
          type: 'boolean',
          required: true,
          description: 'Show/hide overlay',
        },
        backdrop: {
          type: 'boolean',
          default: 'true',
          description: 'Show backdrop',
        },
      },
    },
    examples: [
      {
        name: 'Basic Spinner',
        code: `<Spinner variant='dots' label='Loading...' />`,
      },
      {
        name: 'Full Screen Overlay',
        code: `<LoadingOverlay
  visible={loading}
  variant='pulse'
/>`,
      },
    ],
  },

  Switch: {
    description: 'Toggle switch with label and error support',
    importPath: '@/components/ui/switch',
    exports: ['Switch'],
    props: {
      Switch: {
        value: {
          type: 'boolean',
          description: 'Switch state',
        },
        onValueChange: {
          type: '(value: boolean) => void',
          description: 'Callback when toggled',
        },
        label: {
          type: 'string',
          description: 'Label text',
        },
        error: {
          type: 'string',
          description: 'Error message',
        },
        disabled: {
          type: 'boolean',
          default: 'false',
          description: 'Disable switch',
        },
      },
    },
    examples: [
      {
        name: 'Labeled Switch',
        code: `<Switch
  label='Enable notifications'
  value={enabled}
  onValueChange={setEnabled}
/>`,
      },
    ],
  },

  Table: {
    description: 'Data table with sorting, filtering, pagination, and search',
    importPath: '@/components/ui/table',
    exports: ['Table'],
    props: {
      Table: {
        data: {
          type: 'T[]',
          required: true,
          description: 'Array of data objects',
        },
        columns: {
          type: 'TableColumn<T>[]',
          required: true,
          description: 'Column definitions',
        },
        pagination: {
          type: 'boolean',
          default: 'true',
          description: 'Enable pagination',
        },
        pageSize: {
          type: 'number',
          default: '10',
          description: 'Rows per page',
        },
        searchable: {
          type: 'boolean',
          default: 'true',
          description: 'Enable search bar',
        },
        sortable: {
          type: 'boolean',
          default: 'true',
          description: 'Enable column sorting',
        },
        onRowPress: {
          type: '(row: T, index: number) => void',
          description: 'Callback when row clicked',
        },
        loading: {
          type: 'boolean',
          default: 'false',
          description: 'Show loading state',
        },
      },
    },
    examples: [
      {
        name: 'Basic Table',
        code: `<Table
  data={users}
  columns={[
    { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
    { id: 'email', header: 'Email', accessorKey: 'email', sortable: true },
    { id: 'role', header: 'Role', accessorKey: 'role' },
  ]}
  onRowPress={(user) => navigate('UserDetail', { user })}
/>`,
      },
    ],
  },

  Tabs: {
    description: 'Tabbed interface with swipe support and orientation options',
    importPath: '@/components/ui/tabs',
    exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
    props: {
      Tabs: {
        defaultValue: {
          type: 'string',
          description: 'Initial active tab',
        },
        value: {
          type: 'string',
          description: 'Controlled active tab',
        },
        onValueChange: {
          type: '(value: string) => void',
          description: 'Callback when tab changes',
        },
        orientation: {
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'Tab layout direction',
        },
        enableSwipe: {
          type: 'boolean',
          default: 'true',
          description: 'Enable swipe gestures (horizontal only)',
        },
      },
      TabsTrigger: {
        value: {
          type: 'string',
          required: true,
          description: 'Unique tab identifier',
        },
        disabled: {
          type: 'boolean',
          default: 'false',
          description: 'Disable tab',
        },
      },
      TabsContent: {
        value: {
          type: 'string',
          required: true,
          description: 'Matching tab identifier',
        },
      },
    },
    examples: [
      {
        name: 'Basic Tabs',
        code: `<Tabs defaultValue='tab1'>
  <TabsList>
    <TabsTrigger value='tab1'>First</TabsTrigger>
    <TabsTrigger value='tab2'>Second</TabsTrigger>
  </TabsList>
  <TabsContent value='tab1'>
    <Text>First tab content</Text>
  </TabsContent>
  <TabsContent value='tab2'>
    <Text>Second tab content</Text>
  </TabsContent>
</Tabs>`,
      },
      {
        name: 'Swipeable Tabs',
        code: `<Tabs defaultValue='home' enableSwipe>
  <TabsList>
    <TabsTrigger value='home'>Home</TabsTrigger>
    <TabsTrigger value='profile'>Profile</TabsTrigger>
    <TabsTrigger value='settings'>Settings</TabsTrigger>
  </TabsList>
  <TabsContent value='home'>
    <Text>Swipe to navigate</Text>
  </TabsContent>
  <TabsContent value='profile'>
    <Text>Profile content</Text>
  </TabsContent>
  <TabsContent value='settings'>
    <Text>Settings content</Text>
  </TabsContent>
</Tabs>`,
      },
    ],
  },

  Text: {
    description: 'Themed text component with predefined variants',
    importPath: '@/components/ui/text',
    exports: ['Text'],
    props: {
      Text: {
        variant: {
          type: "'body' | 'title' | 'subtitle' | 'caption' | 'heading' | 'link'",
          default: "'body'",
          description: 'Text style variant',
        },
        lightColor: {
          type: 'string',
          description: 'Override color in light mode',
        },
        darkColor: {
          type: 'string',
          description: 'Override color in dark mode',
        },
      },
    },
    examples: [
      {
        name: 'Text Variants',
        code: `<View>
  <Text variant='heading'>Heading</Text>
  <Text variant='title'>Title</Text>
  <Text variant='subtitle'>Subtitle</Text>
  <Text variant='body'>Body text</Text>
  <Text variant='caption'>Caption</Text>
  <Text variant='link'>Link text</Text>
</View>`,
      },
    ],
  },

  Toast: {
    description: 'iOS Dynamic Island-style toast notifications with animations and gestures',
    importPath: '@/components/ui/toast',
    exports: ['ToastProvider', 'useToast'],
    props: {
      ToastProvider: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'App content wrapped by toast provider',
        },
        maxToasts: {
          type: 'number',
          default: 3,
          description: 'Maximum number of toasts to display simultaneously',
        },
      },
      ToastData: {
        title: {
          type: 'string',
          description: 'Toast title text',
        },
        description: {
          type: 'string',
          description: 'Toast description text',
        },
        variant: {
          type: "'default' | 'success' | 'error' | 'warning' | 'info'",
          default: 'default',
          description: 'Visual variant with colored icons',
        },
        duration: {
          type: 'number',
          default: 4000,
          description: 'Auto-dismiss duration in milliseconds (0 to disable)',
        },
        action: {
          type: '{ label: string; onPress: () => void }',
          description: 'Optional action button',
        },
      },
    },
    examples: [
      {
        name: 'Provider Setup',
        code: `// Wrap your app with ToastProvider
<ToastProvider maxToasts={3}>
  <App />
</ToastProvider>`,
      },
      {
        name: 'Basic Usage',
        code: `const { toast, success, error } = useToast();

// Simple variants
success('Saved!', 'Your changes have been saved');
error('Failed', 'Could not save changes');

// Custom toast with action
toast({
  title: 'Update Available',
  description: 'A new version is ready',
  variant: 'info',
  duration: 6000,
  action: {
    label: 'Update',
    onPress: () => console.log('Updating...'),
  },
});`,
      },
    ],
  },

  Toggle: {
    description: 'Button-like toggle component with pressed states and group variants',
    importPath: '@/components/ui/toggle',
    exports: ['Toggle', 'ToggleGroup', 'ToggleGroupSingle', 'ToggleGroupMultiple'],
    props: {
      Toggle: {
        children: {
          type: 'React.ReactNode',
          required: true,
          description: 'Toggle content (text or icon)',
        },
        pressed: {
          type: 'boolean',
          default: false,
          description: 'Controlled pressed state',
        },
        onPressedChange: {
          type: '(pressed: boolean) => void',
          description: 'Callback when pressed state changes',
        },
        variant: {
          type: "'default' | 'outline'",
          default: 'default',
          description: 'Visual variant',
        },
        size: {
          type: "'default' | 'icon'",
          default: 'icon',
          description: 'Size variant - icon for square, default for rectangular',
        },
        disabled: {
          type: 'boolean',
          default: false,
          description: 'Whether toggle is disabled',
        },
      },
      ToggleGroup: {
        type: {
          type: "'single' | 'multiple'",
          default: 'single',
          description: 'Controls selection mode',
        },
        value: {
          type: 'string | string[]',
          description: 'Controlled value(s) - string for single, array for multiple',
        },
        onValueChange: {
          type: '(value: string | string[]) => void',
          description: 'Callback when selection changes',
        },
        items: {
          type: 'ToggleGroupItem[]',
          required: true,
          description: 'Array of items: { value, label, icon?, disabled? }',
        },
        variant: {
          type: "'default' | 'outline'",
          default: 'default',
          description: 'Visual variant',
        },
        size: {
          type: "'default' | 'icon'",
          default: 'default',
          description: 'Size variant',
        },
        orientation: {
          type: "'horizontal' | 'vertical'",
          default: 'horizontal',
          description: 'Layout direction',
        },
      },
    },
    examples: [
      {
        name: 'Single Toggle',
        code: `const [bold, setBold] = useState(false);

<Toggle 
  pressed={bold} 
  onPressedChange={setBold}
  size='icon'
>
  <Icon name={Bold} size={16} />
</Toggle>`,
      },
      {
        name: 'Toggle Group',
        code: `import { Bold, Italic, Underline } from 'lucide-react-native';

const [format, setFormat] = useState<string[]>([]);

<ToggleGroupMultiple
  value={format}
  onValueChange={setFormat}
  items={[
    { value: 'bold', label: 'B', icon: Bold },
    { value: 'italic', label: 'I', icon: Italic },
    { value: 'underline', label: 'U', icon: Underline },
  ]}
  size='icon'
/>`,
      },
    ],
  },

  Video: {
    description: 'Advanced video player with custom controls, gestures, and subtitle support',
    importPath: '@/components/ui/video',
    exports: ['Video'],
    props: {
      Video: {
        source: {
          type: 'VideoSource',
          required: true,
          description: 'Video source (URI, require(), or asset)',
        },
        autoPlay: {
          type: 'boolean',
          default: false,
          description: 'Start playing automatically',
        },
        loop: {
          type: 'boolean',
          default: false,
          description: 'Loop video playback',
        },
        muted: {
          type: 'boolean',
          default: false,
          description: 'Start muted',
        },
        seekBy: {
          type: 'number',
          default: 2,
          description: 'Seconds to seek on double tap',
        },
        contentFit: {
          type: "'contain' | 'cover' | 'fill'",
          default: 'cover',
          description: 'How video fills container',
        },
        allowsFullscreen: {
          type: 'boolean',
          default: true,
          description: 'Enable fullscreen mode',
        },
        allowsPictureInPicture: {
          type: 'boolean',
          default: true,
          description: 'Enable picture-in-picture',
        },
        subtitles: {
          type: 'Array<{ start: number; end: number; text: string }>',
          description: 'Subtitle definitions with timing',
        },
        onLoad: {
          type: '() => void',
          description: 'Callback when video loads',
        },
        onError: {
          type: '(error: any) => void',
          description: 'Callback on error',
        },
        onPlaybackStatusUpdate: {
          type: '(status: any) => void',
          description: 'Callback with playback progress updates',
        },
      },
    },
    examples: [
      {
        name: 'Basic Video',
        code: `<Video
  source={{ uri: 'https://example.com/video.mp4' }}
  style={{ width: '100%', height: 300 }}
  autoPlay
/>`,
      },
      {
        name: 'With Subtitles',
        code: `<Video
  source={{ uri: 'https://example.com/video.mp4' }}
  subtitles={[
    { start: 0, end: 2.5, text: 'Hello world' },
    { start: 2.5, end: 5, text: 'Welcome to the video' },
  ]}
  seekBy={5}
  onPlaybackStatusUpdate={(status) => {
    console.log('Current time:', status.currentTime);
  }}
/>`,
      },
    ],
  },

  View: {
    description: 'Basic View wrapper with transparent background by default',
    importPath: '@/components/ui/view',
    exports: ['View'],
    props: {
      View: {
        style: {
          type: 'ViewStyle',
          description: 'Style object or array (transparent background applied first)',
        },
        children: {
          type: 'React.ReactNode',
          description: 'Child components',
        },
        '...otherProps': {
          type: 'ViewProps',
          description: 'All standard React Native View props',
        },
      },
    },
    examples: [
      {
        name: 'Basic Usage',
        code: `<View style={{ padding: 16, flex: 1 }}>
  <Text>Content goes here</Text>
</View>`,
      },
    ],
  },
};
