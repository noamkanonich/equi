import type { StockProviderNewsItem } from "@/data/financial-data/financial-data.types";
import type {
  NewsCategory,
  NewsFilterKey,
  NewsItem,
  NewsSource,
  PortfolioNewsItem,
} from "./news.types";

export const newsFilterKeys: NewsFilterKey[] = [
  "all",
  "portfolio",
  "watchlist",
  "market",
  "earnings",
  "analysts",
  "reports",
];

const earningsKeywords = ["earnings", "quarter", "results", "revenue", "eps"];
const analystKeywords = ["analyst", "price target", "upgrade", "downgrade", "rating"];
const reportKeywords = ["report", "outlook", "forecast", "guidance"];

export const inferNewsCategory = (
  item: Pick<StockProviderNewsItem, "title" | "summary" | "symbol" | "relatedSymbols">,
  context: { portfolioSymbols: string[]; watchlistSymbols: string[] },
): NewsCategory => {
  const text = `${item.title} ${item.summary ?? ""}`.toLowerCase();
  const symbols = [item.symbol, ...(item.relatedSymbols ?? [])].map((symbol) =>
    symbol.toUpperCase(),
  );

  if (earningsKeywords.some((keyword) => text.includes(keyword))) {
    return "earnings";
  }

  if (analystKeywords.some((keyword) => text.includes(keyword))) {
    return "analysts";
  }

  if (reportKeywords.some((keyword) => text.includes(keyword))) {
    return "reports";
  }

  if (symbols.some((symbol) => context.portfolioSymbols.includes(symbol))) {
    return "portfolio";
  }

  if (symbols.some((symbol) => context.watchlistSymbols.includes(symbol))) {
    return "watchlist";
  }

  return "market";
};

const inferSentiment = (
  item: StockProviderNewsItem,
): NewsItem["sentiment"] => item.sentiment ?? "neutral";

const resolveNewsSource = (provider: string): NewsSource => {
  if (provider === "fmp") {
    return "fmp";
  }
  if (provider === "finnhub") {
    return "finnhub";
  }
  return "mock";
};

export const mapStockProviderNewsItemToNewsItem = (
  item: StockProviderNewsItem,
  context: {
    portfolioSymbols: string[];
    watchlistSymbols: string[];
    isFallback?: boolean;
    provider?: string;
  },
): NewsItem => ({
  id: item.id,
  title: item.title,
  summary: item.summary ?? "",
  source: item.source,
  url: item.url,
  imageUrl: item.imageUrl,
  publishedAt: item.publishedAt,
  category: inferNewsCategory(item, context),
  sentiment: inferSentiment(item),
  relatedSymbols: [item.symbol, ...(item.relatedSymbols ?? [])]
    .map((symbol) => symbol.toUpperCase())
    .filter((symbol, index, list) => list.indexOf(symbol) === index),
  isFallback: context.isFallback,
  dataSource: resolveNewsSource(context.provider ?? "mock"),
});

export const mapNewsItemToPortfolioNewsItem = (item: NewsItem): PortfolioNewsItem => ({
  id: `portfolio-news-${item.id}`,
  symbol: item.relatedSymbols[0] ?? "—",
  headline: item.title,
  publishedAt: item.publishedAt,
  newsItemId: item.id,
});

export const mergeNewsItems = (
  baseline: NewsItem[],
  providerItems: NewsItem[],
): NewsItem[] => {
  const seenIds = new Set<string>();
  const merged: NewsItem[] = [];

  for (const item of [...providerItems, ...baseline]) {
    if (seenIds.has(item.id)) {
      continue;
    }
    seenIds.add(item.id);
    merged.push(item);
  }

  return merged;
};
