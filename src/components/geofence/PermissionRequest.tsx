import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

interface PermissionRequestProps {
  onRequestPermission: () => void;
}

export const PermissionRequest = ({ onRequestPermission }: PermissionRequestProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <IconSymbol
          name="location.slash.fill"
          size={64}
          color={theme.icon}
          style={styles.icon}
        />
        <ThemedText type="title" style={styles.title}>
          Location Access Required
        </ThemedText>
        <ThemedText style={styles.text}>
          We need your location permission to track your position and monitor
          geofences.
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#35B2E6" }]}
          onPress={onRequestPermission}
          activeOpacity={0.8}
        >
          <IconSymbol name="location.fill" size={20} color="#fff" />
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    maxWidth: 400,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 14,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});

