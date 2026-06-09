import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";

export type PortfolioHoldingSort = "symbolAsc" | "symbolDesc" | "scoreHigh" | "scoreLow";

export const sortPortfolioHoldings = (
  holdings: EnrichedPortfolioHolding[],
  sort: PortfolioHoldingSort,
): EnrichedPortfolioHolding[] => {
  const sorted = [...holdings];

  switch (sort) {
    case "symbolAsc":
      return sorted.sort((a, b) => a.symbol.localeCompare(b.symbol));
    case "symbolDesc":
      return sorted.sort((a, b) => b.symbol.localeCompare(a.symbol));
    case "scoreHigh":
      return sorted.sort((a, b) => b.score - a.score);
    case "scoreLow":
      return sorted.sort((a, b) => a.score - b.score);
    default:
      return sorted;
  }
};
