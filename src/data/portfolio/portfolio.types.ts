import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { FinancialDataMeta } from "@/data/financial-data/financial-data.types";
import type { AssetReference } from "@/data/market/market.types";
import type { SuggestedAction } from "@/data/scoring/scoring.types";

export type PortfolioTone = "positive" | "negative" | "neutral";

export type PortfolioAccountType =
  | "brokerage"
  | "retirement"
  | "taxAdvantaged"
  | "other";

export type PortfolioStrategyTag =
  | "core"
  | "growth"
  | "income"
  | "speculative"
  | "watch";

/** User-owned holding fields — stored in local session state. */
export type PortfolioHolding = {
  id: string;
  symbol: string;
  assetId?: string;
  market?: AssetReference["market"];
  exchange?: string;
  provider?: AssetReference["provider"];
  providerSymbol?: string;
  shares: number;
  averageCost: number;
  purchaseCurrency: CurrencyCode;
  purchaseDate?: string;
  accountName?: string;
  accountType?: PortfolioAccountType;
  targetAllocationPercent?: number;
  strategyTag?: PortfolioStrategyTag;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

/** Provider + computed fields merged for display and calculations. */
export type EnrichedPortfolioHolding = PortfolioHolding & {
  companyName: string;
  logoUrl?: string | null;
  sector: PortfolioAllocationKey;
  exchange?: string;
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  marketCap?: number;
  marketValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayGainLoss: number;
  weightPercent: number;
  score: number;
  trend: number[];
  recentDayChanges: number[];
  dataMeta?: FinancialDataMeta;
};

export type PortfolioMetricKind =
  | "totalValue"
  | "todayChange"
  | "totalReturn"
  | "cashAvailable"
  | "holdings"
  | "portfolioScore";

export type PortfolioMetric = {
  kind: PortfolioMetricKind;
  value: number;
  currency?: CurrencyCode;
  secondaryValue?: number;
  secondaryKind?: "percent" | "count" | "label";
  trend: number[];
  tone: PortfolioTone;
  scoreBreakdown?: PortfolioScoreDistributionSegment[];
};

export type PortfolioHoldingView = EnrichedPortfolioHolding & {
  gainLossAmount: number;
  gainLossPercent: number;
  suggestedAction: SuggestedAction;
  tone: PortfolioTone;
};

export type PortfolioPerformanceRange =
  | "oneDay"
  | "oneWeek"
  | "oneMonth"
  | "oneYear"
  | "all";

export type PortfolioPerformancePoint = {
  date: string;
  label: string;
  value: number;
  currency: CurrencyCode;
  range: PortfolioPerformanceRange;
};

export type PortfolioAllocationKey =
  | "technology"
  | "consumerCyclical"
  | "communication"
  | "consumerDefensive"
  | "healthcare"
  | "cash";

export type PortfolioAllocationSegment = {
  key: PortfolioAllocationKey;
  value: number;
};

export type PortfolioMoverGroup = {
  winners: PortfolioHoldingView[];
  losers: PortfolioHoldingView[];
};

export type PortfolioEarningsTiming = "beforeMarket" | "afterMarket";

export type PortfolioUpcomingEarning = {
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  date: string;
  timing: PortfolioEarningsTiming;
};

export type PortfolioActivityType = "buy" | "sell" | "dividend" | "added";

export type PortfolioActivity = {
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  type: PortfolioActivityType;
  date: string;
  value: number;
  currency: CurrencyCode;
  descriptionKey: string;
  tone: PortfolioTone;
};

export type PortfolioScoreDistributionKey =
  | "great"
  | "good"
  | "watch"
  | "avoid";

export type PortfolioScoreDistributionSegment = {
  key: PortfolioScoreDistributionKey;
  value: number;
  minScore: number;
  maxScore: number;
};

export type PortfolioAiInsight = {
  confidencePercent: number;
  keyPositiveKey: string;
  potentialConcernKey: string;
  suggestedReviewKey: string;
};

export type PortfolioSummary = {
  totalValue: number;
  todayChange: number;
  todayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  cashAvailable: number;
  portfolioScore: number;
  currency: CurrencyCode;
};

export type PortfolioData = {
  summary: PortfolioSummary;
  metrics: PortfolioMetric[];
  holdings: EnrichedPortfolioHolding[];
  performance: PortfolioPerformancePoint[];
  assetAllocation: PortfolioAllocationSegment[];
  topMovers: PortfolioMoverGroup;
  upcomingEarnings: PortfolioUpcomingEarning[];
  recentActivity: PortfolioActivity[];
  scoreDistribution: PortfolioScoreDistributionSegment[];
  aiInsight: PortfolioAiInsight;
};

export type PortfolioHoldingFormInput = {
  symbol: string;
  assetId?: string;
  market?: AssetReference["market"];
  exchange?: string;
  provider?: AssetReference["provider"];
  providerSymbol?: string;
  shares: number;
  averageCost: number;
  purchaseCurrency: CurrencyCode;
  purchaseDate?: string;
  accountName?: string;
  accountType?: PortfolioAccountType;
  targetAllocationPercent?: number;
  strategyTag?: PortfolioStrategyTag;
  notes?: string;
};

export type PortfolioCashBalance = {
  amount: number;
  currency: CurrencyCode;
};
