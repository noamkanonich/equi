import type { CurrencyCode, FxRates } from "@/data/currencies/currency.types";
import { convertCurrency } from "./convertCurrency";
import { formatMoney } from "./formatMoney";

export type DisplayMoneyLines = {
  primary: string;
  secondary?: string;
  showSecondary: boolean;
};

type GetDisplayMoneyParams = {
  amount: number;
  originalCurrency: CurrencyCode;
  displayCurrency: CurrencyCode;
  locale: string;
  fxRates: FxRates;
};

export const getDisplayMoney = ({
  amount,
  originalCurrency,
  displayCurrency,
  locale,
  fxRates,
}: GetDisplayMoneyParams): DisplayMoneyLines => {
  const convertedAmount = convertCurrency({
    amount,
    fromCurrency: originalCurrency,
    toCurrency: displayCurrency,
    fxRates,
  });

  const primary = formatMoney(convertedAmount, displayCurrency, { locale });

  if (originalCurrency === displayCurrency) {
    return { primary, showSecondary: false };
  }

  const secondary = formatMoney(amount, originalCurrency, { locale });

  return {
    primary,
    secondary,
    showSecondary: true,
  };
};
