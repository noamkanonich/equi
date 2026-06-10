import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SuggestedAction } from "@/data/scoring/scoring.types";

export type StockChartRange = "oneDay" | "oneWeek" | "oneMonth" | "oneYear" | "max";

export type StockChartPoint = {
  label: string;
  price: number;
  timestamp?: string;
};

export type StockScoreCategory =
  | "growth"
  | "profitability"
  | "valuation"
  | "financialHealth"
  | "momentum"
  | "analystSentiment";

export type ScoreLabelKey = "veryStrong" | "strong" | "good" | "watch" | "weak";

export type StockScoreBreakdownItem = {
  category: StockScoreCategory;
  score: number;
  labelKey: ScoreLabelKey;
  sparkline: number[];
};

export type StockKeyMetricKind =
  | "pe"
  | "peg"
  | "revenueGrowth"
  | "grossMargin"
  | "operatingMargin"
  | "marketCap"
  | "freeCashFlow"
  | "debtToEquity"
  | "roe"
  | "nextEarnings";

export type StockKeyMetric = {
  kind: StockKeyMetricKind;
  value: number | string;
  format: "number" | "percent" | "money" | "ratio" | "date";
  currency?: CurrencyCode;
};

export type StockNewsCategory = "earnings" | "analysis" | "news";

export type StockNewsItem = {
  id: string;
  titleKey: string;
  sourceKey: string;
  timeAgoKey: string;
  category: StockNewsCategory;
};

export type AnalystRatingDistribution = {
  buy: number;
  hold: number;
  sell: number;
};

export type StockAnalystTarget = {
  averageTarget: number;
  upsidePercent: number;
  high: number;
  low: number;
  consensusKey: "strongBuy" | "buy" | "hold" | "sell";
  analystCount: number;
  distribution: AnalystRatingDistribution;
  isFallback?: boolean;
};

export type StockUserPosition = {
  shares: number;
  avgCost: number;
  marketValue: number;
  dayGainLoss: number;
  dayGainLossPercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  currency: CurrencyCode;
};

export type StockThesisNotes = {
  whyIOwnItKey: string;
  whatToWatchKey: string;
  sellIfKey: string;
};

export type StockAiInsight = {
  whatsGoodKey: string;
  riskToWatchKey: string;
  suggestedActionKey: string;
};

export type StockQuickActionKind =
  | "setPriceAlert"
  | "addNote"
  | "compareCompetitors"
  | "viewSecFilings"
  | "optionsChain";

export type StockAnalysisTabKey = 'overview' | 'fundamentals' | 'news' | 'notes';

export type FundamentalTrendStatus = 'improving' | 'stable' | 'declining';

export type FundamentalTrendPoint = {
  year: string;
  value: number;
};

export type FundamentalTrendMetricKind =
  | 'revenue' | 'grossProfit' | 'operatingIncome'
  | 'epsDiluted' | 'freeCashFlow' | 'operatingMargin';

export type FundamentalTrendMetric = {
  kind: FundamentalTrendMetricKind;
  unitKey: 'billions' | 'perShare' | 'percent';
  status: FundamentalTrendStatus;
  chartType: 'bar' | 'line';
  data: FundamentalTrendPoint[];
  insightKey: string;
};

export type ValuationMetricStatus = 'high' | 'moderate' | 'strong' | 'low';

export type ValuationSnapshotMetric = {
  labelKey: string;
  value: string;
  status: ValuationMetricStatus;
};

export type FundamentalAiRead = {
  whatsStrongKey: string;
  riskToWatchKey: string;
  whatToMonitorKey: string;
};

export type StockFundamentalsData = {
  aiFundamentalRead: FundamentalAiRead;
  trendMetrics: FundamentalTrendMetric[];
  valuationSnapshot: ValuationSnapshotMetric[];
};

export type StockAnalysisSeed = {
  symbol: string;
  companyName: string;
  exchange?: string;
  currentPrice: number;
  previousClose?: number;
  currency?: CurrencyCode;
  overallScore?: number;
  sector?: string;
  logoUrl?: string | null;
};

export type StockAnalysisData = {
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  exchange: string;
  currentPrice: number;
  previousClose: number;
  currency: CurrencyCode;
  dayChange: number;
  dayChangePercent: number;
  lastUpdated: string;
  overallScore: number;
  scoreLabelKey: ScoreLabelKey;
  suggestedAction: SuggestedAction;
  confidenceLabelKey: "high" | "medium" | "low";
  scoreBreakdown: StockScoreBreakdownItem[];
  chartData: Record<StockChartRange, StockChartPoint[]>;
  keyMetrics: StockKeyMetric[];
  latestNews: StockNewsItem[];
  analystTarget: StockAnalystTarget;
  userPosition: StockUserPosition | null;
  thesisNotes: StockThesisNotes;
  aiInsight: StockAiInsight;
  fundamentals: StockFundamentalsData;
};
