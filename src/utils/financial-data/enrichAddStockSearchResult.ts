import type {
  AddStockAnalystRating,
  AddStockSearchResult,
} from "@/data/add-stock/add-stock.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { getStockScoreBySymbol } from "@/utils/scoring/getStockScoreBySymbol";
import { mergeStockBundleIntoStockItem } from "./mergeStockProfileIntoStockItem";

const FALLBACK_ANALYST_RATING_SCORE = 3;
const SPARKLINE_POINT_COUNT = 7;

const resolveAnalystRating = (
  bundle: StockProviderDataBundle | undefined,
  fallback: AddStockAnalystRating,
): AddStockAnalystRating => {
  const consensus = bundle?.analystTarget?.consensus;

  if (consensus === "buy" || consensus === "hold") {
    return consensus;
  }

  return fallback;
};

const resolveAnalystRatingScore = (
  bundle: StockProviderDataBundle | undefined,
  fallback: number,
): number => {
  const distribution = bundle?.analystTarget?.distribution;
  if (!distribution) {
    return fallback > 0 ? fallback : FALLBACK_ANALYST_RATING_SCORE;
  }

  const total = distribution.buy + distribution.hold + distribution.sell;
  if (total === 0) {
    return fallback > 0 ? fallback : FALLBACK_ANALYST_RATING_SCORE;
  }

  const weightedRating =
    (distribution.buy * 5 + distribution.hold * 3 + distribution.sell * 1) / total;

  return Number(weightedRating.toFixed(1));
};

const buildSparklineFromBundle = (
  item: AddStockSearchResult,
  bundle: StockProviderDataBundle | undefined,
): number[] => {
  const historyPoints = bundle?.priceHistory?.points ?? [];
  const closePrices = historyPoints
    .slice(-SPARKLINE_POINT_COUNT)
    .map((point) => point.close)
    .filter((price) => price > 0);

  if (closePrices.length >= 2) {
    return closePrices;
  }

  const quote = bundle?.quote;
  if (quote && quote.previousClose > 0 && quote.price > 0) {
    const step = (quote.price - quote.previousClose) / (SPARKLINE_POINT_COUNT - 1);

    return Array.from({ length: SPARKLINE_POINT_COUNT }, (_, index) =>
      Number((quote.previousClose + step * index).toFixed(2)),
    );
  }

  if (item.sparkline.length > 0) {
    return item.sparkline;
  }

  return item.price > 0 ? Array(SPARKLINE_POINT_COUNT).fill(item.price) : [];
};

export const enrichAddStockSearchResult = (
  item: AddStockSearchResult,
  bundle: StockProviderDataBundle | undefined,
): AddStockSearchResult => {
  if (item.hasLivePrice === false) {
    return item;
  }

  const merged = mergeStockBundleIntoStockItem(
    {
      symbol: item.symbol,
      companyName: item.companyName,
      logoUrl: item.logoUrl,
      currentPrice: item.price,
      dayChangePercent: item.dayChangePercent,
      exchange: item.exchange,
      sector: item.sector,
    },
    bundle,
  );

  return {
    ...item,
    companyName: merged.companyName,
    logoUrl: merged.logoUrl,
    price: merged.currentPrice,
    dayChangePercent: merged.dayChangePercent,
    exchange: merged.exchange ?? item.exchange,
    sector: merged.sector ?? item.sector,
    industry: bundle?.profile?.industry ?? item.industry,
    currency: bundle?.quote?.currency ?? bundle?.profile?.currency ?? item.currency,
    score: getStockScoreBySymbol(item.symbol).score,
    marketCap: bundle?.quote?.marketCap ?? bundle?.profile?.marketCap ?? item.marketCap,
    weekRangeLow: bundle?.quote?.dayLow ?? item.weekRangeLow,
    weekRangeHigh: bundle?.quote?.dayHigh ?? item.weekRangeHigh,
    analystRating: resolveAnalystRating(bundle, item.analystRating),
    analystRatingScore: resolveAnalystRatingScore(bundle, item.analystRatingScore),
    sparkline: buildSparklineFromBundle(item, bundle),
    isMock: item.isMock ?? bundle?.meta?.isFallback ?? false,
    isFallback: item.isFallback ?? bundle?.meta?.isFallback ?? false,
  };
};
