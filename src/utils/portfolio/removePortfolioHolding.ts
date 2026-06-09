import type { PortfolioHolding } from "@/data/portfolio/portfolio.types";

export const removePortfolioHolding = (
  holdings: PortfolioHolding[],
  id: string,
): PortfolioHolding[] => holdings.filter((holding) => holding.id !== id);
