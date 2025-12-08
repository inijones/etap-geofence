/**
 * Geofence utility functions
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Geofence {
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Check if a coordinate is inside a geofence
 * @param coordinate The coordinate to check
 * @param geofence The geofence to check against
 * @returns true if the coordinate is inside the geofence
 */
export const isInsideGeofence = (
  coordinate: Coordinate,
  geofence: Geofence
): boolean => {
  const distance = calculateDistance(
    coordinate.latitude,
    coordinate.longitude,
    geofence.latitude,
    geofence.longitude
  );
  return distance <= geofence.radius;
};

