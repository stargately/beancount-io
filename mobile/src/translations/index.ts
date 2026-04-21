import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { en } from "@/translations/en";
import { zh } from "@/translations/zh";
import { bg } from "@/translations/bg";
import { ca } from "@/translations/ca";
import { de } from "@/translations/de";
import { es } from "@/translations/es";
import { fa } from "@/translations/fa";
import { fr } from "@/translations/fr";
import { nl } from "@/translations/nl";
import { pt } from "@/translations/pt";
import { ru } from "@/translations/ru";
import { sk } from "@/translations/sk";
import { uk } from "@/translations/uk";

const SUPPORTED_LOCALES = [
  "en",
  "zh",
  "bg",
  "ca",
  "de",
  "es",
  "fa",
  "fr",
  "nl",
  "pt",
  "ru",
  "sk",
  "uk",
];

const getLocale = () => {
  const locales = Localization.getLocales();
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    if (
      locale.languageCode &&
      SUPPORTED_LOCALES.includes(locale.languageCode)
    ) {
      return locale.languageCode;
    }
  }
  return "en";
};

export const i18n = new I18n({
  en,
  zh,
  bg,
  ca,
  de,
  es,
  fa,
  fr,
  nl,
  pt,
  ru,
  sk,
  uk,
});
i18n.enableFallback = true;

export const setLocale = (locale: string) => {
  i18n.locale = locale;
};

i18n.locale = getLocale();
