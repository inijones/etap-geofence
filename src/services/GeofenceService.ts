import { Alert } from "react-native";
import { Geofence, LocationData } from "../types/geofence";
import { calculateDistance } from "../utils/distance";
import { notificationService } from "./NotificationService";

/**
 * Geofence Service
 * Handles geofence-related operations and status checking
 */
class GeofenceService {
  /**
   * Check if a location is inside a geofence
   */
  isInsideGeofence(location: LocationData, geofence: Geofence): boolean {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      geofence.latitude,
      geofence.longitude
    );
    return distance <= geofence.radius;
  }

  /**
   * Get distance from location to geofence center
   */
  getDistanceToGeofence(
    location: LocationData,
    geofence: Geofence
  ): number {
    return calculateDistance(
      location.latitude,
      location.longitude,
      geofence.latitude,
      geofence.longitude
    );
  }

  /**
   * Check geofence status and trigger notifications if status changed
   */
  async checkGeofenceStatus(
    location: LocationData,
    geofence: Geofence,
    wasInside: boolean
  ): Promise<boolean> {
    const nowInside = this.isInsideGeofence(location, geofence);

    if (wasInside !== nowInside) {
      if (nowInside) {
        await notificationService.notifyGeofenceEntry();
        Alert.alert("Geofence Alert", "You have entered the geofenced area!");
      } else {
        await notificationService.notifyGeofenceExit();
        Alert.alert("Geofence Alert", "You have left the geofenced area!");
      }
    }

    return nowInside;
  }

  /**
   * Get geofence status color
   */
  getStatusColor(geofence: Geofence | null, isInside: boolean, defaultColor: string): string {
    if (!geofence) return defaultColor;
    return isInside ? "#34C759" : "#FF3B30";
  }

  /**
   * Get geofence status background color
   */
  getStatusBackgroundColor(
    geofence: Geofence | null,
    isInside: boolean
  ): string {
    if (!geofence) return "transparent";
    return isInside
      ? "rgba(52, 199, 89, 0.1)"
      : "rgba(255, 59, 48, 0.1)";
  }

  /**
   * Get geofence status text
   */
  getStatusText(geofence: Geofence | null, isInside: boolean): string {
    if (!geofence) return "Not Set";
    return isInside ? "INSIDE" : "OUTSIDE";
  }

  /**
   * Get geofence status icon name
   */
  getStatusIconName(geofence: Geofence | null, isInside: boolean): string {
    if (!geofence) return "location.circle";
    return isInside ? "checkmark.circle.fill" : "xmark.circle.fill";
  }
}

export const geofenceService = new GeofenceService();

