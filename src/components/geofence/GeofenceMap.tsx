import { Platform, StyleSheet } from "react-native";
import { Geofence, LocationData } from "../../types/geofence";
import { ErrorBoundary } from "../error-boundary";
import { Circle, MapWrapper, Marker, PROVIDER_GOOGLE } from "../map-wrapper";
import { locationService } from "../../services/LocationService";

interface GeofenceMapProps {
  location: LocationData | null;
  geofence: Geofence | null;
  isInsideGeofence: boolean;
  onMapPress: (event: any) => void;
  mapRef: React.RefObject<any>;
}

export const GeofenceMap = ({
  location,
  geofence,
  isInsideGeofence,
  onMapPress,
  mapRef,
}: GeofenceMapProps) => {
  return (
    <ErrorBoundary>
      <MapWrapper
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={onMapPress}
        initialRegion={
          location ? locationService.getMapRegion(location) : undefined
        }
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description={`Accuracy: ${
              location.accuracy?.toFixed(0) || "N/A"
            }m`}
          />
        )}
        {geofence && (
          <>
            <Marker
              coordinate={{
                latitude: geofence.latitude,
                longitude: geofence.longitude,
              }}
              title="Geofence Center"
              pinColor={isInsideGeofence ? "#34C759" : "#FF3B30"}
            />
            <Circle
              center={{
                latitude: geofence.latitude,
                longitude: geofence.longitude,
              }}
              radius={geofence.radius}
              strokeColor={isInsideGeofence ? "#34C759" : "#FF3B30"}
              fillColor={
                isInsideGeofence
                  ? "rgba(52, 199, 89, 0.15)"
                  : "rgba(255, 59, 48, 0.15)"
              }
              strokeWidth={3}
            />
          </>
        )}
      </MapWrapper>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

