import type {
  WatchlistFilters,
  WatchlistItem,
} from "@/data/watchlist/watchlist.types";

export const filterWatchlistItems = (
  watchlistItems: WatchlistItem[],
  filters: WatchlistFilters,
) => {
  return watchlistItems.filter((watchlistItem) =>
    (filters.statuses.length === 0 ||
      filters.statuses.includes(watchlistItem.status)) &&
    (filters.actions.length === 0 ||
      filters.actions.includes(watchlistItem.action)) &&
    (filters.minimumOpportunityScore === null ||
      watchlistItem.opportunityScore >= filters.minimumOpportunityScore) &&
    (!filters.favoritesOnly || watchlistItem.isFavorite),
  );
};
