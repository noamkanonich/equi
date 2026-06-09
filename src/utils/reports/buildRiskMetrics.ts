import { reportsMockRiskMetrics } from "@/data/reports/reports.mock";
import type { RiskMetricItem } from "@/data/reports/reports.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

const MOCK_METRIC_KEYS = new Set([
  "sharpeRatio",
  "sortinoRatio",
  "maxDrawdown",
  "volatility",
  "valueAtRisk",
  "correlationSP500",
  "dividendYield",
]);

const computeWeightedBeta = (
  holdings: EnrichedPortfolioHolding[],
  bundles: Record<string, StockProviderDataBundle>,
): number | null => {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const holding of holdings) {
    const beta = bundles[holding.symbol]?.profile?.beta;
    if (beta === undefined || beta === null) continue;

    const weight = holding.weightPercent / 100;
    weightedSum += beta * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
};

export const buildRiskMetrics = (
  holdings: EnrichedPortfolioHolding[],
  bundles: Record<string, StockProviderDataBundle> = {},
  hasHoldings: boolean,
): RiskMetricItem[] => {
  if (!hasHoldings || holdings.length === 0) {
    return reportsMockRiskMetrics;
  }

  const weightedBeta = computeWeightedBeta(holdings, bundles);
  const mockByKey = Object.fromEntries(
    reportsMockRiskMetrics.map((metric) => [metric.key, metric]),
  );

  return reportsMockRiskMetrics.map((mockMetric) => {
    if (mockMetric.key === "beta" && weightedBeta !== null) {
      return {
        key: "beta",
        value: weightedBeta.toFixed(2),
        tone: "neutral" as const,
      };
    }

    if (MOCK_METRIC_KEYS.has(mockMetric.key)) {
      return mockByKey[mockMetric.key] ?? mockMetric;
    }

    return mockMetric;
  });
};
