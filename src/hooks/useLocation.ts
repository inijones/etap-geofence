import { useEffect, useState } from "react";
import { LocationData } from "../types/geofence";
import { locationService } from "../services/LocationService";
import { notificationService } from "../services/NotificationService";
import * as Location from "expo-location";

/**
 * Custom hook for managing location tracking
 */
export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchSubscription, setWatchSubscription] =
    useState<Location.LocationSubscription | null>(null);

  /**
   * Request permissions and initialize location tracking
   */
  const requestPermissions = async () => {
    try {
      setIsLoading(true);

      const locationGranted = await locationService.requestPermissions();
      if (!locationGranted) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      await notificationService.requestPermissions();

      setHasPermission(true);
      await refreshLocation();
      startTracking();
    } catch (error) {
      console.error("Error in requestPermissions:", error);
      setIsLoading(false);
    }
  };

  /**
   * Get current location once
   */
  const refreshLocation = async () => {
    const currentLocation = await locationService.getCurrentLocation();
    if (currentLocation) {
      setLocation(currentLocation);
    }
    setIsLoading(false);
    return currentLocation;
  };

  /**
   * Start continuous location tracking
   */
  const startTracking = async () => {
    const subscription = await locationService.watchPosition((newLocation) => {
      setLocation(newLocation);
    });
    setWatchSubscription(subscription);
  };

  /**
   * Stop location tracking
   */
  const stopTracking = () => {
    locationService.stopWatching();
    setWatchSubscription(null);
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    location,
    hasPermission,
    isLoading,
    requestPermissions,
    refreshLocation,
    startTracking,
    stopTracking,
  };
};

