import { fetchStockDataForSymbols } from "@/utils/app-data/fetchStockDataForSymbols";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { collectUniqueSymbols } from "./collectUniqueSymbols";
import type { StockDataBundleScope } from "./getStockDataBundle";

export type FetchStockDataBundlesOptions = {
  scope?: StockDataBundleScope;
};

/**
 * @deprecated Use fetchStockDataForSymbols from @/utils/app-data/fetchStockDataForSymbols
 * or ensureStockDataForSymbols via useAppData.
 */
export const fetchStockDataBundles = async (
  symbols: string[],
  options?: FetchStockDataBundlesOptions,
): Promise<Record<string, StockProviderDataBundle>> => {
  const normalizedSymbols = collectUniqueSymbols(symbols);

  if (normalizedSymbols.length === 0) {
    return {};
  }

  return fetchStockDataForSymbols(normalizedSymbols, {
    scope: options?.scope ?? "display",
  });
};

export const fetchStockDataBundlesSafe = fetchStockDataBundles;
