import type { NewsFilterContext, NewsItem, PortfolioNewsItem } from "@/data/news/news.types";
import { mapNewsItemToPortfolioNewsItem } from "@/data/news/mappers";

export const getPortfolioRelatedNews = (
  items: NewsItem[],
  context: NewsFilterContext,
  limit = 3,
): PortfolioNewsItem[] => {
  const portfolioItems = items.filter((item) =>
    item.relatedSymbols.some((symbol) => context.portfolioSymbols.includes(symbol)),
  );

  return portfolioItems.slice(0, limit).map(mapNewsItemToPortfolioNewsItem);
};
