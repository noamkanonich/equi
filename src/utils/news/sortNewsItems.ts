import type {
  NewsFilterContext,
  NewsItem,
  NewsSortKey,
} from "@/data/news/news.types";

const getPublishedTimestamp = (item: NewsItem): number =>
  new Date(item.publishedAt).getTime();

const getRelevanceScore = (
  item: NewsItem,
  context: NewsFilterContext,
): number => {
  let score = 0;

  if (item.relatedSymbols.some((symbol) => context.portfolioSymbols.includes(symbol))) {
    score += 3;
  }

  if (item.relatedSymbols.some((symbol) => context.watchlistSymbols.includes(symbol))) {
    score += 2;
  }

  if (item.isFeatured) {
    score += 1;
  }

  return score;
};

export const sortNewsItems = (
  items: NewsItem[],
  sortKey: NewsSortKey,
  context: NewsFilterContext,
): NewsItem[] => {
  const sorted = [...items];

  if (sortKey === "newest") {
    return sorted.sort(
      (left, right) => getPublishedTimestamp(right) - getPublishedTimestamp(left),
    );
  }

  return sorted.sort((left, right) => {
    const relevanceDiff =
      getRelevanceScore(right, context) - getRelevanceScore(left, context);

    if (relevanceDiff !== 0) {
      return relevanceDiff;
    }

    return getPublishedTimestamp(right) - getPublishedTimestamp(left);
  });
};
