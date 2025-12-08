import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HapticTab } from "./src/components/haptic-tab";
import { Colors } from "./src/constants/theme";
import { useColorScheme } from "./src/hooks/use-color-scheme";
import ExploreScreen from "./src/screens/ExploreScreen";
import GeofenceScreen from "./src/screens/GeofenceScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [showOnboarding, setShowOnboarding] = useState(true);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Show onboarding for 5 seconds
    const timer = setTimeout(() => {
      setShowOnboarding(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#35B2E6",
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: {
              backgroundColor: theme.background,
              borderTopColor: theme.icon + "20",
              borderTopWidth: 1,
              paddingTop: 8,
              paddingBottom: 8,
              height: 70,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: "Poppins-SemiBold",
            },
          }}
        >
          <Tab.Screen
            name="Geofence"
            component={GeofenceScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("./assets/icon/map.png")}
                  style={{ width: 28, height: 28 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Explore"
            component={ExploreScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image
                  source={require("./assets/icon/space_exploration.png")}
                  style={{ width: 28, height: 28 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
