import { getCurrencyByCode } from "@/data/currencies/mappers";
import type { CurrencyCode } from "@/data/currencies/currency.types";

export const getCurrencySymbol = (currency: CurrencyCode): string => {
  return getCurrencyByCode(currency)?.symbol ?? currency;
};
