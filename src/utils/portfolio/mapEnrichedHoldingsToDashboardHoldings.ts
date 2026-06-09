import type { DashboardHolding } from "@/data/dashboard/dashboard.types";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

export const mapEnrichedHoldingToDashboardHolding = (
  holding: EnrichedPortfolioHolding,
): DashboardHolding => ({
  id: holding.id,
  symbol: holding.symbol,
  companyName: holding.companyName,
  logoUrl: holding.logoUrl,
  shares: holding.shares,
  avgCost: holding.averageCost,
  currentPrice: holding.currentPrice,
  currency: holding.purchaseCurrency,
  dayChangePercent: holding.dayChangePercent,
  score: holding.score,
  recentDayChanges: holding.recentDayChanges,
  trend: holding.trend,
});

export const mapEnrichedHoldingsToDashboardHoldings = (
  holdings: EnrichedPortfolioHolding[],
): DashboardHolding[] =>
  holdings.map(mapEnrichedHoldingToDashboardHolding);
