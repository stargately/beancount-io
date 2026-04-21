import { LedgerSelectionScreen } from "@/screens/ledger-selection";
import { Stack } from "expo-router";
import React from "react";

export default function LedgerSelection() {
  return (
    <>
      <Stack.Screen options={{ title: "Ledger Selection" }} />
      <LedgerSelectionScreen />
    </>
  );
}
