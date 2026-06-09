import type { WatchlistItem } from "@/data/watchlist/watchlist.types";

export const mapWatchlistItemToTrendValues = (watchlistItem: WatchlistItem) =>
  watchlistItem.opportunityTrend.map((trendPoint) => trendPoint.score);
