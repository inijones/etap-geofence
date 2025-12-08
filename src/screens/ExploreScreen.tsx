import { Platform, StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Collapsible } from '../components/ui/collapsible';
import { ExternalLink } from '../components/external-link';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { IconSymbol } from '../components/ui/icon-symbol';
import { Fonts, Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
      ]}
    >
      <ThemedView lightColor="transparent" darkColor="transparent" style={styles.content}>
        <View style={styles.titleContainer}>
          <IconSymbol name="location.fill" size={32} color={theme.tint} />
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}>
            About Geofence
          </ThemedText>
        </View>
        
        <ThemedText style={styles.description}>
          Monitor your location and get notified when you enter or exit designated areas.
        </ThemedText>

        <View style={styles.featureGrid}>
          <View style={[styles.featureCard, { borderColor: theme.icon + '20' }]}>
            <IconSymbol name="location.fill" size={32} color={theme.tint} />
            <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
              Real-time Tracking
            </ThemedText>
            <ThemedText style={styles.featureText}>
              Continuously monitor your location with high accuracy GPS tracking.
            </ThemedText>
          </View>

          <View style={[styles.featureCard, { borderColor: theme.icon + '20' }]}>
            <IconSymbol name="bell.fill" size={32} color={theme.tint} />
            <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
              Instant Notifications
            </ThemedText>
            <ThemedText style={styles.featureText}>
              Get notified immediately when you enter or exit a geofenced area.
            </ThemedText>
          </View>
        </View>

        <Collapsible title="How to Use">
          <ThemedText style={styles.collapsibleText}>
            1. Tap anywhere on the map to set a geofence center point.
          </ThemedText>
          <ThemedText style={styles.collapsibleText}>
            2. Choose your desired radius (50m, 100m, 500m, or 1000m).
          </ThemedText>
          <ThemedText style={styles.collapsibleText}>
            3. The app will monitor your location and alert you when you cross the boundary.
          </ThemedText>
          <ThemedText style={styles.collapsibleText}>
            4. Use the status indicator to see if you are currently inside or outside the geofence.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Privacy & Permissions">
          <ThemedText style={styles.collapsibleText}>
            This app requires location permissions to function. Your location data is processed locally on your device and is never shared with third parties.
          </ThemedText>
          <ThemedText style={styles.collapsibleText}>
            Notification permissions are recommended to receive geofence alerts, but the app will still work without them.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Technical Details">
          <ThemedText style={styles.collapsibleText}>
            Built with <ThemedText type="defaultSemiBold">React Native</ThemedText> and{' '}
            <ThemedText type="defaultSemiBold">Expo</ThemedText> for cross-platform support.
          </ThemedText>
          <ThemedText style={styles.collapsibleText}>
            Uses <ThemedText type="defaultSemiBold">expo-location</ThemedText> for GPS tracking and{' '}
            <ThemedText type="defaultSemiBold">expo-notifications</ThemedText> for alerts.
          </ThemedText>
          <ThemedText style={styles.collapsibleText}>
            Distance calculations use the Haversine formula for accurate geofence detection.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/location/">
            <ThemedText type="link">Learn more about Expo Location</ThemedText>
          </ExternalLink>
        </Collapsible>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  featureTitle: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 18,
  },
  collapsibleText: {
    marginBottom: 8,
    lineHeight: 22,
  },
});

