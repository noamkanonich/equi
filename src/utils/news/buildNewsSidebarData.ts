import type {
  MarketPulseItem,
  NewsItem,
  UpcomingNewsEvent,
} from "@/data/news/news.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";

export const buildMarketPulseFromNews = (items: NewsItem[]): MarketPulseItem[] =>
  items.slice(0, 3).map((item) => ({
    id: item.id,
    text: item.title,
    trend:
      item.sentiment === "positive"
        ? "up"
        : item.sentiment === "negative"
          ? "down"
          : "neutral",
  }));

export const buildUpcomingNewsEventsFromBundles = (
  portfolioSymbols: string[],
  stockDataBySymbol: Record<string, StockProviderDataBundle>,
): UpcomingNewsEvent[] => {
  const events: UpcomingNewsEvent[] = [];

  for (const symbol of portfolioSymbols) {
    const earnings = stockDataBySymbol[symbol]?.earnings?.[0];
    if (!earnings?.date) {
      continue;
    }

    events.push({
      id: `earnings-${symbol}`,
      symbol,
      label: symbol,
      date: earnings.date,
      type: "earnings",
    });
  }

  return events.slice(0, 5);
};
