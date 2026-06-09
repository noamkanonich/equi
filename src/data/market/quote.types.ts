export type QuoteSource =
  | "massive"
  | "tase"
  | "yahoo_scraper"
  | "yahoo_chart"
  | "google_scraper"
  | "cache";

export type QuoteQuality = "official" | "cached" | "fallback" | "unavailable";

export type Quote = {
  assetId: string;
  price: number | null;
  change?: number | null;
  changePercent?: number | null;
  currency: "USD" | "ILS";
  asOf: string;
  source: QuoteSource;
  quality: QuoteQuality;
  isStale: boolean;
};
