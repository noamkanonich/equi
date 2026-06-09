import type { CurrencyCode } from "@/data/currencies/currency.types";
import { mapCurrencyFormatLocale } from "./mappers";
import { getCurrencySymbol } from "./getCurrencySymbol";

type FormatMoneyOptions = {
  locale?: string;
  compact?: boolean;
};

export const formatMoney = (
  amount: number,
  currency: CurrencyCode,
  { locale = "en", compact = false }: FormatMoneyOptions = {},
): string => {
  const formattedAmount = new Intl.NumberFormat(
    mapCurrencyFormatLocale(locale, currency),
    {
      notation: compact ? "compact" : "standard",
      minimumFractionDigits: compact ? 1 : 2,
      maximumFractionDigits: compact ? 1 : 2,
    },
  ).format(Math.abs(amount));

  const sign = amount < 0 ? "-" : "";

  return `${sign}${getCurrencySymbol(currency)}${formattedAmount}`;
};
