import type {
  EnrichedPortfolioHolding,
  PortfolioCashBalance,
  PortfolioSummary,
} from "@/data/portfolio/portfolio.types";

type CalculatePortfolioSummaryOptions = {
  fallbackSummary?: PortfolioSummary;
  cashBalance: PortfolioCashBalance;
};

export const calculatePortfolioSummary = (
  holdings: EnrichedPortfolioHolding[],
  options: CalculatePortfolioSummaryOptions,
): PortfolioSummary => {
  const { cashBalance, fallbackSummary } = options;
  const currency = cashBalance.currency;

  if (holdings.length === 0) {
    return {
      totalValue: cashBalance.amount,
      todayChange: 0,
      todayChangePercent: 0,
      totalReturn: 0,
      totalReturnPercent: 0,
      cashAvailable: cashBalance.amount,
      portfolioScore: fallbackSummary?.portfolioScore ?? 0,
      currency,
    };
  }

  const holdingsMarketValue = holdings.reduce(
    (sum, holding) => sum + holding.marketValue,
    0,
  );
  const totalCost = holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
  const todayChange = holdings.reduce(
    (sum, holding) => sum + holding.dayGainLoss,
    0,
  );
  const totalReturn = holdingsMarketValue - totalCost;
  const totalValue = holdingsMarketValue + cashBalance.amount;

  const todayChangePercent =
    holdingsMarketValue === 0
      ? 0
      : (todayChange / holdingsMarketValue) * 100;
  const totalReturnPercent =
    totalCost === 0 ? 0 : (totalReturn / totalCost) * 100;

  const averageScore =
    holdingsMarketValue > 0
      ? holdings.reduce(
          (sum, holding) => sum + holding.score * holding.marketValue,
          0,
        ) / holdingsMarketValue
      : holdings.reduce((sum, holding) => sum + holding.score, 0) / holdings.length;

  return {
    totalValue: Number(totalValue.toFixed(2)),
    todayChange: Number(todayChange.toFixed(2)),
    todayChangePercent: Number(todayChangePercent.toFixed(2)),
    totalReturn: Number(totalReturn.toFixed(2)),
    totalReturnPercent: Number(totalReturnPercent.toFixed(2)),
    cashAvailable: cashBalance.amount,
    portfolioScore: Math.round(averageScore),
    currency,
  };
};
