import type {
  PortfolioHolding,
  PortfolioHoldingFormInput,
} from "@/data/portfolio/portfolio.types";

export const updatePortfolioHolding = (
  holdings: PortfolioHolding[],
  id: string,
  input: Partial<PortfolioHoldingFormInput>,
): PortfolioHolding[] => {
  const now = new Date().toISOString();

  return holdings.map((holding) => {
    if (holding.id !== id) {
      return holding;
    }

    return {
      ...holding,
      ...(input.symbol !== undefined
        ? { symbol: input.symbol.trim().toUpperCase() }
        : {}),
      ...(input.shares !== undefined ? { shares: input.shares } : {}),
      ...(input.averageCost !== undefined
        ? { averageCost: input.averageCost }
        : {}),
      ...(input.purchaseCurrency !== undefined
        ? { purchaseCurrency: input.purchaseCurrency }
        : {}),
      ...(input.purchaseDate !== undefined
        ? { purchaseDate: input.purchaseDate }
        : {}),
      ...(input.accountName !== undefined
        ? { accountName: input.accountName }
        : {}),
      ...(input.accountType !== undefined
        ? { accountType: input.accountType }
        : {}),
      ...(input.targetAllocationPercent !== undefined
        ? { targetAllocationPercent: input.targetAllocationPercent }
        : {}),
      ...(input.strategyTag !== undefined
        ? { strategyTag: input.strategyTag }
        : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      updatedAt: now,
    };
  });
};

export const updatePortfolioHoldingNotes = (
  holdings: PortfolioHolding[],
  id: string,
  notes: string,
): PortfolioHolding[] =>
  updatePortfolioHolding(holdings, id, { notes });
