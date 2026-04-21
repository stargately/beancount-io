import { PayeeInputScreen } from "@/screens/add-transaction-screen/payee-input-screen";
import { i18n } from "@/translations";
import { Stack } from "expo-router";
import React from "react";

export default function PayeeInput() {
  return (
    <>
      <Stack.Screen options={{ title: i18n.t("payee") }} />
      <PayeeInputScreen />
    </>
  );
}
