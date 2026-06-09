export type NewsCategory =
  | "market"
  | "portfolio"
  | "watchlist"
  | "earnings"
  | "analysts"
  | "reports";

export type NewsSentiment = "positive" | "neutral" | "negative";

export type NewsSource = "mock" | "fmp" | "finnhub";

export type NewsFilterKey =
  | "all"
  | "portfolio"
  | "watchlist"
  | "market"
  | "earnings"
  | "analysts"
  | "reports";

export type NewsSortKey = "newest" | "relevant";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  imageUrl?: string;
  publishedAt: string;
  category: NewsCategory;
  sentiment: NewsSentiment;
  relatedSymbols: string[];
  isFallback?: boolean;
  isFeatured?: boolean;
  dataSource?: NewsSource;
};

export type MarketPulseTrend = "up" | "down" | "neutral";

export type MarketPulseItem = {
  id: string;
  text: string;
  trend: MarketPulseTrend;
};

export type PortfolioNewsItem = {
  id: string;
  symbol: string;
  headline: string;
  publishedAt: string;
  newsItemId?: string;
};

export type UpcomingNewsEventType = "earnings" | "macro" | "conference";

export type UpcomingNewsEvent = {
  id: string;
  symbol: string;
  label: string;
  date: string;
  type: UpcomingNewsEventType;
};

export type NewsPageData = {
  items: NewsItem[];
  marketPulse: MarketPulseItem[];
  portfolioNews: PortfolioNewsItem[];
  upcomingEvents: UpcomingNewsEvent[];
};

export type NewsFilterContext = {
  portfolioSymbols: string[];
  watchlistSymbols: string[];
};

export type NewsFilters = {
  filterKey: NewsFilterKey;
  sortKey: NewsSortKey;
  searchQuery: string;
};
