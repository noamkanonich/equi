export type MarketSessionStatus = "open" | "closed";

export type MarketSessionClock = {
  status: MarketSessionStatus;
  countdown: string;
  timestamp: string;
  targetKind: "close" | "open";
};

export type Market = "US" | "IL";

export type AssetType =
  | "stock"
  | "etf"
  | "fund"
  | "index"
  | "bond"
  | "unknown";

export type DataProvider = "massive" | "tase" | "fmp" | "finnhub" | "mock";

export type Asset = {
  id: string;
  symbol: string;
  displaySymbol: string;
  name: string;
  market: Market;
  exchange: string;
  currency: "USD" | "ILS";
  assetType: AssetType;
  provider: DataProvider;
  providerSymbol: string;
  sector?: string;
  industry?: string;
  raw?: unknown;
};

export type AssetReference = Pick<
  Asset,
  | "id"
  | "symbol"
  | "market"
  | "exchange"
  | "currency"
  | "provider"
  | "providerSymbol"
>;
