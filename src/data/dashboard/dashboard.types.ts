import type { SuggestedAction } from "@/data/scoring/scoring.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";

export type DashboardTrendTone = "positive" | "negative" | "neutral";

export type DashboardMetricKind =
  | "totalValue"
  | "todayChange"
  | "totalGainLoss"
  | "cashAvailable"
  | "portfolioScore";

export type DashboardMetric = {
  kind: DashboardMetricKind;
  value: number;
  currency: CurrencyCode;
  secondaryValue?: number;
  scoreValue?: number;
  scoreBreakdown?: DashboardScoreDistributionSegment[];
  trend: number[];
  tone: DashboardTrendTone;
};

export type DashboardHolding = {
  id: string;
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currency: CurrencyCode;
  dayChangePercent: number;
  score: number;
  recentDayChanges: number[];
  trend: number[];
};

export type DashboardHoldingView = DashboardHolding & {
  marketValue: number;
  gainLossPercent: number;
  suggestedAction: SuggestedAction;
  tone: DashboardTrendTone;
};

export type DashboardChartKey =
  | "stocks"
  | "etfs"
  | "cash"
  | "crypto"
  | "technology"
  | "communication"
  | "consumerCyclical"
  | "consumerDefensive"
  | "other";

export type DashboardChartSegment = {
  key: DashboardChartKey;
  value: number;
};

export type DashboardPerformanceRange =
  | "oneDay"
  | "oneWeek"
  | "oneMonth"
  | "threeMonths"
  | "oneYear"
  | "all";

export type DashboardPerformancePoint = {
  date: string;
  label: string;
  value: number;
  currency: CurrencyCode;
};

export type DashboardActivityType = "buy" | "dividend" | "sell" | "added";

export type DashboardActivity = {
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  type: DashboardActivityType;
  value: number;
  currency: CurrencyCode;
  tone: DashboardTrendTone;
};

export type DashboardScoreDistributionKey =
  | "great"
  | "good"
  | "watch"
  | "avoid";

export type DashboardScoreDistributionSegment = {
  key: DashboardScoreDistributionKey;
  value: number;
  minScore: number;
  maxScore: number;
};

export type DashboardEarningsTiming = "beforeMarket" | "afterMarket";

export type DashboardUpcomingEarning = {
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  date: string;
  timing: DashboardEarningsTiming;
};

export type DashboardAiInsight = {
  confidencePercent: number;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  holdings: DashboardHolding[];
  assetAllocation: DashboardChartSegment[];
  sectorExposure: DashboardChartSegment[];
  performance: DashboardPerformancePoint[];
  recentActivities: DashboardActivity[];
  scoreDistribution: DashboardScoreDistributionSegment[];
  upcomingEarnings: DashboardUpcomingEarning[];
  aiInsight: DashboardAiInsight | null;
};

