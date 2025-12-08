#!/bin/bash

# Development Build Script for Geofence App
# This builds the app with all native modules (including react-native-maps)

echo "🚀 Building Development Client for Geofence App"
echo ""
echo "This will build the app with native modules (maps, location, etc.)"
echo "First build may take 5-15 minutes. Please be patient!"
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is for macOS. For Android, use: npx expo run:android --device"
    exit 1
fi

# Check for connected iOS device
echo "📱 Checking for connected iOS device..."
DEVICES=$(xcrun xctrace list devices 2>&1 | grep -i "iphone\|ipad" | grep -v "Simulator" | wc -l)

if [ "$DEVICES" -eq 0 ]; then
    echo "⚠️  No iOS device detected."
    echo ""
    echo "Please:"
    echo "1. Connect your iPhone to your Mac via USB"
    echo "2. Unlock your iPhone"
    echo "3. Trust this computer if prompted"
    echo "4. Run this script again"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔨 Starting build process..."
echo "This will:"
echo "  - Build the iOS app with all native modules"
echo "  - Install it on your connected iPhone"
echo "  - Start the development server"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "🏗️  Building and installing on device..."
npx expo run:ios --device

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful! The app should now be on your iPhone."
    echo ""
    echo "📱 Next steps:"
    echo "1. Open the app on your iPhone (it should open automatically)"
    echo "2. Grant location permissions when prompted"
    echo "3. The development server should be running"
    echo ""
    echo "🔄 To restart the dev server later, run:"
    echo "   npm run start:dev"
    echo "   or"
    echo "   npx expo start --dev-client"
else
    echo ""
    echo "❌ Build failed. Check the error messages above."
    echo ""
    echo "Common issues:"
    echo "- Make sure your iPhone is unlocked and trusted"
    echo "- Check that Xcode is properly installed"
    echo "- Try: xcode-select --print-path"
fi

