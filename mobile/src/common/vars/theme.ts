import { createPersistentVar } from "@/common/apollo/persistent-var";

export type Theme = "light" | "dark" | "system";

export const [themeVar, loadTheme] = createPersistentVar<Theme>(
  "theme",
  "system",
);
