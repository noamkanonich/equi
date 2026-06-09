import type { FinancialDataSource } from "./financial-data.types";
import type { AssetType, DataProvider, Market } from "@/data/market/market.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";

export type StockSearchResultItem = {
  assetId?: string;
  symbol: string;
  displaySymbol?: string;
  companyName: string;
  exchange: string;
  currency?: Extract<CurrencyCode, "USD" | "ILS">;
  market?: Market;
  assetType?: AssetType;
  provider?: DataProvider;
  providerSymbol?: string;
  hasLivePrice?: boolean;
  sector?: string;
  industry?: string;
  country?: string;
  isMock?: boolean;
};

export type StockSearchResponse = {
  results: StockSearchResultItem[];
  meta: {
    source: FinancialDataSource;
    isFallback: boolean;
    fetchedAt: string;
  };
};
