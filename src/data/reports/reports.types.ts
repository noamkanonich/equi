import type { CurrencyCode } from "@/data/currencies/currency.types";
import type {
  PortfolioActivity,
  PortfolioAllocationKey,
} from "@/data/portfolio/portfolio.types";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";

export type ReportTabKey =
  | "overview"
  | "performance"
  | "allocation"
  | "holdings"
  | "risk"
  | "taxes"
  | "activity";

export type ReportPeriodKey = "all" | "oneYear" | "sixMonths" | "threeMonths" | "thirtyDays";

export type ReportBenchmarkKey = "sp500" | "nasdaq" | "msciWorld";

export type ReportMetricKind =
  | "portfolioValue"
  | "totalGainLoss"
  | "annualReturn"
  | "unrealizedGain"
  | "cashBalance";

export type ReportFileType = "pdf" | "csv";

export type ReportMetricCard = {
  kind: ReportMetricKind;
  value: number;
  currency: CurrencyCode;
  secondaryValue?: number;
  secondaryKind?: "percent" | "money";
  sublabelKey: string;
  sublabelParams?: Record<string, string | number>;
  trend: number[];
  tone: "positive" | "negative" | "neutral";
};

export type ReportPerformancePoint = {
  date: string;
  label: string;
  portfolioPercent: number;
  benchmarkPercent: number;
};

export type ReportPerformanceSeries = {
  points: ReportPerformancePoint[];
  portfolioEndPercent: number;
  benchmarkEndPercent: number;
};

export type AllocationReportItem = {
  key: PortfolioAllocationKey;
  percent: number;
  value: number;
};

export type ContributorReportItem = {
  symbol: string;
  companyName: string;
  contributionAmount: number;
  contributionPercent: number;
  barPercent: number;
  tone: "positive" | "negative" | "neutral";
  isCash?: boolean;
};

export type KeyStatisticItem = {
  key: string;
  value: string;
  symbol?: string;
};

export type MonthlySummaryItem = {
  key: string;
  value: number;
  currency?: CurrencyCode;
  kind: "percent" | "money" | "count";
  tone?: "positive" | "negative" | "neutral";
};

export type AvailableReportItem = {
  id: string;
  nameKey: string;
  fileType: ReportFileType;
};

export type AllocationSectorHolding = {
  symbol: string;
  companyName: string;
  weightPercent: number;
  sectorWeightPercent: number;
};

export type AllocationSectorDetail = AllocationReportItem & {
  holdings: AllocationSectorHolding[];
};

export type PerformanceBenchmarkComparisonItem = {
  key: ReportBenchmarkKey;
  returnPercent: number;
  deltaVsPortfolio: number;
  tone: "positive" | "negative" | "neutral";
};

export type RiskMetricItem = {
  key: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
};

export type ReportsRiskAiInsight = {
  confidencePercent: number;
  summaryKey: string;
  primaryRiskKey: string;
  concentrationRiskKey: string;
  monitoringSuggestionKey: string;
  riskFactorKeys: string[];
};

export type TaxSummaryItem = {
  key: string;
  value: number;
  currency?: CurrencyCode;
  kind: "money" | "percent" | "count";
  tone?: "positive" | "negative" | "neutral";
};

export type TaxLotItem = {
  symbol: string;
  companyName: string;
  shares: number;
  costBasis: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  holdingPeriod: "short" | "long";
  acquiredDate: string;
  currency: CurrencyCode;
  tone: "positive" | "negative" | "neutral";
};

export type ReportsPageData = {
  metrics: ReportMetricCard[];
  performanceByBenchmark: Record<ReportBenchmarkKey, ReportPerformancePoint[]>;
  portfolioEndPercent: number;
  allocation: AllocationReportItem[];
  allocationSectorDetails: AllocationSectorDetail[];
  benchmarkComparisons: PerformanceBenchmarkComparisonItem[];
  contributors: ContributorReportItem[];
  keyStatistics: KeyStatisticItem[];
  monthlySummary: MonthlySummaryItem[];
  availableReports: AvailableReportItem[];
  activities: PortfolioActivity[];
  riskMetrics: RiskMetricItem[];
  riskAiInsight: ReportsRiskAiInsight;
  taxSummary: TaxSummaryItem[];
  taxLots: TaxLotItem[];
  totalValue: number;
  currency: CurrencyCode;
  freshnessStatus: DataFreshnessStatus;
};
