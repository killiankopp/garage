import { Stack } from "expo-router";
import ApiCredentialsGate from "./ApiCredentialsGate";

export default function RootLayout() {
  return (
    <ApiCredentialsGate>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ApiCredentialsGate>
  );
}
