import type {
  PortfolioHolding,
  PortfolioHoldingFormInput,
} from "@/data/portfolio/portfolio.types";

export const defaultPortfolioHoldingFormInput = (): PortfolioHoldingFormInput => ({
  symbol: "",
  shares: 1,
  averageCost: 0,
  purchaseCurrency: "USD",
  purchaseDate: "",
  accountName: "",
  accountType: undefined,
  targetAllocationPercent: undefined,
  strategyTag: undefined,
  notes: "",
});

export const mapHoldingToFormInput = (
  holding: PortfolioHolding,
): PortfolioHoldingFormInput => ({
  symbol: holding.symbol,
  assetId: holding.assetId,
  market: holding.market,
  exchange: holding.exchange,
  provider: holding.provider,
  providerSymbol: holding.providerSymbol,
  shares: holding.shares,
  averageCost: holding.averageCost,
  purchaseCurrency: holding.purchaseCurrency,
  purchaseDate: holding.purchaseDate ?? "",
  accountName: holding.accountName ?? "",
  accountType: holding.accountType,
  targetAllocationPercent: holding.targetAllocationPercent,
  strategyTag: holding.strategyTag,
  notes: holding.notes ?? "",
});
