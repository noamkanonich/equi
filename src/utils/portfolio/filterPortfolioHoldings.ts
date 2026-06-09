import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

export type PortfolioHoldingsFilter = "all" | "winners" | "losers";

export const filterPortfolioHoldings = (
  holdings: EnrichedPortfolioHolding[],
  filter: PortfolioHoldingsFilter,
): EnrichedPortfolioHolding[] => {
  if (filter === "winners") {
    return holdings.filter((holding) => holding.dayChangePercent > 0);
  }

  if (filter === "losers") {
    return holdings.filter((holding) => holding.dayChangePercent < 0);
  }

  return holdings;
};
