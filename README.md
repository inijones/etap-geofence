# Geofencing Mobile App

A React Native geofencing application built with Expo that allows users to set circular boundaries (geofences) on a map and receive notifications when entering or exiting these areas.

## Features

- ✅ **Location Permission Management**: Requests and handles location permissions gracefully
- ✅ **Real-time Location Tracking**: Continuously tracks user's location with high accuracy
- ✅ **Interactive Map**: Uses React Native Maps to display user location and geofences
- ✅ **Geofence Creation**: Tap anywhere on the map to set a geofence with customizable radius (100m, 500m, 1000m)
- ✅ **Entry/Exit Detection**: Accurately detects when user enters or exits the geofenced area
- ✅ **Notifications**: Triggers alerts and notifications when geofence events occur
- ✅ **Visual Feedback**: Color-coded geofence visualization (green when inside, red when outside)
- ✅ **Distance Display**: Shows real-time distance from geofence center

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS development: [Xcode](https://developer.apple.com/xcode/) (macOS only)
- For Android development: [Android Studio](https://developer.android.com/studio)

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd etap-geofence-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install required packages** (if not already installed):
   ```bash
   npm install expo-location expo-notifications react-native-maps
   ```

## Configuration

### iOS Configuration

The app is already configured with location permissions in `app.json`. For iOS, you may need to:

1. Open the project in Xcode (if building natively)
2. Ensure location permissions are properly set in Info.plist

### Android Configuration

Android permissions are configured in `app.json`. The app requests:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION` (for future background tracking)

### Google Maps API Key (Android)

For Android, you'll need a Google Maps API key:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps SDK for Android
3. Add the API key to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_API_KEY_HERE"
        }
      }
    }
  }
}
```

**Note**: For development with Expo Go, you can test without an API key, but for production builds, you'll need one.

## Running the App

### Development Mode

1. **Start the Expo development server**:
   ```bash
   npm start
   # or
   npx expo start
   ```

2. **Run on a device/simulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go app on your physical device

### Platform-Specific Commands

```bash
# iOS
npm run ios

# Android
npm run android

# Web (limited functionality)
npm run web
```

## Usage

### Setting Up a Geofence

1. **Grant Permissions**: When you first open the app, grant location and notification permissions.

2. **View Your Location**: The app will automatically center the map on your current location.

3. **Set a Geofence**:
   - Tap anywhere on the map
   - Choose a radius: 100m, 500m, or 1000m
   - A circular geofence will appear on the map

4. **Monitor Status**:
   - The status indicator shows "INSIDE" (green) or "OUTSIDE" (red)
   - Real-time distance from the geofence center is displayed
   - Notifications and alerts trigger automatically when entering/exiting

### Features Overview

- **Refresh Location**: Tap "Refresh Location" to get your current position
- **Clear Geofence**: Tap "Clear Geofence" to remove the active geofence
- **Visual Indicators**:
  - Blue marker: Your current location
  - Red marker: Geofence center
  - Red circle: Geofence boundary (when outside)
  - Green circle: Geofence boundary (when inside)

## Project Structure

```
etap-geofence-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main geofencing screen
│   │   └── _layout.tsx        # Tab navigation layout
│   └── _layout.tsx            # Root layout
├── components/                # Reusable components
├── utils/
│   └── geofence.ts           # Geofence utility functions
├── app.json                   # Expo configuration
└── package.json              # Dependencies
```

## Technical Implementation

### Geofencing Logic

The app uses the **Haversine formula** to calculate the distance between the user's location and the geofence center:

```typescript
distance = 2 * R * atan2(√a, √(1-a))
```

Where:
- `R` = Earth's radius (6,371,000 meters)
- `a` = sin²(Δφ/2) + cos(φ1) * cos(φ2) * sin²(Δλ/2)

### Location Tracking

- **Update Frequency**: Every 5 seconds or every 10 meters (whichever comes first)
- **Accuracy**: High accuracy mode for precise tracking
- **Background**: Currently supports foreground tracking (background can be added)

### Notification System

- Uses Expo Notifications API
- Triggers immediately on geofence entry/exit
- Shows both native alerts and push notifications

## Testing

### Unit Tests

Run the unit tests for geofence utilities:

```bash
npm test
```

The test suite includes:
- Distance calculation accuracy tests
- Geofence boundary detection tests
- Edge case handling (boundary conditions, large/small radii)

### Manual Testing Checklist

- [ ] Location permission request works correctly
- [ ] Map displays user location accurately
- [ ] Geofence can be set by tapping the map
- [ ] Geofence visualization appears correctly
- [ ] Entry detection triggers notification
- [ ] Exit detection triggers notification
- [ ] Status indicator updates correctly
- [ ] Distance calculation is accurate
- [ ] Clear geofence button works
- [ ] Refresh location button works

### Testing on Physical Devices

**Important**: For accurate geofencing testing, use a physical device:
- Simulators/emulators may not provide accurate location data
- Physical movement is required to test entry/exit detection

## Troubleshooting

### Location Not Updating

- Ensure location permissions are granted
- Check that location services are enabled on your device
- Try refreshing the location manually

### Map Not Displaying

- **Android**: Ensure Google Maps API key is configured
- **iOS**: Check that location permissions are granted
- Try restarting the Expo development server

### Notifications Not Working

- Grant notification permissions when prompted
- Check device notification settings
- Ensure app is in foreground (for current implementation)

### Geofence Not Triggering

- Ensure you're actually moving in/out of the geofence
- Check that the geofence radius is appropriate for your movement
- Verify location tracking is active (blue dot should be moving)

## Future Enhancements

Potential improvements for production:

- [ ] Background location tracking
- [ ] Multiple geofences support
- [ ] Geofence persistence (save/load)
- [ ] Custom radius input
- [ ] Geofence history/logs
- [x] Unit tests (basic implementation)
- [ ] Integration tests
- [ ] Performance optimizations
- [ ] Battery usage optimization

## Dependencies

- **expo**: ~54.0.26 - Expo framework
- **expo-location**: Location services
- **expo-notifications**: Push notifications
- **react-native-maps**: Map display component
- **react-native**: 0.81.5 - React Native framework

## License

This project is created for assessment purposes.

## Support

For issues or questions, please refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)

---

**Note**: This app requires location permissions and works best on physical devices for accurate geofencing detection.
