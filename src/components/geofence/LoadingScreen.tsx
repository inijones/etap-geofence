import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export const LoadingScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={theme.tint} />
      <ThemedText style={styles.text}>Loading location...</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
});

