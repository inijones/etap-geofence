import React, { Component, ReactNode, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ErrorBoundary } from "@/components/error-boundary";

// Check if we're in Expo Go (which doesn't have native modules)
const isExpoGo = Constants.executionEnvironment === "storeClient";

// Try to import MapView, but handle the case when it's not available
let MapView: any = null;
let Circle: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;
let mapsAvailable = false;
let mapsLoadAttempted = false;

// Use a function to check if maps are available
function loadMaps() {
  // If we're in Expo Go, maps won't be available - don't even try
  if (isExpoGo) {
    mapsAvailable = false;
    mapsLoadAttempted = true;
    return false;
  }

  if (mapsAvailable) return true;
  if (mapsLoadAttempted) return false;
  
  mapsLoadAttempted = true;
  
  try {
    // Only try to require if we're not in Expo Go
    // Dynamic require to avoid import-time errors
    const maps = require("react-native-maps");
    if (maps && maps.default) {
      MapView = maps.default;
      Circle = maps.Circle;
      Marker = maps.Marker;
      PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
      mapsAvailable = true;
      return true;
    }
  } catch (error) {
    // Maps not available - this can happen even in dev builds if module isn't linked
    console.warn("react-native-maps not available:", error);
    mapsAvailable = false;
    return false;
  }
  return false;
}

interface MapWrapperProps {
  children?: ReactNode;
  [key: string]: any;
}

export function MapWrapper(props: MapWrapperProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if maps are available
    try {
      const loaded = loadMaps();
      setMapsLoaded(loaded);
    } catch (error) {
      setHasError(true);
      setMapsLoaded(false);
    }
  }, []);

  if (!mapsLoaded || hasError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol
          name="exclamationmark.triangle.fill"
          size={64}
          color={theme.tint}
          style={styles.errorIcon}
        />
        <ThemedText type="title" style={styles.errorTitle}>
          Development Build Required
        </ThemedText>
        <ThemedText style={styles.errorText}>
          This app uses native maps which are not available in Expo Go.
        </ThemedText>
        <ThemedText style={styles.errorText}>
          You need to build a development client to use this app.
        </ThemedText>
        <View style={styles.instructionsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.instructionsTitle}>
            To fix this:
          </ThemedText>
          <ThemedText style={styles.instruction}>
            1. Connect your iPhone to your Mac via USB
          </ThemedText>
          <ThemedText style={styles.instruction}>
            2. Run: <ThemedText type="defaultSemiBold">npx expo run:ios --device</ThemedText>
          </ThemedText>
          <ThemedText style={styles.instruction}>
            3. Wait for the build to complete (5-15 minutes first time)
          </ThemedText>
          <ThemedText style={styles.instruction}>
            4. The app will install on your iPhone automatically
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Wrap MapView in ErrorBoundary as final safety net
  return (
    <ErrorBoundary>
      <MapView {...props}>{props.children}</MapView>
    </ErrorBoundary>
  );
}

// Export map components if available
export { Circle, Marker, PROVIDER_GOOGLE };
export const isMapsAvailable = () => mapsAvailable;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorIcon: {
    marginBottom: 24,
  },
  errorTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 24,
    opacity: 0.8,
  },
  instructionsContainer: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: 400,
  },
  instructionsTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  instruction: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

