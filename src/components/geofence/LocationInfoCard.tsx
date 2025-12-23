import { Platform, StyleSheet, View } from "react-native";
import { LocationData } from "../../types/geofence";
import { IconSymbol } from "../ui/icon-symbol";
import { ThemedText } from "../themed-text";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

interface LocationInfoCardProps {
  location: LocationData;
}

export const LocationInfoCard = ({ location }: LocationInfoCardProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: theme.icon + "20",
        },
      ]}
    >
      <View style={styles.header}>
        <IconSymbol name="location.fill" size={20} color={theme.icon} />
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Current Location
        </ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Latitude:</ThemedText>
        <ThemedText style={styles.value}>
          {location.latitude.toFixed(6)}
        </ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Longitude:</ThemedText>
        <ThemedText style={styles.value}>
          {location.longitude.toFixed(6)}
        </ThemedText>
      </View>
      {location.accuracy && (
        <View style={styles.row}>
          <ThemedText style={styles.label}>Accuracy:</ThemedText>
          <ThemedText style={styles.value}>
            {location.accuracy.toFixed(0)}m
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    opacity: 0.7,
  },
  value: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: "ui-monospace",
      default: "monospace",
    }),
  },
});

