"use client";

import { useCurrencyRates } from "@/hooks/useCurrencyRates";

export const CurrencyRatesBootstrap = () => {
  useCurrencyRates();
  return null;
};
