import { portfolioMockData } from "@/data/portfolio/portfolio.mock";
import {
  buildPortfolioMetrics,
  mapHoldingsToAllocation,
  mapHoldingsToScoreDistribution,
  mapHoldingsToTopMovers,
  mapHoldingsToView,
} from "@/data/portfolio/mappers";
import type { PortfolioData } from "@/data/portfolio/portfolio.types";
import type {
  EnrichedPortfolioHolding,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { mergeStockProfileIntoStockItem } from "@/utils/financial-data/mergeStockProfileIntoStockItem";
import { recalculatePortfolioMetrics } from "@/utils/financial-data/recalculateHoldingsMetrics";
import { buildEmptyPortfolioData } from "@/utils/portfolio/buildEmptyPortfolioData";

type BuildLivePortfolioDataInput = {
  enrichedHoldings: EnrichedPortfolioHolding[];
  summary: PortfolioSummary;
  bundles: Record<string, StockProviderDataBundle>;
  isLoading: boolean;
  isUsingDemoPortfolio: boolean;
};

export const buildLivePortfolioData = ({
  enrichedHoldings,
  summary,
  bundles,
  isLoading,
  isUsingDemoPortfolio,
}: BuildLivePortfolioDataInput): PortfolioData => {
  const hasHoldings = enrichedHoldings.length > 0;

  if (!isUsingDemoPortfolio) {
    if (isLoading && !hasHoldings) {
      return buildEmptyPortfolioData(summary);
    }

    if (!hasHoldings) {
      return buildEmptyPortfolioData(summary);
    }
  }

  const holdingViews = mapHoldingsToView(enrichedHoldings, summary.totalValue);
  const scoreDistribution = mapHoldingsToScoreDistribution(enrichedHoldings);
  const metricTrends = isUsingDemoPortfolio
    ? {
        totalValue:
          portfolioMockData.metrics.find((metric) => metric.kind === "totalValue")
            ?.trend ?? [],
        todayChange:
          portfolioMockData.metrics.find((metric) => metric.kind === "todayChange")
            ?.trend ?? [],
        totalReturn:
          portfolioMockData.metrics.find((metric) => metric.kind === "totalReturn")
            ?.trend ?? [],
      }
    : {
        totalValue: [],
        todayChange: [],
        totalReturn: [],
      };

  const baseMetrics = buildPortfolioMetrics(summary, metricTrends, scoreDistribution);
  const metrics =
    isUsingDemoPortfolio && isLoading && !hasHoldings
      ? portfolioMockData.metrics
      : recalculatePortfolioMetrics(baseMetrics, enrichedHoldings, summary);

  if (isUsingDemoPortfolio) {
    return {
      ...portfolioMockData,
      holdings: enrichedHoldings,
      metrics,
      summary,
      scoreDistribution,
      assetAllocation: mapHoldingsToAllocation(holdingViews, summary),
      topMovers: mapHoldingsToTopMovers(holdingViews),
      upcomingEarnings: portfolioMockData.upcomingEarnings.map((earning) =>
        mergeStockProfileIntoStockItem(earning, bundles[earning.symbol]),
      ),
      recentActivity: portfolioMockData.recentActivity.map((activity) =>
        mergeStockProfileIntoStockItem(activity, bundles[activity.symbol]),
      ),
    };
  }

  return {
    summary,
    metrics,
    holdings: enrichedHoldings,
    performance: [],
    assetAllocation: mapHoldingsToAllocation(holdingViews, summary),
    topMovers: mapHoldingsToTopMovers(holdingViews),
    upcomingEarnings: [],
    recentActivity: [],
    scoreDistribution,
    aiInsight: buildEmptyPortfolioData(summary).aiInsight,
  };
};
