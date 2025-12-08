import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ErrorBoundary } from "../components/error-boundary";
import {
  Circle,
  MapWrapper,
  Marker,
  PROVIDER_GOOGLE,
} from "../components/map-wrapper";
import { RadiusDialog } from "../components/radius-dialog";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { IconSymbol } from "../components/ui/icon-symbol";
import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface Geofence {
  latitude: number;
  longitude: number;
  radius: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export default function GeofenceScreen() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [geofence, setGeofence] = useState<Geofence | null>(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchSubscription, setWatchSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [showRadiusDialog, setShowRadiusDialog] = useState<boolean>(false);
  const [pendingCoordinate, setPendingCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<any>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  useEffect(() => {
    requestPermissions();
    return () => {
      if (watchSubscription) {
        watchSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (location && geofence) {
      checkGeofenceStatus(location, geofence);
    }
  }, [location, geofence]);

  const requestPermissions = async () => {
    try {
      setIsLoading(true);

      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this app.",
          [{ text: "OK" }]
        );
        setLocationPermission(false);
        setIsLoading(false);
        return;
      }

      const { status: notificationStatus } =
        await Notifications.requestPermissionsAsync();
      if (notificationStatus !== "granted") {
        Alert.alert(
          "Notification Permission",
          "Notification permission is recommended to receive geofence alerts.",
          [{ text: "OK" }]
        );
      }

      setLocationPermission(true);
      await getCurrentLocation();
      startLocationTracking();
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "Failed to request permissions");
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      };

      setLocation(locationData);

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location");
      setIsLoading(false);
    }
  };

  const startLocationTracking = async () => {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (newLocation) => {
        const locationData: LocationData = {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          accuracy: newLocation.coords.accuracy,
        };
        setLocation(locationData);
      }
    );

    setWatchSubscription(subscription);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const checkGeofenceStatus = (
    currentLocation: LocationData,
    fence: Geofence
  ) => {
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      fence.latitude,
      fence.longitude
    );

    const wasInside = isInsideGeofence;
    const nowInside = distance <= fence.radius;

    if (wasInside !== nowInside) {
      setIsInsideGeofence(nowInside);

      if (nowInside) {
        triggerNotification(
          "Entered Geofence",
          "You have entered the geofenced area!"
        );
        Alert.alert("Geofence Alert", "You have entered the geofenced area!");
      } else {
        triggerNotification(
          "Exited Geofence",
          "You have left the geofenced area!"
        );
        Alert.alert("Geofence Alert", "You have left the geofenced area!");
      }
    } else {
      setIsInsideGeofence(nowInside);
    }
  };

  const triggerNotification = async (title: string, body: string) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error triggering notification:", error);
    }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;

    if (Platform.OS === "android") {
      // Use custom dialog for Android
      setPendingCoordinate(coordinate);
      setShowRadiusDialog(true);
    } else {
      // Use Alert for iOS
      Alert.alert(
        "Set Geofence",
        "Do you want to set a geofence at this location?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Set 50m",
            onPress: () => setGeofence({ ...coordinate, radius: 50 }),
          },
          {
            text: "Set 100m",
            onPress: () => setGeofence({ ...coordinate, radius: 100 }),
          },
          {
            text: "Set 500m",
            onPress: () => setGeofence({ ...coordinate, radius: 500 }),
          },
          {
            text: "Set 1000m",
            onPress: () => setGeofence({ ...coordinate, radius: 1000 }),
          },
        ]
      );
    }
  };

  const handleRadiusSelect = (radius: number) => {
    if (pendingCoordinate) {
      setGeofence({ ...pendingCoordinate, radius });
      setPendingCoordinate(null);
    }
  };

  const clearGeofence = () => {
    Alert.alert(
      "Clear Geofence",
      "Are you sure you want to clear the geofence?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setGeofence(null);
            setIsInsideGeofence(false);
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.tint} />
        <ThemedText style={styles.loadingText}>Loading location...</ThemedText>
      </ThemedView>
    );
  }

  if (!locationPermission) {
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
            style={styles.permissionIcon}
          />
          <ThemedText type="title" style={styles.permissionTitle}>
            Location Access Required
          </ThemedText>
          <ThemedText style={styles.permissionText}>
            We need your location permission to track your position and monitor
            geofences.
          </ThemedText>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#35B2E6" }]}
            onPress={requestPermissions}
            activeOpacity={0.8}
          >
            <IconSymbol name="location.fill" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const statusColor = geofence
    ? isInsideGeofence
      ? "#34C759"
      : "#FF3B30"
    : theme.icon;
  const statusBgColor = geofence
    ? isInsideGeofence
      ? "rgba(52, 199, 89, 0.1)"
      : "rgba(255, 59, 48, 0.1)"
    : "transparent";

  return (
    <ThemedView style={styles.container}>
      <RadiusDialog
        visible={showRadiusDialog}
        onClose={() => {
          setShowRadiusDialog(false);
          setPendingCoordinate(null);
        }}
        onSelect={handleRadiusSelect}
      />
      <ErrorBoundary>
        <MapWrapper
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={handleMapPress}
          initialRegion={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : undefined
          }
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              description={`Accuracy: ${
                location.accuracy?.toFixed(0) || "N/A"
              }m`}
            />
          )}
          {geofence && (
            <>
              <Marker
                coordinate={{
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                }}
                title="Geofence Center"
                pinColor={isInsideGeofence ? "#34C759" : "#FF3B30"}
              />
              <Circle
                center={{
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                }}
                radius={geofence.radius}
                strokeColor={isInsideGeofence ? "#34C759" : "#FF3B30"}
                fillColor={
                  isInsideGeofence
                    ? "rgba(52, 199, 89, 0.15)"
                    : "rgba(255, 59, 48, 0.15)"
                }
                strokeWidth={3}
              />
            </>
          )}
        </MapWrapper>
      </ErrorBoundary>

      <View
        style={[
          styles.controlsContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <View
          style={[
            styles.statusCard,
            { backgroundColor: statusBgColor, borderColor: statusColor },
          ]}
        >
          <View style={styles.statusHeader}>
            <IconSymbol
              name={
                geofence
                  ? isInsideGeofence
                    ? "checkmark.circle.fill"
                    : "xmark.circle.fill"
                  : "location.circle"
              }
              size={24}
              color={statusColor}
            />
            <ThemedText type="defaultSemiBold" style={styles.statusLabel}>
              Geofence Status
            </ThemedText>
          </View>
          <ThemedText style={[styles.statusText, { color: statusColor }]}>
            {geofence ? (isInsideGeofence ? "INSIDE" : "OUTSIDE") : "Not Set"}
          </ThemedText>
          {geofence && location && (
            <ThemedText style={styles.distanceText}>
              {calculateDistance(
                location.latitude,
                location.longitude,
                geofence.latitude,
                geofence.longitude
              ).toFixed(0)}
              m / {geofence.radius}m
            </ThemedText>
          )}
        </View>

        {location && (
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: theme.background,
                borderColor: theme.icon + "20",
              },
            ]}
          >
            <View style={styles.infoHeader}>
              <IconSymbol name="location.fill" size={20} color={theme.icon} />
              <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                Current Location
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Latitude:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {location.latitude.toFixed(6)}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Longitude:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {location.longitude.toFixed(6)}
              </ThemedText>
            </View>
            {location.accuracy && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Accuracy:</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {location.accuracy.toFixed(0)}m
                </ThemedText>
              </View>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={getCurrentLocation}
            activeOpacity={0.8}
          >
            <IconSymbol name="arrow.clockwise" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Refresh Location</Text>
          </TouchableOpacity>
          {geofence && (
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={clearGeofence}
              activeOpacity={0.8}
            >
              <IconSymbol name="trash.fill" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Clear Geofence</Text>
            </TouchableOpacity>
          )}
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    maxWidth: 400,
  },
  permissionIcon: {
    marginBottom: 24,
  },
  permissionTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  map: {
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
  statusCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2.5,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  statusLabel: {
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
  infoCard: {
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
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: "ui-monospace",
      default: "monospace",
    }),
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
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
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
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
