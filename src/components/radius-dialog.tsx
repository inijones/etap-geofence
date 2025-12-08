import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

interface RadiusDialogProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (radius: number) => void;
}

const RADIUS_OPTIONS = [50, 100, 500, 1000];

export function RadiusDialog({ visible, onClose, onSelect }: RadiusDialogProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const handleSelect = (radius: number) => {
    onSelect(radius);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.dialog, { backgroundColor: theme.background }]}>
          <ThemedText type="title" style={styles.title}>
            Select Geofence Radius
          </ThemedText>
          
          <ThemedText style={styles.subtitle}>
            Choose the radius for your geofence area
          </ThemedText>

          <View style={styles.optionsContainer}>
            {RADIUS_OPTIONS.map((radius) => (
              <TouchableOpacity
                key={radius}
                style={[
                  styles.optionButton,
                  { 
                    backgroundColor: "#35B2E6",
                    borderColor: "#35B2E6",
                  },
                ]}
                onPress={() => handleSelect(radius)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionText}>{radius}m</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.icon + "40" }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialog: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  cancelButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});

