import type {
  PortfolioHolding,
  PortfolioHoldingFormInput,
} from "@/data/portfolio/portfolio.types";

export const addPortfolioHolding = (
  holdings: PortfolioHolding[],
  input: PortfolioHoldingFormInput,
): PortfolioHolding[] => {
  const now = new Date().toISOString();
  const newHolding: PortfolioHolding = {
    id: crypto.randomUUID(),
    symbol: input.symbol.trim().toUpperCase(),
    assetId: input.assetId ?? `US:${input.symbol.trim().toUpperCase()}`,
    market: input.market ?? "US",
    exchange: input.exchange,
    provider: input.provider ?? "fmp",
    providerSymbol: input.providerSymbol ?? input.symbol.trim().toUpperCase(),
    shares: input.shares,
    averageCost: input.averageCost,
    purchaseCurrency: input.purchaseCurrency,
    purchaseDate: input.purchaseDate,
    accountName: input.accountName,
    accountType: input.accountType,
    targetAllocationPercent: input.targetAllocationPercent,
    strategyTag: input.strategyTag,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };

  return [...holdings, newHolding];
};
