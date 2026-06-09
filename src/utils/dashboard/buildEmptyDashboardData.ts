import {
  buildDashboardMetrics,
  mapHoldingsToDashboardAssetAllocation,
  mapHoldingsToDashboardSectorExposure,
  mapPortfolioScoreDistributionToDashboard,
} from "@/data/dashboard/mappers";
import type { DashboardData } from "@/data/dashboard/dashboard.types";
import { mapHoldingsToScoreDistribution } from "@/data/portfolio/mappers";
import type { PortfolioSummary } from "@/data/portfolio/portfolio.types";

const emptyTrends = {
  totalValue: [0],
  todayChange: [0],
  totalGainLoss: [0],
};

export const buildEmptyDashboardData = (summary: PortfolioSummary): DashboardData => {
  const scoreDistribution = mapPortfolioScoreDistributionToDashboard(
    mapHoldingsToScoreDistribution([]),
  );
  const metrics = buildDashboardMetrics(summary, scoreDistribution, emptyTrends);

  return {
    metrics,
    holdings: [],
    assetAllocation: mapHoldingsToDashboardAssetAllocation([], summary),
    sectorExposure: mapHoldingsToDashboardSectorExposure([], summary),
    performance: [],
    recentActivities: [],
    scoreDistribution,
    upcomingEarnings: [],
    aiInsight: null,
  };
};
