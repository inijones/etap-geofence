import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { Linking } from 'react-native';
import { ThemedText } from './themed-text';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink({ href, children, style }: Props) {
  const handlePress = async () => {
    if (process.env.EXPO_OS === 'web') {
      window.open(href, '_blank');
    } else {
      try {
        await openBrowserAsync(href, {
          presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
        });
      } catch (error) {
        // Fallback to system browser
        Linking.openURL(href);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {typeof children === 'string' ? (
        <ThemedText type="link">{children}</ThemedText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
