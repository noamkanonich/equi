import { reportsMockRiskMetrics } from "@/data/reports/reports.mock";
import type { RiskMetricItem } from "@/data/reports/reports.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

const buildEmptyRiskMetrics = (): RiskMetricItem[] =>
  reportsMockRiskMetrics.map((metric) => ({
    key: metric.key,
    value: metric.key === "beta" ? "—" : "0",
    tone: "neutral" as const,
  }));

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
  isUsingDemoPortfolio = false,
): RiskMetricItem[] => {
  if (!hasHoldings || holdings.length === 0) {
    return isUsingDemoPortfolio ? reportsMockRiskMetrics : buildEmptyRiskMetrics();
  }

  const weightedBeta = computeWeightedBeta(holdings, bundles);
  const emptyMetrics = buildEmptyRiskMetrics();
  const emptyByKey = Object.fromEntries(
    emptyMetrics.map((metric) => [metric.key, metric]),
  );

  return emptyMetrics.map((emptyMetric) => {
    if (emptyMetric.key === "beta" && weightedBeta !== null) {
      return {
        key: "beta",
        value: weightedBeta.toFixed(2),
        tone: "neutral" as const,
      };
    }

    if (isUsingDemoPortfolio) {
      const mockMetric = reportsMockRiskMetrics.find(
        (metric) => metric.key === emptyMetric.key,
      );
      return mockMetric ?? emptyMetric;
    }

    return emptyByKey[emptyMetric.key] ?? emptyMetric;
  });
};
