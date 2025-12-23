import { useState } from "react";
import { Platform } from "react-native";
import { Coordinate } from "../types/geofence";
import { handleMapPressIOS } from "../utils/mapInteractions";

interface UseMapInteractionsProps {
  onSetGeofence: (latitude: number, longitude: number, radius: number) => void;
}

/**
 * Custom hook for handling map interactions
 */
export const useMapInteractions = ({ onSetGeofence }: UseMapInteractionsProps) => {
  const [showRadiusDialog, setShowRadiusDialog] = useState<boolean>(false);
  const [pendingCoordinate, setPendingCoordinate] = useState<Coordinate | null>(null);

  /**
   * Handle map press event
   */
  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;

    if (Platform.OS === "android") {
      setPendingCoordinate(coordinate);
      setShowRadiusDialog(true);
    } else {
      handleMapPressIOS(coordinate, onSetGeofence);
    }
  };

  /**
   * Handle radius selection from dialog
   */
  const handleRadiusSelect = (radius: number) => {
    if (pendingCoordinate) {
      onSetGeofence(pendingCoordinate.latitude, pendingCoordinate.longitude, radius);
      setPendingCoordinate(null);
    }
  };

  /**
   * Close radius dialog
   */
  const closeRadiusDialog = () => {
    setShowRadiusDialog(false);
    setPendingCoordinate(null);
  };

  return {
    showRadiusDialog,
    handleMapPress,
    handleRadiusSelect,
    closeRadiusDialog,
  };
};

