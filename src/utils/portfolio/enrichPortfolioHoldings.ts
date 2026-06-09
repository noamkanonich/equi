import type {
  EnrichedPortfolioHolding,
  PortfolioHolding,
} from "@/data/portfolio/portfolio.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { portfolioMockQuoteFallbacks } from "@/data/portfolio/portfolio-quote-fallbacks.mock";
import type { PortfolioQuoteFallback } from "@/data/portfolio/portfolio-quote-fallbacks.mock";
import { mapBundleToProviderFields } from "./mappers";

const computeHoldingMetrics = (
  holding: PortfolioHolding,
  currentPrice: number,
  dayChange: number,
  totalPortfolioValue: number,
): Pick<
  EnrichedPortfolioHolding,
  | "marketValue"
  | "totalCost"
  | "totalGainLoss"
  | "totalGainLossPercent"
  | "dayGainLoss"
  | "weightPercent"
> => {
  const totalCost = holding.shares * holding.averageCost;
  const marketValue = holding.shares * currentPrice;
  const totalGainLoss = marketValue - totalCost;
  const totalGainLossPercent =
    totalCost === 0 ? 0 : (totalGainLoss / totalCost) * 100;
  const dayGainLoss = holding.shares * dayChange;
  const weightPercent =
    totalPortfolioValue === 0 ? 0 : (marketValue / totalPortfolioValue) * 100;

  return {
    marketValue: Number(marketValue.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    totalGainLoss: Number(totalGainLoss.toFixed(2)),
    totalGainLossPercent: Number(totalGainLossPercent.toFixed(2)),
    dayGainLoss: Number(dayGainLoss.toFixed(2)),
    weightPercent: Number(weightPercent.toFixed(2)),
  };
};

export const enrichPortfolioHolding = (
  holding: PortfolioHolding,
  bundle: StockProviderDataBundle | undefined,
  totalPortfolioValue: number,
  quoteFallbacks: Record<string, PortfolioQuoteFallback> = portfolioMockQuoteFallbacks,
): EnrichedPortfolioHolding => {
  const fallback = quoteFallbacks[holding.symbol];
  const provider = mapBundleToProviderFields(holding.symbol, bundle, fallback);
  const currentPrice =
    provider.currentPrice > 0 ? provider.currentPrice : holding.averageCost;

  const metrics = computeHoldingMetrics(
    holding,
    currentPrice,
    provider.dayChange,
    totalPortfolioValue,
  );

  return {
    ...holding,
    ...provider,
    currentPrice,
    ...metrics,
  };
};

export const enrichPortfolioHoldings = (
  holdings: PortfolioHolding[],
  bundles: Record<string, StockProviderDataBundle>,
  quoteFallbacks: Record<string, PortfolioQuoteFallback> = portfolioMockQuoteFallbacks,
): EnrichedPortfolioHolding[] => {
  const preliminary = holdings.map((holding) => {
    const fallback = quoteFallbacks[holding.symbol];
    const provider = mapBundleToProviderFields(
      holding.symbol,
      bundles[holding.symbol],
      fallback,
    );
    const currentPrice =
      provider.currentPrice > 0 ? provider.currentPrice : holding.averageCost;
    const marketValue = holding.shares * currentPrice;
    return { holding, provider, currentPrice, marketValue };
  });

  const holdingsMarketTotal = preliminary.reduce(
    (sum, item) => sum + item.marketValue,
    0,
  );

  return preliminary.map(({ holding }) =>
    enrichPortfolioHolding(
      holding,
      bundles[holding.symbol],
      holdingsMarketTotal,
      quoteFallbacks,
    ),
  );
};
