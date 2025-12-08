import React, { Component, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error | null }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const isMapsError = error?.message?.includes("RNMapsAirModule") || 
                      error?.message?.includes("react-native-maps");

  if (isMapsError) {
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

  return (
    <ThemedView style={styles.errorContainer}>
      <IconSymbol
        name="exclamationmark.triangle.fill"
        size={64}
        color={theme.tint}
        style={styles.errorIcon}
      />
      <ThemedText type="title" style={styles.errorTitle}>
        Something went wrong
      </ThemedText>
      <ThemedText style={styles.errorText}>
        {error?.message || "An unexpected error occurred"}
      </ThemedText>
    </ThemedView>
  );
}

export function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}

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

