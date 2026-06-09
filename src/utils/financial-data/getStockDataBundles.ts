import "server-only";

import { buildMockStockDataBundle } from "@/data/financial-data/financial-data.mock";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type { FinancialDataSection } from "@/data/financial-data/financial-data.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import {
  logBatchCacheStats,
  resetBatchCacheStats,
  resolveRequestedSections,
} from "@/lib/financial-data/stock-data-cache";
import {
  getStockDataBundleForBatch,
  type GetStockDataBundleOptions,
  type StockDataBundleScope,
} from "./getStockDataBundle";

const SYMBOL_BATCH_SIZE = 3;

export type GetStockDataBundlesOptions = {
  scope?: StockDataBundleScope;
  sections?: FinancialDataSection[];
};

export const getStockDataBundles = async (
  symbols: string[],
  options?: GetStockDataBundlesOptions,
): Promise<Record<string, StockProviderDataBundle>> => {
  const requestedSymbols = symbols.map((symbol) => normalizeProviderSymbol(symbol));
  const normalizedSymbols = [...new Set(requestedSymbols)];

  if (normalizedSymbols.length === 0) {
    return {};
  }

  const bundleOptions: GetStockDataBundleOptions = {
    scope: options?.scope ?? "display",
    sections: options?.sections,
  };
  const requestedSections = resolveRequestedSections({
    scope: bundleOptions.scope,
    sections: bundleOptions.sections,
  });

  resetBatchCacheStats(requestedSymbols, normalizedSymbols, requestedSections);

  const bundles: Record<string, StockProviderDataBundle> = {};

  for (let index = 0; index < normalizedSymbols.length; index += SYMBOL_BATCH_SIZE) {
    const symbolBatch = normalizedSymbols.slice(index, index + SYMBOL_BATCH_SIZE);

    const settled = await Promise.allSettled(
      symbolBatch.map(async (symbol) => ({
        symbol,
        bundle: await getStockDataBundleForBatch(symbol, bundleOptions),
      })),
    );

    settled.forEach((result, batchIndex) => {
      const symbol = symbolBatch[batchIndex];

      if (result.status === "fulfilled") {
        bundles[result.value.symbol] = result.value.bundle;
        return;
      }

      bundles[symbol] = buildMockStockDataBundle(symbol);
    });
  }

  logBatchCacheStats();

  return bundles;
};
