require('dotenv').config();

module.exports = {
  expo: {
    name: "etap-geofence-app",
    slug: "etap-geofence-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "etapgeofenceapp",
    newArchEnabled: true,
    experiments: {
      reactCompiler: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        backgroundImage: "./assets/images/android-icon-background.png",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
        }
      },
      edgeToEdgeEnabled: true,
      package: "com.etap.geofenceapp",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      predictiveBackGestureEnabled: false
    },
    ios: {
      appleTeamId: "6V9NF9Z6W8",
      bundleIdentifier: "com.etap.geofenceapp",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
      },
      infoPlist: {
        NSLocationAlwaysAndWhenInUseUsageDescription: "This app needs access to your location to track your position and set geofences.",
        NSLocationWhenInUseUsageDescription: "This app needs access to your location to track your position and set geofences."
      },
      supportsTablet: true
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          },
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain"
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location to track your position and set geofences."
        }
      ],
      [
        "expo-notifications",
        {
          color: "#ffffff",
          icon: "./assets/images/icon.png"
        }
      ]
    ],
    web: {
      favicon: "./assets/images/favicon.png",
      output: "static"
    }
  }
};

