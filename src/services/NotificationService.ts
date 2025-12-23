import * as Notifications from "expo-notifications";
import { Alert } from "react-native";


class NotificationService {
  private initialized = false;


  initialize() {
    if (this.initialized) return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    this.initialized = true;
  }


  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Notification Permission",
          "Notification permission is recommended to receive geofence alerts.",
          [{ text: "OK" }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }


  async sendNotification(title: string, body: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

 
  async notifyGeofenceEntry(): Promise<void> {
    await this.sendNotification(
      "Entered Geofence",
      "You have entered the geofenced area!"
    );
  }


  async notifyGeofenceExit(): Promise<void> {
    await this.sendNotification(
      "Exited Geofence",
      "You have left the geofenced area!"
    );
  }
}

export const notificationService = new NotificationService();

