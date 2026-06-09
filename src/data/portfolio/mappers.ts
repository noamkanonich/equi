import { getSuggestedAction } from "@/utils/scoring/getSuggestedAction";
import { mapScoreToBadgeTone } from "@/utils/scoring/mappers";
import type {
  PortfolioAllocationKey,
  PortfolioAllocationSegment,
  PortfolioData,
  EnrichedPortfolioHolding,
  PortfolioHoldingView,
  PortfolioMetric,
  PortfolioPerformancePoint,
  PortfolioScoreDistributionSegment,
  PortfolioSummary,
  PortfolioTone,
  PortfolioUpcomingEarning,
  PortfolioActivity,
  PortfolioAiInsight,
} from "./portfolio.types";

type BuildPortfolioDataInput = {
  summary: PortfolioSummary;
  metricTrends: {
    totalValue: number[];
    todayChange: number[];
    totalReturn: number[];
  };
  holdings: EnrichedPortfolioHolding[];
  performance: PortfolioPerformancePoint[];
  upcomingEarnings: PortfolioUpcomingEarning[];
  recentActivity: PortfolioActivity[];
  aiInsight: PortfolioAiInsight;
};

const allocationOrder: PortfolioAllocationKey[] = [
  "technology",
  "consumerCyclical",
  "communication",
  "consumerDefensive",
  "healthcare",
  "cash",
];

export const mapNumberToTone = (value: number): PortfolioTone => {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
};

export { mapScoreToBadgeTone };

export const mapHoldingToView = (
  holding: EnrichedPortfolioHolding,
  totalPortfolioValue: number,
): PortfolioHoldingView => {
  const weightPercent =
    totalPortfolioValue === 0
      ? 0
      : (holding.marketValue / totalPortfolioValue) * 100;

  return {
    ...holding,
    weightPercent,
    gainLossAmount: holding.totalGainLoss,
    gainLossPercent: holding.totalGainLossPercent,
    suggestedAction: getSuggestedAction(holding.score),
    tone: mapNumberToTone(holding.dayChangePercent),
  };
};

export const mapHoldingsToView = (
  holdings: EnrichedPortfolioHolding[],
  totalPortfolioValue: number,
): PortfolioHoldingView[] =>
  holdings.map((holding) => mapHoldingToView(holding, totalPortfolioValue));

export const mapHoldingsToTopMovers = (
  holdings: PortfolioHoldingView[],
  limit = 3,
) => {
  const sortedHoldings = [...holdings].sort(
    (firstHolding, secondHolding) =>
      secondHolding.dayChangePercent - firstHolding.dayChangePercent,
  );

  return {
    winners: sortedHoldings
      .filter((holding) => holding.dayChangePercent > 0)
      .slice(0, limit),
    losers: [...holdings]
      .sort(
        (firstHolding, secondHolding) =>
          firstHolding.dayChangePercent - secondHolding.dayChangePercent,
      )
      .filter((holding) => holding.dayChangePercent < 0)
      .slice(0, limit),
  };
};

export const mapHoldingsToAllocation = (
  holdings: PortfolioHoldingView[],
  summary: PortfolioSummary,
): PortfolioAllocationSegment[] => {
  const sectorTotals = holdings.reduce<Record<PortfolioAllocationKey, number>>(
    (totals, holding) => ({
      ...totals,
      [holding.sector]: totals[holding.sector] + holding.marketValue,
    }),
    {
      technology: 0,
      consumerCyclical: 0,
      communication: 0,
      consumerDefensive: 0,
      healthcare: 0,
      cash: summary.cashAvailable,
    },
  );

  return allocationOrder.map((key) => ({
    key,
    value:
      summary.totalValue === 0
        ? 0
        : (sectorTotals[key] / summary.totalValue) * 100,
  }));
};

export const mapHoldingsToScoreDistribution = (
  holdings: EnrichedPortfolioHolding[],
): PortfolioScoreDistributionSegment[] => {
  const scoreDistribution: PortfolioScoreDistributionSegment[] = [
    { key: "great", value: 0, minScore: 80, maxScore: 100 },
    { key: "good", value: 0, minScore: 60, maxScore: 79 },
    { key: "watch", value: 0, minScore: 40, maxScore: 59 },
    { key: "avoid", value: 0, minScore: 0, maxScore: 39 },
  ];

  holdings.forEach((holding) => {
    const bucket = scoreDistribution.find(
      (segment) =>
        holding.score >= segment.minScore && holding.score <= segment.maxScore,
    );

    if (bucket) {
      bucket.value += 1;
    }
  });

  return scoreDistribution;
};

export const buildPortfolioMetrics = (
  summary: PortfolioSummary,
  trends: BuildPortfolioDataInput["metricTrends"],
  scoreDistribution: PortfolioScoreDistributionSegment[],
): PortfolioMetric[] => [
  {
    kind: "totalValue",
    value: summary.totalValue,
    currency: summary.currency,
    secondaryValue: summary.todayChangePercent,
    secondaryKind: "percent",
    trend: trends.totalValue,
    tone: "positive",
  },
  {
    kind: "todayChange",
    value: summary.todayChange,
    currency: summary.currency,
    secondaryValue: summary.todayChangePercent,
    secondaryKind: "percent",
    trend: trends.todayChange,
    tone: mapNumberToTone(summary.todayChange),
  },
  {
    kind: "totalReturn",
    value: summary.totalReturn,
    currency: summary.currency,
    secondaryValue: summary.totalReturnPercent,
    secondaryKind: "percent",
    trend: trends.totalReturn,
    tone: mapNumberToTone(summary.totalReturn),
  },
  {
    kind: "cashAvailable",
    value: summary.cashAvailable,
    currency: summary.currency,
    secondaryKind: "label",
    trend: [],
    tone: "neutral",
  },
  {
    kind: "portfolioScore",
    value: summary.portfolioScore,
    secondaryKind: "count",
    trend: [],
    tone: "positive",
    scoreBreakdown: scoreDistribution,
  },
];

export const buildPortfolioData = ({
  summary,
  metricTrends,
  holdings,
  performance,
  upcomingEarnings,
  recentActivity,
  aiInsight,
}: BuildPortfolioDataInput): PortfolioData => {
  const holdingViews = mapHoldingsToView(holdings, summary.totalValue);
  const scoreDistribution = mapHoldingsToScoreDistribution(holdings);

  return {
    summary,
    metrics: buildPortfolioMetrics(summary, metricTrends, scoreDistribution),
    holdings,
    performance,
    assetAllocation: mapHoldingsToAllocation(holdingViews, summary),
    topMovers: mapHoldingsToTopMovers(holdingViews),
    upcomingEarnings,
    recentActivity,
    scoreDistribution,
    aiInsight,
  };
};
