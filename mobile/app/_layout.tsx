import { Slot } from "expo-router";
import { Providers } from "@/common/providers/providers";

export default function RootLayout() {
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
