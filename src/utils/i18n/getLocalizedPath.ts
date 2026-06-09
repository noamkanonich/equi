import type { SupportedLocale } from "@/data/i18n/i18n.types";
import { routing } from "@/i18n/routing";

const stripLocalePrefix = (pathname: string): string => {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  for (const locale of routing.locales) {
    if (normalized === `/${locale}`) {
      return "/";
    }
    if (normalized.startsWith(`/${locale}/`)) {
      return normalized.slice(locale.length + 1) || "/";
    }
  }

  return normalized;
};

export const getLocalizedPath = (
  pathname: string,
  locale: SupportedLocale,
): string => {
  const base = stripLocalePrefix(pathname);
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
};
