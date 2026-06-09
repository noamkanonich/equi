import type {
  ReportBenchmarkKey,
  ReportMetricKind,
  ReportPeriodKey,
  ReportTabKey,
} from "./reports.types";

export const reportTabs: ReportTabKey[] = [
  "overview",
  "performance",
  "allocation",
  "holdings",
  "risk",
  "taxes",
  "activity",
];

export const reportPeriods: ReportPeriodKey[] = [
  "all",
  "oneYear",
  "sixMonths",
  "threeMonths",
  "thirtyDays",
];

export const reportBenchmarks: ReportBenchmarkKey[] = ["sp500", "nasdaq", "msciWorld"];

export const reportMetricKinds: ReportMetricKind[] = [
  "portfolioValue",
  "totalGainLoss",
  "annualReturn",
  "unrealizedGain",
  "cashBalance",
];

export const reportMetricIconKeys: Record<ReportMetricKind, string> = {
  portfolioValue: "wallet",
  totalGainLoss: "trendingUp",
  annualReturn: "trophy",
  unrealizedGain: "circleDollarSign",
  cashBalance: "landmark",
};
