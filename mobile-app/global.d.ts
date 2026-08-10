import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface FlatListProps<ItemT> {
    className?: string;
  }
  interface ImageBackgroundProps {
    className?: string;
  }
}

declare module 'react-native-safe-area-context' {
  import { NativeSafeAreaViewProps as OriginalNativeSafeAreaViewProps } from 'react-native-safe-area-context';
  export interface NativeSafeAreaViewProps extends OriginalNativeSafeAreaViewProps {
    className?: string;
  }
}
