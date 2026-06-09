import { apiClient } from "@/lib/api/api-client";
import {
  mockFxRates,
  mockFxRatesMeta,
} from "@/data/currencies/currency.mock";
import type { CurrencyRatesResponse } from "@/data/currencies/currency.types";

export const getExchangeRates = async (): Promise<CurrencyRatesResponse> => {
  const response = await apiClient.get<CurrencyRatesResponse>(
    "/api/currency/rates",
  );
  return response.data;
};

export const getExchangeRatesWithFallback =
  async (): Promise<CurrencyRatesResponse> => {
    try {
      return await getExchangeRates();
    } catch {
      return {
        rates: mockFxRates,
        meta: {
          ...mockFxRatesMeta,
          lastUpdated: new Date().toISOString(),
        },
      };
    }
  };
