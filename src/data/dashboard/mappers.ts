import type { PortfolioAllocationKey } from "@/data/portfolio/portfolio.types";
import type {
  EnrichedPortfolioHolding,
  PortfolioScoreDistributionSegment,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";
import { mapNumberToTone as mapPortfolioNumberToTone } from "@/data/portfolio/mappers";
import { getSuggestedAction } from "@/utils/scoring/getSuggestedAction";
import type {
  DashboardChartKey,
  DashboardChartSegment,
  DashboardHolding,
  DashboardHoldingView,
  DashboardMetric,
  DashboardScoreDistributionSegment,
  DashboardTrendTone,
} from "./dashboard.types";

const dashboardSectorOrder = [
  "technology",
  "communication",
  "consumerCyclical",
  "consumerDefensive",
  "other",
] as const satisfies readonly DashboardChartKey[];

type DashboardSectorExposureKey = (typeof dashboardSectorOrder)[number];

type DashboardSectorExposureTotals = Record<DashboardSectorExposureKey, number>;

const mapPortfolioSectorToDashboardKey = (
  sector: PortfolioAllocationKey,
): DashboardSectorExposureKey => {
  if (sector === "healthcare" || sector === "cash") {
    return "other";
  }

  if (
    (dashboardSectorOrder as readonly DashboardChartKey[]).includes(
      sector as DashboardChartKey,
    )
  ) {
    return sector as DashboardSectorExposureKey;
  }

  return "other";
};

export const mapNumberToTone = (value: number): DashboardTrendTone => {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
};

export const mapHoldingToView = (
  holding: DashboardHolding,
): DashboardHoldingView => {
  const marketValue = holding.shares * holding.currentPrice;
  const gainLossPercent =
    holding.avgCost === 0
      ? 0
      : ((holding.currentPrice - holding.avgCost) / holding.avgCost) * 100;

  return {
    ...holding,
    score: holding.score,
    marketValue,
    gainLossPercent,
    suggestedAction: getSuggestedAction(holding.score),
    tone: mapNumberToTone(holding.dayChangePercent),
  };
};

export const mapHoldingsToView = (
  holdings: DashboardHolding[],
): DashboardHoldingView[] => {
  return holdings.map(mapHoldingToView);
};

export const mapHoldingsToTopMovers = (
  holdings: DashboardHolding[],
  limit = 5,
): DashboardHoldingView[] => {
  return mapHoldingsToView(holdings)
    .sort(
      (firstHolding, secondHolding) =>
        Math.abs(secondHolding.dayChangePercent) -
        Math.abs(firstHolding.dayChangePercent),
    )
    .slice(0, limit);
};

export const mapScoreDistributionToTotal = (
  segments: DashboardScoreDistributionSegment[],
) => {
  return segments.reduce((total, segment) => total + segment.value, 0);
};

export const mapPortfolioScoreDistributionToDashboard = (
  segments: PortfolioScoreDistributionSegment[],
): DashboardScoreDistributionSegment[] => segments;

export const buildDashboardMetrics = (
  summary: PortfolioSummary,
  scoreDistribution: DashboardScoreDistributionSegment[],
  trends: {
    totalValue: number[];
    todayChange: number[];
    totalGainLoss: number[];
  },
): DashboardMetric[] => {
  const cashWeightPercent =
    summary.totalValue === 0
      ? 0
      : (summary.cashAvailable / summary.totalValue) * 100;

  return [
    {
      kind: "totalValue",
      value: summary.totalValue,
      currency: summary.currency,
      secondaryValue: summary.todayChangePercent,
      trend: trends.totalValue,
      tone: mapPortfolioNumberToTone(summary.todayChange),
    },
    {
      kind: "todayChange",
      value: summary.todayChange,
      currency: summary.currency,
      secondaryValue: summary.todayChangePercent,
      trend: trends.todayChange,
      tone: mapPortfolioNumberToTone(summary.todayChange),
    },
    {
      kind: "totalGainLoss",
      value: summary.totalReturn,
      currency: summary.currency,
      secondaryValue: summary.totalReturnPercent,
      trend: trends.totalGainLoss,
      tone: mapPortfolioNumberToTone(summary.totalReturn),
    },
    {
      kind: "cashAvailable",
      value: summary.cashAvailable,
      currency: summary.currency,
      secondaryValue: Number(cashWeightPercent.toFixed(2)),
      trend: [],
      tone: "neutral",
    },
    {
      kind: "portfolioScore",
      value: summary.portfolioScore,
      currency: summary.currency,
      scoreValue: summary.portfolioScore,
      secondaryValue: scoreDistribution.reduce(
        (total, segment) => total + segment.value,
        0,
      ),
      trend: [],
      tone: "positive",
      scoreBreakdown: scoreDistribution,
    },
  ];
};

export const mapHoldingsToDashboardAssetAllocation = (
  holdings: EnrichedPortfolioHolding[],
  summary: PortfolioSummary,
): DashboardChartSegment[] => {
  const holdingsMarketValue = holdings.reduce(
    (sum, holding) => sum + holding.marketValue,
    0,
  );

  if (summary.totalValue === 0) {
    return [
      { key: "stocks", value: 0 },
      { key: "etfs", value: 0 },
      { key: "cash", value: 100 },
      { key: "crypto", value: 0 },
    ];
  }

  const stocksWeight = (holdingsMarketValue / summary.totalValue) * 100;
  const cashWeight = (summary.cashAvailable / summary.totalValue) * 100;

  return [
    { key: "stocks", value: Number(stocksWeight.toFixed(2)) },
    { key: "etfs", value: 0 },
    { key: "cash", value: Number(cashWeight.toFixed(2)) },
    { key: "crypto", value: 0 },
  ];
};

export const mapHoldingsToDashboardSectorExposure = (
  holdings: EnrichedPortfolioHolding[],
  summary: PortfolioSummary,
): DashboardChartSegment[] => {
  const sectorTotals = holdings.reduce<DashboardSectorExposureTotals>(
    (totals, holding) => {
      const key = mapPortfolioSectorToDashboardKey(holding.sector);
      return {
        ...totals,
        [key]: totals[key] + holding.marketValue,
      };
    },
    {
      technology: 0,
      communication: 0,
      consumerCyclical: 0,
      consumerDefensive: 0,
      other: 0,
    },
  );

  const holdingsMarketValue = holdings.reduce(
    (sum, holding) => sum + holding.marketValue,
    0,
  );
  const denominator = summary.totalValue > 0 ? summary.totalValue : holdingsMarketValue;

  return dashboardSectorOrder.map((key) => ({
    key,
    value:
      denominator === 0
        ? 0
        : Number(((sectorTotals[key] / denominator) * 100).toFixed(2)),
  }));
};
