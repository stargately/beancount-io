import { createPersistentVar } from "@/common/apollo/persistent-var";

export const [localeVar, loadLocale] = createPersistentVar<string>(
  "locale",
  "en",
);
