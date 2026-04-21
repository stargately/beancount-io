import { i18n } from "@/translations";
import { themeVar } from "@/common/vars";
import { getSystemColorScheme } from "@/common/theme";

/**
 * Appends the current application language and theme as query parameters to a URL
 * @param url - The URL to append the lang and theme parameters to
 * @returns New URL with lang and theme parameters appended based on current i18n locale and theme
 */
export function appendPreferenceParam(url: string): string {
  try {
    const targetUrl = new URL(url);

    // Append language parameter
    const currentLocale = i18n.locale;
    if (currentLocale) {
      targetUrl.searchParams.set("lang", currentLocale);
    }

    // Append theme parameter
    const currentTheme = themeVar();
    const effectiveTheme =
      currentTheme === "system" ? getSystemColorScheme() : currentTheme;
    targetUrl.searchParams.set("theme", effectiveTheme);

    return targetUrl.toString();
  } catch {
    // If URL parsing fails, return original URL
    return url;
  }
}
