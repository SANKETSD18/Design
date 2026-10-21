import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PipProvider } from "../Context/PipContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PipProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </PipProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
