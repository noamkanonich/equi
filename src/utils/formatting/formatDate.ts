import { mapLocaleToIntlLocale } from "./mappers";

type FormatDateOptions = {
  locale?: string;
};

export const formatDate = (
  value: string,
  { locale = "en" }: FormatDateOptions = {},
) => {
  return new Intl.DateTimeFormat(mapLocaleToIntlLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

