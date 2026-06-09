import { reportsMockActivities } from "@/data/reports/reports.mock";
import type { PortfolioActivity } from "@/data/portfolio/portfolio.types";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

const ACTIVITY_LIMIT = 10;

export const buildReportActivities = (
  holdings: EnrichedPortfolioHolding[],
  hasHoldings: boolean,
  isUsingDemoPortfolio = true,
): PortfolioActivity[] => {
  if (!hasHoldings || holdings.length === 0) {
    return isUsingDemoPortfolio ? reportsMockActivities : [];
  }

  return [...holdings]
    .map((holding) => ({
      symbol: holding.symbol,
      companyName: holding.companyName,
      logoUrl: holding.logoUrl,
      type: "added" as const,
      date: holding.purchaseDate ?? holding.createdAt,
      value: holding.totalCost,
      currency: holding.purchaseCurrency,
      descriptionKey: "addedHolding",
      tone: "positive" as const,
    }))
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, ACTIVITY_LIMIT);
};
