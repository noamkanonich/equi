import type { WatchlistStoredItem } from "@/data/watchlist/watchlist.types";

export const createWatchlistStoredItemSeed = (
  partial: Omit<WatchlistStoredItem, "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  },
): WatchlistStoredItem => {
  const now = new Date().toISOString();

  return {
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
};
