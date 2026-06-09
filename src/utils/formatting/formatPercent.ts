import { mapLocaleToIntlLocale } from "./mappers";

type FormatPercentOptions = {
  decimals?: number;
  locale?: string;
  showSign?: boolean;
};

export const formatPercent = (
  value: number,
  { decimals = 2, locale = "en", showSign = true }: FormatPercentOptions = {},
) => {
  const formattedValue = new Intl.NumberFormat(mapLocaleToIntlLocale(locale), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    signDisplay: showSign ? "exceptZero" : "auto",
  }).format(value);

  return `${formattedValue}%`;
};

