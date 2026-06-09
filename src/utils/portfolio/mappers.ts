import type { PortfolioAllocationKey } from "@/data/portfolio/portfolio.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import {
  buildRecentCloseTrend,
  buildRecentPriceChanges,
} from "@/utils/financial-data/buildRecentPriceChanges";
import { calculateStockScoreFromMarketData } from "@/utils/scoring/calculateStockScoreFromMarketData";

export const mapSectorToAllocationKey = (
  sector?: string,
): PortfolioAllocationKey => {
  if (!sector) {
    return "technology";
  }

  const normalized = sector.toLowerCase();

  if (normalized.includes("technology") || normalized.includes("tech")) {
    return "technology";
  }
  if (normalized.includes("communication")) {
    return "communication";
  }
  if (normalized.includes("consumer cyclical") || normalized.includes("cyclical")) {
    return "consumerCyclical";
  }
  if (normalized.includes("consumer defensive") || normalized.includes("defensive")) {
    return "consumerDefensive";
  }
  if (normalized.includes("health")) {
    return "healthcare";
  }

  return "technology";
};

export const mapBundleToProviderFields = (
  symbol: string,
  bundle: StockProviderDataBundle | undefined,
  fallback?: {
    companyName: string;
    logoUrl?: string | null;
    currentPrice: number;
    dayChangePercent: number;
    recentCloses?: number[];
  },
) => {
  const quote = bundle?.quote;
  const profile = bundle?.profile;

  const currentPrice = quote?.price ?? fallback?.currentPrice ?? 0;
  const dayChangePercent = quote?.changePercent ?? fallback?.dayChangePercent ?? 0;
  const dayChange =
    quote?.change ?? currentPrice * (dayChangePercent / 100);
  const recentDayChanges = buildRecentPriceChanges({
    priceHistory: bundle?.priceHistory,
    currentPrice,
    previousClose: quote?.previousClose,
    updatedAt: quote?.updatedAt,
    fallbackCloses: fallback?.recentCloses,
  });
  const scoreResult = calculateStockScoreFromMarketData({
    symbol,
    companyName: profile?.companyName ?? fallback?.companyName,
    bundle,
    dayChangePercent,
    recentDayChanges,
  });

  return {
    companyName: profile?.companyName ?? fallback?.companyName ?? symbol,
    logoUrl: profile?.logoUrl ?? fallback?.logoUrl ?? null,
    exchange: profile?.exchange,
    sector: mapSectorToAllocationKey(profile?.sector),
    currentPrice,
    dayChange: Number(dayChange.toFixed(4)),
    dayChangePercent,
    marketCap: quote?.marketCap ?? profile?.marketCap,
    score: scoreResult.score,
    trend: buildRecentCloseTrend({
      priceHistory: bundle?.priceHistory,
      currentPrice,
      fallbackCloses: fallback?.recentCloses,
    }),
    recentDayChanges,
    dataMeta: bundle?.meta,
  };
};

export {
  filterPortfolioHoldings,
  type PortfolioHoldingsFilter,
} from "./filterPortfolioHoldings";
export {
  sortPortfolioHoldings,
  type PortfolioHoldingSort,
} from "./sortPortfolioHoldings";
