import {
  buildPortfolioMetrics,
  mapHoldingsToAllocation,
  mapHoldingsToScoreDistribution,
  mapHoldingsToView,
} from "@/data/portfolio/mappers";
import type { PortfolioData, PortfolioSummary } from "@/data/portfolio/portfolio.types";

const emptyTrends = {
  totalValue: [0],
  todayChange: [0],
  totalReturn: [0],
};

export const buildEmptyPortfolioData = (summary: PortfolioSummary): PortfolioData => {
  const holdingViews = mapHoldingsToView([], summary.totalValue);
  const scoreDistribution = mapHoldingsToScoreDistribution([]);
  const metrics = buildPortfolioMetrics(summary, emptyTrends, scoreDistribution);

  return {
    summary,
    metrics,
    holdings: [],
    performance: [],
    assetAllocation: mapHoldingsToAllocation(holdingViews, summary),
    topMovers: { winners: [], losers: [] },
    upcomingEarnings: [],
    recentActivity: [],
    scoreDistribution,
    aiInsight: {
      confidencePercent: 0,
      keyPositiveKey: "ai.emptyPortfolio.title",
      potentialConcernKey: "ai.emptyPortfolio.description",
      suggestedReviewKey: "ai.emptyPortfolio.description",
    },
  };
};
