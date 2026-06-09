import { apiClient } from "@/lib/api/api-client";
import { buildMockStockDataBundle } from "@/data/financial-data/financial-data.mock";
import type {
  FinancialDataSection,
  StockDataBundlesResponse,
  StockProviderDataBundle,
} from "@/data/financial-data/financial-data.types";
import { logAppDataDebug } from "@/utils/app-data/devAppDataLog";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import { STOCK_BUNDLES_MAX_SYMBOLS } from "@/utils/financial-data/stock-bundle.schema";
import type { StockDataScope } from "@/data/app-data/app-data.types";

const DEFAULT_DISPLAY_SECTIONS: FinancialDataSection[] = ["quote", "profile"];

export type FetchStockDataForSymbolsOptions = {
  scope?: StockDataScope;
  sections?: FinancialDataSection[];
};

const chunkSymbols = (symbols: string[]): string[][] => {
  const chunks: string[][] = [];

  for (let index = 0; index < symbols.length; index += STOCK_BUNDLES_MAX_SYMBOLS) {
    chunks.push(symbols.slice(index, index + STOCK_BUNDLES_MAX_SYMBOLS));
  }

  return chunks;
};

export const fetchStockDataForSymbols = async (
  symbols: string[],
  options?: FetchStockDataForSymbolsOptions,
): Promise<Record<string, StockProviderDataBundle>> => {
  const normalizedSymbols = collectUniqueSymbols(symbols);

  if (normalizedSymbols.length === 0) {
    return {};
  }

  const scope = options?.scope ?? "display";
  const sections = options?.sections ?? DEFAULT_DISPLAY_SECTIONS;
  const mergedBundles: Record<string, StockProviderDataBundle> = {};

  const chunks = chunkSymbols(normalizedSymbols);

  logAppDataDebug("client batch requests", {
    symbolCount: normalizedSymbols.length,
    batchCount: chunks.length,
    sections: sections.join(","),
  });

  for (const chunk of chunks) {
    try {
      const response = await apiClient.get<StockDataBundlesResponse>("/api/stocks", {
        params: {
          symbols: chunk.join(","),
          scope,
          sections: sections.join(","),
        },
      });

      Object.assign(mergedBundles, response.data.bundles);
    } catch {
      for (const symbol of chunk) {
        mergedBundles[symbol] = buildMockStockDataBundle(symbol);
      }
    }
  }

  for (const symbol of normalizedSymbols) {
    if (!mergedBundles[symbol]) {
      mergedBundles[symbol] = buildMockStockDataBundle(symbol);
    }
  }

  return mergedBundles;
};
