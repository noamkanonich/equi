import { portfolioMockData } from "@/data/portfolio/portfolio.mock";
import {
  reportsMockMetrics,
  reportsPeriodMetricSublabelKeys,
} from "@/data/reports/reports.mock";
import type { ReportMetricCard, ReportPeriodKey } from "@/data/reports/reports.types";
import type {
  EnrichedPortfolioHolding,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";

const getSublabelKey = (kind: string, period: ReportPeriodKey): string =>
  reportsPeriodMetricSublabelKeys[kind]?.[period] ??
  reportsPeriodMetricSublabelKeys[kind]?.oneYear ??
  "vsLastYear";

const getMetricTrend = (kind: string, useMockTrend: boolean): number[] => {
  if (!useMockTrend) {
    return [];
  }

  const mockMetric = portfolioMockData.metrics.find((metric) => {
    if (kind === "portfolioValue") return metric.kind === "totalValue";
    if (kind === "totalGainLoss") return metric.kind === "totalReturn";
    return false;
  });

  return mockMetric?.trend ?? reportsMockMetrics.find((m) => m.kind === kind)?.trend ?? [];
};

export const calculateReportMetrics = (
  summary: PortfolioSummary,
  holdings: EnrichedPortfolioHolding[],
  period: ReportPeriodKey,
  useLiveData: boolean,
  isUsingDemoPortfolio = true,
): ReportMetricCard[] => {
  if (!useLiveData && holdings.length === 0) {
    if (!isUsingDemoPortfolio) {
      return reportsMockMetrics.map((metric) => ({
        ...metric,
        value: 0,
        secondaryValue: 0,
        trend: [],
        sublabelKey: getSublabelKey(metric.kind, period),
      }));
    }

    return reportsMockMetrics.map((metric) => ({
      ...metric,
      sublabelKey: getSublabelKey(metric.kind, period),
    }));
  }

  const unrealizedGain = holdings.reduce(
    (sum, holding) => sum + holding.totalGainLoss,
    0,
  );
  const unrealizedCost = holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
  const unrealizedPercent =
    unrealizedCost === 0 ? 0 : (unrealizedGain / unrealizedCost) * 100;
  const cashPercent =
    summary.totalValue === 0
      ? 0
      : (summary.cashAvailable / summary.totalValue) * 100;

  const annualReturnPercent = summary.totalReturnPercent * 0.68;
  const useMockTrend = isUsingDemoPortfolio;

  return [
    {
      kind: "portfolioValue",
      value: summary.totalValue,
      currency: summary.currency,
      secondaryValue: summary.totalReturnPercent,
      secondaryKind: "percent",
      sublabelKey: getSublabelKey("portfolioValue", period),
      trend: getMetricTrend("portfolioValue", useMockTrend),
      tone: summary.totalReturnPercent >= 0 ? "positive" : "negative",
    },
    {
      kind: "totalGainLoss",
      value: summary.totalReturn,
      currency: summary.currency,
      secondaryValue: summary.totalReturnPercent,
      secondaryKind: "percent",
      sublabelKey: getSublabelKey("totalGainLoss", period),
      trend: getMetricTrend("totalGainLoss", useMockTrend),
      tone: summary.totalReturn >= 0 ? "positive" : "negative",
    },
    {
      kind: "annualReturn",
      value: annualReturnPercent,
      currency: summary.currency,
      secondaryValue: 2.34,
      secondaryKind: "percent",
      sublabelKey: "vsBenchmark",
      sublabelParams: { benchmark: "S&P 500" },
      trend: useMockTrend
        ? (reportsMockMetrics.find((m) => m.kind === "annualReturn")?.trend ?? [])
        : [],
      tone: annualReturnPercent >= 0 ? "positive" : "negative",
    },
    {
      kind: "unrealizedGain",
      value: unrealizedGain,
      currency: summary.currency,
      secondaryValue: unrealizedPercent,
      secondaryKind: "percent",
      sublabelKey: "fromOriginalInvestment",
      trend: useMockTrend
        ? (reportsMockMetrics.find((m) => m.kind === "unrealizedGain")?.trend ?? [])
        : [],
      tone: unrealizedGain >= 0 ? "positive" : "negative",
    },
    {
      kind: "cashBalance",
      value: summary.cashAvailable,
      currency: summary.currency,
      secondaryValue: cashPercent,
      secondaryKind: "percent",
      sublabelKey: "ofPortfolio",
      trend: useMockTrend
        ? (reportsMockMetrics.find((m) => m.kind === "cashBalance")?.trend ?? [])
        : [],
      tone: "neutral",
    },
  ];
};
