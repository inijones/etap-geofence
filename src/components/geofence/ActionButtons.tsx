import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

interface ActionButtonsProps {
  onRefreshLocation: () => void;
  onClearGeofence?: () => void;
  hasGeofence: boolean;
}

export const ActionButtons = ({
  onRefreshLocation,
  onClearGeofence,
  hasGeofence,
}: ActionButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={onRefreshLocation}
        activeOpacity={0.8}
      >
        <IconSymbol name="arrow.clockwise" size={20} color="#fff" />
        <Text style={styles.buttonText}>Refresh Location</Text>
      </TouchableOpacity>
      {hasGeofence && onClearGeofence && (
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={onClearGeofence}
          activeOpacity={0.8}
        >
          <IconSymbol name="trash.fill" size={20} color="#fff" />
          <Text style={styles.buttonText}>Clear Geofence</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 14,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButton: {
    backgroundColor: "#35B2E6",
  },
  dangerButton: {
    backgroundColor: "#35B2E6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});

