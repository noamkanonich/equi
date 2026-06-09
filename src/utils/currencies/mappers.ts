import { mapLocaleToIntlLocale } from "@/utils/formatting/mappers";
import type { CurrencyCode } from "@/data/currencies/currency.types";

export const mapCurrencyCodeToIntlCode = (currency: CurrencyCode): string => {
  return currency;
};

export const mapCurrencyFormatLocale = (
  locale: string,
  currency: CurrencyCode,
): string => {
  if (currency === "ILS" && locale === "he") {
    return "he-IL";
  }

  return mapLocaleToIntlLocale(locale);
};

// TODO: mapFrankfurterResponseToCurrencyRates — normalize Frankfurter (or other FX provider) into CurrencyRatesResponse
