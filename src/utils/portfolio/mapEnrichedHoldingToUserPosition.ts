import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";
import type { StockUserPosition } from "@/data/stocks/stock-analysis.types";

export const mapEnrichedHoldingToUserPosition = (
  holding: EnrichedPortfolioHolding | undefined,
): StockUserPosition | null => {
  if (!holding) {
    return null;
  }

  return {
    shares: holding.shares,
    avgCost: holding.averageCost,
    marketValue: holding.marketValue,
    dayGainLoss: holding.dayGainLoss,
    dayGainLossPercent: holding.dayChangePercent,
    totalGainLoss: holding.totalGainLoss,
    totalGainLossPercent: holding.totalGainLossPercent,
    currency: holding.purchaseCurrency,
  };
};
