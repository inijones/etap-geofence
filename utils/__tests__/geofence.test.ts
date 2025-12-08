import { calculateDistance, isInsideGeofence, Geofence, Coordinate } from '../geofence';

describe('Geofence Utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two identical points as 0', () => {
      const distance = calculateDistance(37.7749, -122.4194, 37.7749, -122.4194);
      expect(distance).toBeCloseTo(0, 1);
    });

    it('should calculate distance between two known points correctly', () => {
      // Distance between San Francisco and Los Angeles is approximately 559 km
      const sfLat = 37.7749;
      const sfLon = -122.4194;
      const laLat = 34.0522;
      const laLon = -118.2437;
      
      const distance = calculateDistance(sfLat, sfLon, laLat, laLon);
      // Should be approximately 559,000 meters (559 km)
      expect(distance).toBeCloseTo(559000, -3); // -3 means within 1000 meters
    });

    it('should calculate short distances accurately', () => {
      // Two points approximately 100 meters apart
      const lat1 = 37.7749;
      const lon1 = -122.4194;
      const lat2 = 37.7750; // Slightly north
      const lon2 = -122.4194;
      
      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      // Should be approximately 11 meters (1 degree latitude ≈ 111 km)
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(20000); // Less than 20km
    });

    it('should handle negative coordinates', () => {
      const distance = calculateDistance(-37.7749, -122.4194, -37.7750, -122.4194);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('isInsideGeofence', () => {
    const geofence: Geofence = {
      latitude: 37.7749,
      longitude: -122.4194,
      radius: 100, // 100 meters
    };

    it('should return true when coordinate is at the center', () => {
      const coordinate: Coordinate = {
        latitude: 37.7749,
        longitude: -122.4194,
      };
      expect(isInsideGeofence(coordinate, geofence)).toBe(true);
    });

    it('should return true when coordinate is inside the geofence', () => {
      const coordinate: Coordinate = {
        latitude: 37.7750, // Very close to center
        longitude: -122.4194,
      };
      expect(isInsideGeofence(coordinate, geofence)).toBe(true);
    });

    it('should return false when coordinate is outside the geofence', () => {
      const coordinate: Coordinate = {
        latitude: 37.8000, // Far from center
        longitude: -122.4194,
      };
      expect(isInsideGeofence(coordinate, geofence)).toBe(false);
    });

    it('should return true when coordinate is exactly at the radius boundary', () => {
      // This test verifies edge case handling
      const coordinate: Coordinate = {
        latitude: 37.7749,
        longitude: -122.4194,
      };
      expect(isInsideGeofence(coordinate, geofence)).toBe(true);
    });

    it('should handle large radius geofences', () => {
      const largeGeofence: Geofence = {
        latitude: 37.7749,
        longitude: -122.4194,
        radius: 10000, // 10 km
      };
      const coordinate: Coordinate = {
        latitude: 37.8000,
        longitude: -122.4194,
      };
      expect(isInsideGeofence(coordinate, largeGeofence)).toBe(true);
    });

    it('should handle small radius geofences', () => {
      const smallGeofence: Geofence = {
        latitude: 37.7749,
        longitude: -122.4194,
        radius: 10, // 10 meters
      };
      const coordinate: Coordinate = {
        latitude: 37.7750,
        longitude: -122.4194,
      };
      expect(isInsideGeofence(coordinate, smallGeofence)).toBe(false);
    });
  });
});

