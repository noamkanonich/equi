import type { WatchlistStoredItem } from "@/data/watchlist/watchlist.types";

export const isSymbolInWatchlist = (
  items: WatchlistStoredItem[],
  symbol: string,
): boolean => {
  const normalized = symbol.trim().toUpperCase();
  return items.some((item) => item.symbol === normalized);
};

export const isSymbolInPortfolio = (
  holdings: { symbol: string }[],
  symbol: string,
): boolean => {
  const normalized = symbol.trim().toUpperCase();
  return holdings.some((holding) => holding.symbol === normalized);
};
