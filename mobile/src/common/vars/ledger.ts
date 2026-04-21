import { createPersistentVar } from "@/common/apollo/persistent-var";

export const [ledgerVar, loadLedger] = createPersistentVar<string | null>(
  "ledgerId",
  null,
);
