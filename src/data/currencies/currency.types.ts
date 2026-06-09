export type CurrencyCode = "USD" | "ILS" | "EUR";

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  label: string;
};

export type MoneyValue = {
  amount: number;
  currency: CurrencyCode;
};

export type FxRates = Record<CurrencyCode, Record<CurrencyCode, number>>;

export type FxRatesMeta = {
  source: "frankfurter" | "mock";
  base: CurrencyCode;
  date?: string;
  isFallback: boolean;
  lastUpdated?: string;
};

export type CurrencyRatesResponse = {
  rates: FxRates;
  meta: FxRatesMeta;
};
