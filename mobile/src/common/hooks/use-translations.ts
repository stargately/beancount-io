import { useReactiveVar } from "@apollo/client";
import { i18n } from "@/translations";
import { localeVar } from "@/common/vars";

/**
 * Hook that provides reactive translations that automatically re-render when locale changes
 */
export const useTranslations = () => {
  const locale = useReactiveVar(localeVar);

  // Make sure i18n locale is in sync
  if (i18n.locale !== locale) {
    i18n.locale = locale;
  }

  return {
    t: (key: string, params?: Record<string, unknown>) => i18n.t(key, params),
    locale,
  };
};
