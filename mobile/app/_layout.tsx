import { Slot } from "expo-router";
import SafeSceen from "../components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeSceen>
        <Slot />
      </SafeSceen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
