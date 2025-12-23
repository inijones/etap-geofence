import { useCallback, useEffect, useState } from "react";
import { locationService } from "../services/LocationService";
import { notificationService } from "../services/NotificationService";
import { LocationData } from "../types/geofence";

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshLocation = useCallback(async () => {
    const currentLocation = await locationService.getCurrentLocation();
    if (currentLocation) {
      setLocation(currentLocation);
    }
    setIsLoading(false);
    return currentLocation;
  }, []);

  const startTracking = useCallback(async () => {
    await locationService.watchPosition((newLocation) => {
      setLocation(newLocation);
    });
  }, []);

  const requestPermissions = useCallback(async () => {
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
  }, [refreshLocation, startTracking]);

  const stopTracking = useCallback(() => {
    locationService.stopWatching();
  }, []);

  useEffect(() => {
    requestPermissions();
    return () => {
      stopTracking();
    };
  }, [requestPermissions, stopTracking]);

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
