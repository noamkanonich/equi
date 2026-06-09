import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { AssetType, DataProvider, Market } from "@/data/market/market.types";

export type AddStockDestination = "portfolio" | "watchlist";

export type AddStockAnalystRating = "buy" | "hold" | "watch";

export type AddStockSearchResult = {
  assetId?: string;
  symbol: string;
  displaySymbol?: string;
  companyName: string;
  logoUrl?: string | null;
  exchange: string;
  market?: Market;
  assetType?: AssetType;
  provider?: DataProvider;
  providerSymbol?: string;
  hasLivePrice?: boolean;
  sector: string;
  industry: string;
  price: number;
  currency: CurrencyCode;
  dayChangePercent: number;
  score: number;
  marketCap: number;
  weekRangeLow: number;
  weekRangeHigh: number;
  analystRating: AddStockAnalystRating;
  analystRatingScore: number;
  sparkline: number[];
  isMock?: boolean;
  isFallback?: boolean;
};

export type AddStockQuickOverview = {
  currentPrice: number;
  marketCap: number;
  sector: string;
  industry: string;
  weekRangeLow: number;
  weekRangeHigh: number;
  analystRating: AddStockAnalystRating;
  analystRatingScore: number;
  equiScore: number;
  currency: CurrencyCode;
};

export type AddStockFormState = {
  query: string;
  selectedSymbol: string | null;
  destination: AddStockDestination;
  status: "searching" | "success";
};
