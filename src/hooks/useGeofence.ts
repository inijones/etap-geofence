import { useEffect, useState } from "react";
import { Geofence, LocationData } from "../types/geofence";
import { geofenceService } from "../services/GeofenceService";

/**
 * Custom hook for managing geofence state and status
 */
export const useGeofence = (location: LocationData | null) => {
  const [geofence, setGeofence] = useState<Geofence | null>(null);
  const [isInside, setIsInside] = useState<boolean>(false);

  /**
   * Set a new geofence
   */
  const setGeofenceAt = (latitude: number, longitude: number, radius: number) => {
    setGeofence({ latitude, longitude, radius });
    setIsInside(false);
  };

  /**
   * Clear the current geofence
   */
  const clearGeofence = () => {
    setGeofence(null);
    setIsInside(false);
  };

  /**
   * Check geofence status when location or geofence changes
   */
  useEffect(() => {
    if (location && geofence) {
      geofenceService
        .checkGeofenceStatus(location, geofence, isInside)
        .then((nowInside) => {
          setIsInside(nowInside);
        });
    } else if (!geofence) {
      setIsInside(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, geofence]);

  /**
   * Get distance to geofence center
   */
  const getDistance = (): number | null => {
    if (!location || !geofence) return null;
    return geofenceService.getDistanceToGeofence(location, geofence);
  };

  return {
    geofence,
    isInside,
    setGeofenceAt,
    clearGeofence,
    getDistance,
  };
};

