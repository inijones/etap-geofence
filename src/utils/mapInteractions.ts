import { Alert, Platform } from "react-native";
import { Coordinate } from "../types/geofence";

const RADIUS_OPTIONS = [50, 100, 500, 1000];

/**
 * Handle map press for iOS - shows native alert
 */
export const handleMapPressIOS = (
  coordinate: Coordinate,
  onSelectRadius: (latitude: number, longitude: number, radius: number) => void
) => {
  Alert.alert(
    "Set Geofence",
    "Do you want to set a geofence at this location?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      ...RADIUS_OPTIONS.map((radius) => ({
        text: `Set ${radius}m`,
        onPress: () => onSelectRadius(coordinate.latitude, coordinate.longitude, radius),
      })),
    ]
  );
};

/**
 * Handle map press for Android - returns coordinate for dialog
 */
export const handleMapPressAndroid = (coordinate: Coordinate): Coordinate => {
  return coordinate;
};

/**
 * Get radius options
 */
export const getRadiusOptions = (): number[] => {
  return RADIUS_OPTIONS;
};

