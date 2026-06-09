import type {
  NewsFilterContext,
  NewsFilterKey,
  NewsFilters,
  NewsItem,
} from "@/data/news/news.types";

const matchesCategoryFilter = (
  item: NewsItem,
  filterKey: NewsFilterKey,
  context: NewsFilterContext,
): boolean => {
  if (filterKey === "all") {
    return true;
  }

  if (filterKey === "portfolio") {
    return (
      item.category === "portfolio" ||
      item.relatedSymbols.some((symbol) => context.portfolioSymbols.includes(symbol))
    );
  }

  if (filterKey === "watchlist") {
    return (
      item.category === "watchlist" ||
      item.relatedSymbols.some((symbol) => context.watchlistSymbols.includes(symbol))
    );
  }

  return item.category === filterKey;
};

const matchesSearchQuery = (item: NewsItem, searchQuery: string): boolean => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return true;
  }

  const haystack = [
    item.title,
    item.summary,
    item.source,
    ...item.relatedSymbols,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};

export const filterNewsItems = (
  items: NewsItem[],
  filters: NewsFilters,
  context: NewsFilterContext,
): NewsItem[] =>
  items.filter(
    (item) =>
      matchesCategoryFilter(item, filters.filterKey, context) &&
      matchesSearchQuery(item, filters.searchQuery),
  );
