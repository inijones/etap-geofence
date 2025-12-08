import React from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { IconSymbol } from "../components/ui/icon-symbol";
import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: theme.tint + "20" }]}
        >
          <Image
            source={require("../../assets/icon/app_icon.png")}
            style={styles.appIcon}
            resizeMode="contain"
          />
        </View>

        <ThemedText type="title" style={styles.title}>
          Geofence App
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Monitor your location and get notified when you enter or exit
          designated areas.
        </ThemedText>

        <View style={styles.features}>
          <View style={styles.feature}>
            <IconSymbol name="location.fill" size={24} color={theme.tint} />
            <ThemedText style={styles.featureText}>
              Real-time Tracking
            </ThemedText>
          </View>
          <View style={styles.feature}>
            <IconSymbol name="bell.fill" size={24} color={theme.tint} />
            <ThemedText style={styles.featureText}>
              Smart Notifications
            </ThemedText>
          </View>
          <View style={styles.feature}>
            <IconSymbol name="map.fill" size={24} color={theme.tint} />
            <ThemedText style={styles.featureText}>Interactive Maps</ThemedText>
          </View>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  appIcon: {
    width: 120,
    height: 120,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 36,
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 56,
    opacity: 0.85,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  features: {
    width: "100%",
    gap: 20,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  featureText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});
