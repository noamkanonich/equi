import type { CurrencyCode, CurrencyInfo, FxRates, FxRatesMeta } from "./currency.types";

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

export const supportedCurrencies: CurrencyInfo[] = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "ILS", symbol: "₪", label: "ILS" },
  { code: "EUR", symbol: "€", label: "EUR" },
];

export const mockFxRates: FxRates = {
  USD: {
    USD: 1,
    ILS: 3.68,
    EUR: 0.92,
  },
  ILS: {
    USD: 0.27,
    ILS: 1,
    EUR: 0.25,
  },
  EUR: {
    USD: 1.08,
    ILS: 4.0,
    EUR: 1,
  },
};

export const mockFxRatesMeta: FxRatesMeta = {
  source: "mock",
  base: "USD",
  isFallback: true,
  lastUpdated: new Date().toISOString(),
};
