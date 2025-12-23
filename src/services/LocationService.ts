import * as Location from "expo-location";
import { Alert } from "react-native";
import { LocationData } from "../types/geofence";

/**
 * Location Service
 * Handles all location-related operations
 */
class LocationService {
  private watchSubscription: Location.LocationSubscription | null = null;

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this app.",
          [{ text: "OK" }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      Alert.alert("Error", "Failed to request permissions");
      return false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location");
      return null;
    }
  }

  /**
   * Start watching location changes
   */
  async watchPosition(
    onLocationUpdate: (location: LocationData) => void
  ): Promise<Location.LocationSubscription> {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (newLocation) => {
        onLocationUpdate({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          accuracy: newLocation.coords.accuracy,
        });
      }
    );

    this.watchSubscription = subscription;
    return subscription;
  }

  /**
   * Stop watching location changes
   */
  stopWatching(): void {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  /**
   * Get map region from location
   */
  getMapRegion(location: LocationData) {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }
}

export const locationService = new LocationService();

