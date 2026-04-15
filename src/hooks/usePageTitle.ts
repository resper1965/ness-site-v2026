import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const BRAND = "ness.";

export function usePageTitle(titleKey: string, fallback?: string) {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const resolved = fallback ?? t(titleKey);
    document.title = `${resolved} — ${BRAND}`;
  }, [titleKey, fallback, t, i18n.language]);
}
