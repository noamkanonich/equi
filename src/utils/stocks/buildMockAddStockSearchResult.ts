import type { AddStockAnalystRating, AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { MockStockSearchEntry } from "@/data/stocks/stock-search.mock";
import { getStockScoreBySymbol } from "@/utils/scoring/getStockScoreBySymbol";

const buildSparkline = (price: number): number[] => {
  const base = price * 0.97;
  const step = (price - base) / 6;
  return Array.from({ length: 7 }, (_, index) =>
    Number((base + step * index).toFixed(2)),
  );
};

const mapScoreToAnalystRating = (score: number): AddStockAnalystRating => {
  if (score >= 80) return "buy";
  if (score >= 65) return "hold";
  return "watch";
};

const hashSymbol = (symbol: string): number => {
  let hash = 0;
  for (let index = 0; index < symbol.length; index += 1) {
    hash = (hash + symbol.charCodeAt(index) * (index + 1)) % 997;
  }
  return hash;
};

export const buildMockAddStockSearchResult = (
  entry: MockStockSearchEntry,
): AddStockSearchResult => {
  const score = getStockScoreBySymbol(entry.symbol).score;
  const price = entry.defaultPrice;
  const analystRating = mapScoreToAnalystRating(score);
  const analystRatingScore =
    analystRating === "buy" ? 4.2 : analystRating === "hold" ? 3.4 : 3.0;
  const dayChangePercent = Number((((hashSymbol(entry.symbol) % 500) - 150) / 100).toFixed(2));

  return {
    assetId: `US:${entry.symbol}`,
    symbol: entry.symbol,
    displaySymbol: entry.symbol,
    companyName: entry.companyName,
    logoUrl: entry.logoUrl ?? null,
    exchange: entry.exchange,
    market: "US",
    assetType: entry.assetType,
    provider: "mock",
    providerSymbol: entry.symbol,
    hasLivePrice: true,
    sector: entry.sector ?? "—",
    industry: entry.industry ?? "—",
    price,
    currency: entry.currency,
    dayChangePercent: Number(dayChangePercent),
    score,
    marketCap: price * 1_000_000_000,
    weekRangeLow: Number((price * 0.82).toFixed(2)),
    weekRangeHigh: Number((price * 1.18).toFixed(2)),
    analystRating,
    analystRatingScore,
    sparkline: buildSparkline(price),
    isMock: true,
    isFallback: true,
  };
};
