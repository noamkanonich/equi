"use client";

import { useMemo } from "react";
import type { EnsureStockDataOptions } from "@/data/app-data/app-data.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";
import { useEnsureStockSymbols } from "@/hooks/useEnsureStockSymbols";
import { useAppDataStore } from "@/store/app-data.store";
import { derivePageFreshnessStatus } from "@/utils/financial-data/derivePageFreshnessStatus";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";

export const usePageStockBundles = (
  symbols: Array<string | undefined | null>,
  options?: EnsureStockDataOptions,
): {
  bundles: Record<string, StockProviderDataBundle>;
  freshnessStatus: DataFreshnessStatus;
  isLoading: boolean;
} => {
  const normalizedSymbols = useMemo(
    () => collectUniqueSymbols(symbols),
    [symbols],
  );

  useEnsureStockSymbols(normalizedSymbols, options);

  const stockDataBySymbol = useAppDataStore((state) => state.stockDataBySymbol);
  const stockDataLoadingBySymbol = useAppDataStore(
    (state) => state.stockDataLoadingBySymbol,
  );

  const bundles = useMemo(() => {
    const result: Record<string, StockProviderDataBundle> = {};
    for (const symbol of normalizedSymbols) {
      const bundle = stockDataBySymbol[symbol];
      if (bundle) {
        result[symbol] = bundle;
      }
    }
    return result;
  }, [normalizedSymbols, stockDataBySymbol]);

  const isLoading = useMemo(
    () => normalizedSymbols.some((symbol) => stockDataLoadingBySymbol[symbol]),
    [normalizedSymbols, stockDataLoadingBySymbol],
  );

  const freshnessStatus = useMemo(
    () => derivePageFreshnessStatus(bundles, normalizedSymbols.length > 0 && isLoading),
    [bundles, isLoading, normalizedSymbols.length],
  );

  return { bundles, freshnessStatus, isLoading };
};
