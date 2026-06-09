import type { CurrencyCode } from "@/data/currencies/currency.types";

export type FinancialDataProviderId = "fmp" | "finnhub" | "mock";

export type FinancialDataSource =
  | "fmp"
  | "finnhub"
  | "mock"
  | "tase"
  | "mixed"
  | "yahoo_scraper"
  | "yahoo_chart"
  | "google_scraper"
  | "scraper_cache";

export type FinancialDataSection =
  | "profile"
  | "quote"
  | "keyMetrics"
  | "incomeStatements"
  | "cashFlowStatements"
  | "priceHistory"
  | "news"
  | "earnings"
  | "analystTarget"
  | "analystRatings"
  | "intraday";

export type FinancialDataFallbackReason =
  | "rateLimited"
  | "providerError"
  | "missingKey"
  | "mockSearchData";

/** See `src/data/data-coverage.md` for ownership and screen mapping. */
export type FinancialDataMeta = {
  provider: FinancialDataProviderId;
  isFallback: boolean;
  fetchedAt: string;
  source: FinancialDataSource;
  availableDataSections?: FinancialDataSection[];
  missingDataSections?: FinancialDataSection[];
  /** Per-section provider that supplied live data (fmp / finnhub). */
  sectionProviders?: Partial<Record<FinancialDataSection, FinancialDataSource>>;
  /** Sections that used mock fallback while other sections were live. */
  fallbackSections?: FinancialDataSection[];
  fallbackReason?: FinancialDataFallbackReason;
  cachedAt?: string;
  cacheExpiresAt?: string;
};

export type StockProviderProfile = {
  symbol: string;
  companyName: string;
  description?: string;
  exchange: string;
  sector?: string;
  industry?: string;
  country?: string;
  website?: string;
  logoUrl?: string | null;
  currency: CurrencyCode;
  marketCap?: number;
  beta?: number;
  ceo?: string;
  employees?: number;
  ipoDate?: string;
};

export type StockProviderQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap?: number;
  currency: CurrencyCode;
  updatedAt: string;
  isMarketOpen?: boolean;
};

export type StockProviderPricePoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockProviderPriceHistory = {
  symbol: string;
  currency: CurrencyCode;
  points: StockProviderPricePoint[];
};

export type StockProviderIntradayPoint = {
  time: string;
  price: number;
};

export type StockProviderIntradayHistory = {
  symbol: string;
  currency: CurrencyCode;
  points: StockProviderIntradayPoint[];
};

export type StockProviderAnalystDistribution = {
  buy: number;
  hold: number;
  sell: number;
};

export type StockProviderFinancialStatement = {
  symbol: string;
  period: string;
  fiscalYear: number;
  statementType: "income" | "cashFlow" | "balanceSheet";
  revenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  netIncome?: number;
  eps?: number;
  freeCashFlow?: number;
  operatingCashFlow?: number;
  currency: CurrencyCode;
};

export type StockProviderKeyMetrics = {
  symbol: string;
  currency: CurrencyCode;
  asOfDate: string;
  peRatio?: number;
  pegRatio?: number;
  priceToSalesRatio?: number;
  enterpriseValue?: number;
  marketCap?: number;
  revenuePerShare?: number;
  netIncomePerShare?: number;
  operatingCashFlowPerShare?: number;
  freeCashFlowPerShare?: number;
  roe?: number;
  roa?: number;
  debtToEquity?: number;
  currentRatio?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  revenueGrowth?: number;
  epsGrowth?: number;
};

export type StockProviderNewsSentiment = "positive" | "neutral" | "negative";

export type StockProviderNewsItem = {
  id: string;
  symbol: string;
  title: string;
  summary?: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  sentiment?: StockProviderNewsSentiment;
  relatedSymbols?: string[];
};

export type StockProviderEarningsTime = "beforeMarket" | "afterMarket" | "unknown";

export type StockProviderEarningsImpact = "low" | "medium" | "high";

export type StockProviderEarningsEvent = {
  symbol: string;
  companyName: string;
  date: string;
  time: StockProviderEarningsTime;
  epsEstimate?: number;
  revenueEstimate?: number;
  source: string;
  impact: StockProviderEarningsImpact;
};

export type StockProviderAnalystConsensus = "buy" | "hold" | "sell" | "mixed";

export type StockProviderAnalystTarget = {
  symbol: string;
  averageTarget: number;
  highTarget: number;
  lowTarget: number;
  upsidePercent: number;
  consensus: StockProviderAnalystConsensus;
  analystCount?: number;
  distribution?: StockProviderAnalystDistribution;
  updatedAt: string;
};

export type StockProviderAnalystRating = {
  symbol: string;
  firm: string;
  rating: string;
  previousRating?: string;
  action: "upgrade" | "downgrade" | "initiate" | "maintain" | "unknown";
  priceTarget?: number;
  publishedAt: string;
};

export type StockProviderMarketMover = {
  symbol: string;
  companyName: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  direction: "gainer" | "loser";
};

export type StockProviderSectorData = {
  sector: string;
  changePercent: number;
  marketCap?: number;
  volume?: number;
};

export type StockProviderDataBundle = {
  symbol: string;
  profile: StockProviderProfile | null;
  quote: StockProviderQuote | null;
  keyMetrics: StockProviderKeyMetrics | null;
  incomeStatements: StockProviderFinancialStatement[];
  cashFlowStatements: StockProviderFinancialStatement[];
  priceHistory: StockProviderPriceHistory | null;
  intraday: StockProviderIntradayHistory | null;
  news: StockProviderNewsItem[];
  earnings: StockProviderEarningsEvent[];
  analystTarget: StockProviderAnalystTarget | null;
  analystRatings: StockProviderAnalystRating[];
  meta: FinancialDataMeta;
};

export type StockDataBundleResponse = {
  bundle: StockProviderDataBundle;
};

export type StockDataBundlesResponse = {
  bundles: Record<string, StockProviderDataBundle>;
};
