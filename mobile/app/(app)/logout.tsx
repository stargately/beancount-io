import { LogoutScreen } from "@/screens/setting/logout-screen";
import { Stack } from "expo-router";

export default function Logout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LogoutScreen />
    </>
  );
}
