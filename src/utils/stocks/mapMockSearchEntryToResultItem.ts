import type { MockStockSearchEntry } from "@/data/stocks/stock-search.mock";
import type { StockSearchResultItem } from "@/data/financial-data/search.types";

export const mapMockSearchEntryToResultItem = (
  entry: MockStockSearchEntry,
): StockSearchResultItem => ({
  assetId: `US:${entry.symbol}`,
  symbol: entry.symbol,
  displaySymbol: entry.symbol,
  companyName: entry.companyName,
  exchange: entry.exchange,
  currency: entry.currency,
  market: "US",
  assetType: entry.assetType,
  provider: "mock",
  providerSymbol: entry.symbol,
  hasLivePrice: true,
  sector: entry.sector,
  industry: entry.industry,
  country: entry.country,
  isMock: true,
});
