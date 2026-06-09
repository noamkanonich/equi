/**
 * Data-layer entry point for stock mapping and lookup.
 * Re-exports utils used by UI and future API normalization.
 */
export { getStockAnalysisBySymbol } from "@/utils/stocks/getStockAnalysisBySymbol";
export { getStockScoreBySymbol } from "@/utils/scoring/getStockScoreBySymbol";
export {
  isStockAnalysisComplete,
  mapScoreToLabelKey,
  mergeStockAnalysis,
  normalizeStockSymbol,
} from "@/utils/stocks/mappers";
export {
  coreStockSymbols,
  getStockSymbolRegistryEntry,
  stockSymbolRegistry,
  supportedStockSymbols,
} from "@/utils/stocks/stockSymbolRegistry";
