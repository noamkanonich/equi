import type { CurrencyCode, FxRates } from "@/data/currencies/currency.types";

type ConvertCurrencyParams = {
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  fxRates: FxRates;
};

export const convertCurrency = ({
  amount,
  fromCurrency,
  toCurrency,
  fxRates,
}: ConvertCurrencyParams): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rate = fxRates[fromCurrency]?.[toCurrency];

  if (rate === undefined) {
    return amount;
  }

  return amount * rate;
};
