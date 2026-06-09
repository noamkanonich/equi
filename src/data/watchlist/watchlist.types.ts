import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { AssetReference } from "@/data/market/market.types";

export type WatchlistStatus =
  | "readyToBuy"
  | "waitForPullback"
  | "watchClosely"
  | "tooExpensive"
  | "needsMoreData";

export type WatchlistMetricKind =
  | "watchedStocks"
  | "averageOpportunityScore"
  | "inBuyZone"
  | "upcomingEarnings"
  | "alertsTriggered";

export type WatchlistAction = "reviewStock" | "setAlert" | "compare";

export type WatchlistFilters = {
  statuses: WatchlistStatus[];
  actions: WatchlistAction[];
  minimumOpportunityScore: number | null;
  favoritesOnly: boolean;
};

export type WatchlistTrigger = {
  summaryKey: string;
  detailKey?: string;
};

export type BuyZone = {
  low: number;
  high: number;
  currency: CurrencyCode;
};

export type OpportunityScoreTrendPoint = {
  date: string;
  score: number;
};

export type WatchlistMetric = {
  kind: WatchlistMetricKind;
  value: number;
  helperKey: string;
  helperValue?: string;
  trend: number[];
  tone: "positive" | "negative" | "neutral";
};

/** User-owned watchlist fields — stored in AppDataProvider. */
export type WatchlistItemBase = {
  id: string;
  symbol: string;
  assetId?: string;
  market?: AssetReference["market"];
  exchange?: string;
  currency?: CurrencyCode;
  provider?: AssetReference["provider"];
  providerSymbol?: string;
  buyZone: BuyZone;
  targetPrice?: number;
  notes?: string;
  status?: WatchlistStatus;
  createdAt: string;
  updatedAt: string;
};

/** Mock seed metadata — not from FMP; preserved locally. */
export type WatchlistItemMetadata = {
  qualityScore: number;
  opportunityScore: number;
  trigger: WatchlistTrigger;
  action: WatchlistAction;
  isFavorite: boolean;
  whyWatchingKey: string;
  monitorKeys: string[];
  opportunityTrend: OpportunityScoreTrendPoint[];
};

export type WatchlistStoredItem = WatchlistItemBase & WatchlistItemMetadata;

export type WatchlistItemFormInput = {
  symbol: string;
  assetId?: string;
  market?: AssetReference["market"];
  exchange?: string;
  currency?: CurrencyCode;
  provider?: AssetReference["provider"];
  providerSymbol?: string;
  buyZone: BuyZone;
  targetPrice?: number;
  notes?: string;
  status?: WatchlistStatus;
  isFavorite?: boolean;
};

/** Live display shape — derived from stored item + stockDataBySymbol. */
export type EnrichedWatchlistItem = WatchlistStoredItem & {
  companyName: string;
  logoUrl?: string | null;
  currentPrice: number;
  currency: CurrencyCode;
  dayChangePercent: number;
  distanceToBuyZonePercent: number;
  status: WatchlistStatus;
};

/** @deprecated Alias — UI components use enriched watchlist rows. */
export type WatchlistItem = EnrichedWatchlistItem;

export type WatchlistInsight = {
  titleKey: string;
  bodyKey: string;
  disclaimerKey: string;
};

export type WatchlistSidebarStock = {
  symbol: string;
  logoUrl?: string | null;
  value: number;
};

export type WatchlistEarningsItem = {
  symbol: string;
  logoUrl?: string | null;
  dateKey: string;
};

export type WatchlistReplaceHolding = {
  candidateSymbol: string;
  candidateLogoUrl?: string | null;
  holdingSymbol: string;
  summaryKey: string;
};

export type WatchlistSidebarSummary = {
  bestOpportunities: WatchlistSidebarStock[];
  closestToBuyZone: WatchlistSidebarStock[];
  upcomingEarnings: WatchlistEarningsItem[];
  couldReplaceHolding: WatchlistReplaceHolding;
};
