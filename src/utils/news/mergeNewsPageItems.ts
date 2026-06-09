import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { mapStockProviderNewsItemToNewsItem, mergeNewsItems } from "@/data/news/mappers";
import type { NewsFilterContext, NewsItem } from "@/data/news/news.types";

export const mergeNewsPageItems = (
  baseline: NewsItem[],
  bundles: Record<string, StockProviderDataBundle>,
  symbols: string[],
  context: NewsFilterContext,
): NewsItem[] => {
  const providerItems: NewsItem[] = [];

  for (const symbol of symbols) {
    const bundle = bundles[symbol];
    if (!bundle?.news?.length) {
      continue;
    }

    for (const newsItem of bundle.news) {
      providerItems.push(
        mapStockProviderNewsItemToNewsItem(newsItem, {
          portfolioSymbols: context.portfolioSymbols,
          watchlistSymbols: context.watchlistSymbols,
          isFallback: bundle.meta.isFallback,
          provider: bundle.meta.provider,
        }),
      );
    }
  }

  return mergeNewsItems(baseline, providerItems);
};
