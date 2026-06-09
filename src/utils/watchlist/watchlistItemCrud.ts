import type {
  WatchlistItemFormInput,
  WatchlistStoredItem,
} from "@/data/watchlist/watchlist.types";
import { isSymbolInWatchlist } from "@/utils/app-data/isSymbolInWatchlist";

export const addWatchlistItem = (
  items: WatchlistStoredItem[],
  input: WatchlistItemFormInput,
): WatchlistStoredItem[] => {
  const symbol = input.symbol.trim().toUpperCase();

  if (isSymbolInWatchlist(items, symbol)) {
    return items;
  }

  const now = new Date().toISOString();

  const newItem: WatchlistStoredItem = {
    id: crypto.randomUUID(),
    symbol,
    assetId: input.assetId ?? `US:${symbol}`,
    market: input.market ?? "US",
    exchange: input.exchange,
    currency: input.currency ?? input.buyZone.currency,
    provider: input.provider ?? "fmp",
    providerSymbol: input.providerSymbol ?? symbol,
    buyZone: input.buyZone,
    targetPrice: input.targetPrice,
    notes: input.notes,
    status: input.status ?? "watchClosely",
    createdAt: now,
    updatedAt: now,
    qualityScore: 70,
    opportunityScore: 65,
    trigger: { summaryKey: "rows.default.trigger" },
    action: "reviewStock",
    isFavorite: false,
    whyWatchingKey: "rows.default.whyWatching",
    monitorKeys: [],
    opportunityTrend: [],
  };

  return [...items, newItem];
};

export const updateWatchlistItem = (
  items: WatchlistStoredItem[],
  id: string,
  input: Partial<WatchlistItemFormInput>,
): WatchlistStoredItem[] =>
  items.map((item) =>
    item.id === id
      ? {
          ...item,
          ...input,
          symbol: input.symbol ? input.symbol.trim().toUpperCase() : item.symbol,
          assetId: input.assetId ?? item.assetId,
          market: input.market ?? item.market,
          exchange: input.exchange ?? item.exchange,
          currency: input.currency ?? item.currency,
          provider: input.provider ?? item.provider,
          providerSymbol: input.providerSymbol ?? item.providerSymbol,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );

export const removeWatchlistItem = (
  items: WatchlistStoredItem[],
  id: string,
): WatchlistStoredItem[] => items.filter((item) => item.id !== id);
