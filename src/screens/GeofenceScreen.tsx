import React, { useEffect, useRef } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { ActionButtons } from "../components/geofence/ActionButtons";
import { GeofenceMap } from "../components/geofence/GeofenceMap";
import { LoadingScreen } from "../components/geofence/LoadingScreen";
import { LocationInfoCard } from "../components/geofence/LocationInfoCard";
import { PermissionRequest } from "../components/geofence/PermissionRequest";
import { StatusCard } from "../components/geofence/StatusCard";
import { RadiusDialog } from "../components/radius-dialog";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { IconSymbol } from "../components/ui/icon-symbol";
import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { useGeofence } from "../hooks/useGeofence";
import { useLocation } from "../hooks/useLocation";
import { useMapInteractions } from "../hooks/useMapInteractions";
import { locationService } from "../services/LocationService";
import { notificationService } from "../services/NotificationService";

export default function GeofenceScreen() {
  const mapRef = useRef<any>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // Initialize notification service
  useEffect(() => {
    notificationService.initialize();
  }, []);

  // Location management
  const {
    location,
    hasPermission,
    isLoading,
    requestPermissions,
    refreshLocation,
  } = useLocation();

  // Geofence management
  const { geofence, isInside, setGeofenceAt, clearGeofence, getDistance } =
    useGeofence(location);

  // Map interactions
  const {
    showRadiusDialog,
    handleMapPress,
    handleRadiusSelect,
    closeRadiusDialog,
  } = useMapInteractions({
    onSetGeofence: setGeofenceAt,
  });

  // Animate map to location when it's updated
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        locationService.getMapRegion(location),
        500
      );
    }
  }, [location]);

  /**
   * Handle clear geofence with confirmation
   */
  const handleClearGeofence = () => {
    Alert.alert(
      "Clear Geofence",
      "Are you sure you want to clear the geofence?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearGeofence,
        },
      ]
    );
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Permission denied state
  if (!hasPermission) {
    return <PermissionRequest onRequestPermission={requestPermissions} />;
  }

  const distance = getDistance();

  return (
    <ThemedView style={styles.container}>
      <RadiusDialog
        visible={showRadiusDialog}
        onClose={closeRadiusDialog}
        onSelect={handleRadiusSelect}
      />

      <GeofenceMap
        location={location}
        geofence={geofence}
        isInsideGeofence={isInside}
        onMapPress={handleMapPress}
        mapRef={mapRef}
      />

      <View
        style={[
          styles.controlsContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <StatusCard
          geofence={geofence}
          isInside={isInside}
          distance={distance}
          geofenceRadius={geofence?.radius || null}
        />

        {location && <LocationInfoCard location={location} />}

        <ActionButtons
          onRefreshLocation={refreshLocation}
          onClearGeofence={handleClearGeofence}
          hasGeofence={!!geofence}
        />

        <View style={styles.instructionContainer}>
          <IconSymbol name="hand.tap.fill" size={16} color={theme.icon} />
          <ThemedText style={styles.instructionText}>
            Tap on the map to set a geofence
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 8,
  },
  instructionText: {
    fontSize: 13,
    opacity: 0.6,
  },
});
