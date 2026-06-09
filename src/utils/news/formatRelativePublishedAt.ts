import { mapLocaleToIntlLocale } from "@/utils/formatting/mappers";

type FormatRelativePublishedAtOptions = {
  locale?: string;
};

export const formatRelativePublishedAt = (
  value: string,
  { locale = "en" }: FormatRelativePublishedAtOptions = {},
): string => {
  const publishedAt = new Date(value).getTime();
  const diffMs = Date.now() - publishedAt;
  const diffMinutes = Math.round(diffMs / (60 * 1000));

  if (diffMinutes < 1) {
    return new Intl.RelativeTimeFormat(mapLocaleToIntlLocale(locale), {
      numeric: "auto",
    }).format(0, "minute");
  }

  if (diffMinutes < 60) {
    return new Intl.RelativeTimeFormat(mapLocaleToIntlLocale(locale), {
      numeric: "auto",
    }).format(-diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return new Intl.RelativeTimeFormat(mapLocaleToIntlLocale(locale), {
      numeric: "auto",
    }).format(-diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return new Intl.RelativeTimeFormat(mapLocaleToIntlLocale(locale), {
    numeric: "auto",
  }).format(-diffDays, "day");
};
