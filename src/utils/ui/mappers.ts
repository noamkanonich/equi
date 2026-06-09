import { format } from "date-fns";
import { enUS, he } from "date-fns/locale";

export { getDataFreshnessLabel } from "./getDataFreshnessLabel";
export { getDataFreshnessTone } from "./getDataFreshnessTone";

const localeMap = {
  en: enUS,
  he,
} as const;

export const formatStaleLastUpdated = (
  date: Date,
  locale: string,
): string => {
  const dateLocale = locale.startsWith("he") ? localeMap.he : localeMap.en;
  return format(date, "PPp", { locale: dateLocale });
};
