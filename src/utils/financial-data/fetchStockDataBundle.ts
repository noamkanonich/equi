import { apiClient } from "@/lib/api/api-client";
import { buildMockStockDataBundle } from "@/data/financial-data/financial-data.mock";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type { StockDataBundleResponse } from "@/data/financial-data/financial-data.types";

export const fetchStockDataBundle = async (symbol: string) => {
  const normalized = normalizeProviderSymbol(symbol);

  try {
    const response = await apiClient.get<StockDataBundleResponse>(
      `/api/stocks/${normalized}`,
      { params: { scope: "display" } },
    );
    return response.data.bundle;
  } catch {
    return buildMockStockDataBundle(normalized);
  }
};
