import {
  portfolioValueTrend,
  todayChangeTrend,
  totalGainLossTrend,
} from "@/data/dashboard/metricTrends.mock";
import { dashboardMockData } from "@/data/dashboard/dashboard.mock";
import {
  buildDashboardMetrics,
  mapHoldingsToDashboardAssetAllocation,
  mapHoldingsToDashboardSectorExposure,
  mapPortfolioScoreDistributionToDashboard,
} from "@/data/dashboard/mappers";
import type { DashboardData } from "@/data/dashboard/dashboard.types";
import { mapHoldingsToScoreDistribution } from "@/data/portfolio/mappers";
import type {
  EnrichedPortfolioHolding,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { mergeStockProfileIntoStockItem } from "@/utils/financial-data/mergeStockProfileIntoStockItem";
import { mapEnrichedHoldingsToDashboardHoldings } from "@/utils/portfolio/mapEnrichedHoldingsToDashboardHoldings";
import { buildEmptyDashboardData } from "@/utils/dashboard/buildEmptyDashboardData";

type BuildLiveDashboardDataInput = {
  enrichedHoldings: EnrichedPortfolioHolding[];
  summary: PortfolioSummary;
  bundles: Record<string, StockProviderDataBundle>;
  isLoading: boolean;
  isUsingDemoPortfolio: boolean;
};

export const buildLiveDashboardData = ({
  enrichedHoldings,
  summary,
  bundles,
  isLoading,
  isUsingDemoPortfolio,
}: BuildLiveDashboardDataInput): DashboardData => {
  const hasHoldings = enrichedHoldings.length > 0;

  if (!isUsingDemoPortfolio) {
    if (isLoading && !hasHoldings) {
      return buildEmptyDashboardData(summary);
    }

    if (!hasHoldings) {
      return buildEmptyDashboardData(summary);
    }
  }

  if (isUsingDemoPortfolio && !hasHoldings && isLoading) {
    return dashboardMockData;
  }

  if (isUsingDemoPortfolio && !hasHoldings) {
    return buildEmptyDashboardData(summary);
  }

  const holdings = mapEnrichedHoldingsToDashboardHoldings(enrichedHoldings);
  const scoreDistribution = mapPortfolioScoreDistributionToDashboard(
    mapHoldingsToScoreDistribution(enrichedHoldings),
  );
  const metrics = buildDashboardMetrics(summary, scoreDistribution, {
    totalValue: portfolioValueTrend,
    todayChange: todayChangeTrend,
    totalGainLoss: totalGainLossTrend,
  });

  if (isUsingDemoPortfolio) {
    return {
      ...dashboardMockData,
      metrics,
      holdings,
      assetAllocation: mapHoldingsToDashboardAssetAllocation(
        enrichedHoldings,
        summary,
      ),
      sectorExposure: mapHoldingsToDashboardSectorExposure(enrichedHoldings, summary),
      scoreDistribution,
      recentActivities: dashboardMockData.recentActivities.map((activity) =>
        mergeStockProfileIntoStockItem(activity, bundles[activity.symbol]),
      ),
      upcomingEarnings: dashboardMockData.upcomingEarnings.map((earning) =>
        mergeStockProfileIntoStockItem(earning, bundles[earning.symbol]),
      ),
    };
  }

  return {
    metrics,
    holdings,
    assetAllocation: mapHoldingsToDashboardAssetAllocation(
      enrichedHoldings,
      summary,
    ),
    sectorExposure: mapHoldingsToDashboardSectorExposure(enrichedHoldings, summary),
    scoreDistribution,
    performance: [],
    recentActivities: [],
    upcomingEarnings: [],
    aiInsight: null,
  };
};
