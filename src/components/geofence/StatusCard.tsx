import { StyleSheet, View } from "react-native";
import { Geofence } from "../../types/geofence";
import { IconSymbol } from "../ui/icon-symbol";
import { ThemedText } from "../themed-text";
import { geofenceService } from "../../services/GeofenceService";

interface StatusCardProps {
  geofence: Geofence | null;
  isInside: boolean;
  distance: number | null;
  geofenceRadius: number | null;
}

export const StatusCard = ({
  geofence,
  isInside,
  distance,
  geofenceRadius,
}: StatusCardProps) => {
  const statusColor = geofenceService.getStatusColor(geofence, isInside, "#000");
  const statusBgColor = geofenceService.getStatusBackgroundColor(geofence, isInside);
  const statusText = geofenceService.getStatusText(geofence, isInside);
  const iconName = geofenceService.getStatusIconName(geofence, isInside);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: statusBgColor, borderColor: statusColor },
      ]}
    >
      <View style={styles.header}>
        <IconSymbol name={iconName} size={24} color={statusColor} />
        <ThemedText type="defaultSemiBold" style={styles.label}>
          Geofence Status
        </ThemedText>
      </View>
      <ThemedText style={[styles.statusText, { color: statusColor }]}>
        {statusText}
      </ThemedText>
      {geofence && distance !== null && geofenceRadius !== null && (
        <ThemedText style={styles.distanceText}>
          {distance.toFixed(0)}m / {geofenceRadius}m
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
});

