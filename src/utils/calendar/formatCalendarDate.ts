import { mapLocaleToIntlLocale } from "@/utils/formatting/mappers";
import { mapIsoDateToLocalDate } from "./mappers";

type FormatCalendarDateOptions = {
  locale?: string;
  includeWeekday?: boolean;
};

export const formatCalendarDate = (
  value: string,
  { locale = "en", includeWeekday = false }: FormatCalendarDateOptions = {},
) => {
  return new Intl.DateTimeFormat(mapLocaleToIntlLocale(locale), {
    weekday: includeWeekday ? "short" : undefined,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(mapIsoDateToLocalDate(value));
};
