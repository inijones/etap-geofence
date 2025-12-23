import { useState } from "react";
import { Platform } from "react-native";
import { Coordinate } from "../types/geofence";
import { handleMapPressIOS } from "../utils/mapInteractions";

interface UseMapInteractionsProps {
  onSetGeofence: (latitude: number, longitude: number, radius: number) => void;
}


export const useMapInteractions = ({ onSetGeofence }: UseMapInteractionsProps) => {
  const [showRadiusDialog, setShowRadiusDialog] = useState<boolean>(false);
  const [pendingCoordinate, setPendingCoordinate] = useState<Coordinate | null>(null);


  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;

    if (Platform.OS === "android") {
      setPendingCoordinate(coordinate);
      setShowRadiusDialog(true);
    } else {
      handleMapPressIOS(coordinate, onSetGeofence);
    }
  };

  
  const handleRadiusSelect = (radius: number) => {
    if (pendingCoordinate) {
      onSetGeofence(pendingCoordinate.latitude, pendingCoordinate.longitude, radius);
      setPendingCoordinate(null);
    }
  };


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

