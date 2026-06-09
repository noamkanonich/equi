export {
  buildFinancialDataMeta,
  normalizeProviderSymbol,
} from "@/data/financial-data/mappers";

export {
  getStockDataBundle,
  type GetStockDataBundleOptions,
  type StockDataBundleScope,
} from "./getStockDataBundle";
export {
  getStockDataBundles,
  type GetStockDataBundlesOptions,
} from "./getStockDataBundles";
export { getStockQuote } from "./getStockQuote";
export { getStockNews } from "./getStockNews";
export { getStockEarnings } from "./getStockEarnings";
export { getAnalystTargets } from "./getAnalystTargets";
export { fetchStockDataBundle } from "./fetchStockDataBundle";
export { fetchStockDataBundles } from "./fetchStockDataBundles";
export { collectUniqueSymbols } from "./collectUniqueSymbols";
export { derivePageFreshnessStatus } from "./derivePageFreshnessStatus";
export {
  deriveDataSourceSummary,
  deriveDataSourceSummaryFromBundle,
} from "./deriveDataSourceSummary";
export type { DataSourceDetailKey, DataSourceSummary } from "./deriveDataSourceSummary";
export {
  mergeStockQuoteIntoHolding,
  type StockQuoteEnrichable,
} from "./mergeStockQuoteIntoHolding";
export {
  mergeStockProfileIntoStockItem,
  mergeStockBundleIntoStockItem,
  type StockProfileEnrichable,
} from "./mergeStockProfileIntoStockItem";
export {
  calculateHoldingsTotalReturn,
  calculateHoldingsTotalValue,
  calculateHoldingsTodayChange,
  recalculateDashboardMetrics,
  recalculatePortfolioMetrics,
  recalculatePortfolioSummary,
  recalculateTotalPortfolioValue,
  type HoldingsValueInput,
} from "./recalculateHoldingsMetrics";
export { enrichItemsWithBundles, enrichItemWithBundle } from "./enrichItemsWithBundles";
export { enrichWatchlistItem } from "./enrichWatchlistItem";
export { enrichAlertWithBundle } from "./enrichAlertWithBundle";
export {
  enrichNextMoveWithBundle,
  enrichUpcomingEventWithBundle,
} from "./enrichNextMoveWithBundle";
export { enrichAddStockSearchResult } from "./enrichAddStockSearchResult";
