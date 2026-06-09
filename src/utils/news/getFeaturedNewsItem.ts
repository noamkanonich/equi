import type { NewsItem } from "@/data/news/news.types";

export const getFeaturedNewsItem = (items: NewsItem[]): NewsItem | null => {
  if (items.length === 0) {
    return null;
  }

  const featured = items.find((item) => item.isFeatured);
  if (featured) {
    return featured;
  }

  return items[0] ?? null;
};
