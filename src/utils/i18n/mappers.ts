import type { SupportedLocale } from "@/data/i18n/i18n.types";

export const mapLocaleToDisplayCode = (locale: SupportedLocale): string => {
  if (locale === "he") return "HE";
  return "EN";
};
