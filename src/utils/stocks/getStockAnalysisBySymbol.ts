import { stockAnalysisMockMap } from "@/data/stocks/stock-analysis.mock";
import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import { applyScoringToStockAnalysis } from "@/utils/stocks/applyScoringToStockAnalysis";
import { getStockAnalysisFallback } from "@/utils/stocks/buildStockAnalysisFallback";
import {
  isStockAnalysisComplete,
  mergeStockAnalysis,
  normalizeStockSymbol,
} from "@/utils/stocks/mappers";
import { getStockSymbolRegistryEntry } from "@/utils/stocks/stockSymbolRegistry";

export const getStockAnalysisBySymbol = (symbol: string): StockAnalysisData => {
  const normalized = normalizeStockSymbol(symbol);
  const registry = getStockSymbolRegistryEntry(normalized);

  const hasMockRecord = Boolean(stockAnalysisMockMap[normalized]);

  const fallback = getStockAnalysisFallback({
    symbol: normalized,
    companyName: registry?.companyName,
    logoUrl: registry?.logoUrl,
    sector: registry?.sector,
    currentPrice: registry?.defaultPrice,
    useGenericCopy: !hasMockRecord,
  });

  const record = stockAnalysisMockMap[normalized];

  if (!record) {
    return applyScoringToStockAnalysis(fallback);
  }

  if (isStockAnalysisComplete(record)) {
    return applyScoringToStockAnalysis(record);
  }

  return applyScoringToStockAnalysis(mergeStockAnalysis(record, fallback));
};
