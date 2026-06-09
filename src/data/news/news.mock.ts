import type { NewsPageData } from "./news.types";

const hoursAgo = (hours: number): string =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const daysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const newsPageMockData: NewsPageData = {
  items: [
    {
      id: "news-featured-nvda-ai-chips",
      title: "NVIDIA unveils next-generation AI chips with major performance leap",
      summary:
        "The new architecture targets data-center demand and could reshape competitive dynamics across the semiconductor sector.",
      source: "Reuters",
      url: "https://example.com/news/nvda-ai-chips",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      publishedAt: hoursAgo(0.6),
      category: "market",
      sentiment: "positive",
      relatedSymbols: ["NVDA", "AAPL", "TSLA"],
      isFeatured: true,
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-fed-rates",
      title: "Fed signals patience as inflation cools but remains above target",
      summary:
        "Markets are pricing in fewer cuts this year as officials emphasize data dependency.",
      source: "Bloomberg",
      url: "https://example.com/news/fed-rates",
      imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80",
      publishedAt: hoursAgo(1.5),
      category: "market",
      sentiment: "neutral",
      relatedSymbols: ["SPY", "TLT", "DXY"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-oil-supply",
      title: "Oil prices move after supply concerns in key producing regions",
      summary:
        "Energy equities reacted while broader indices stayed mixed amid cross-currents in demand data.",
      source: "CNBC",
      url: "https://example.com/news/oil-supply",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
      publishedAt: hoursAgo(3),
      category: "market",
      sentiment: "negative",
      relatedSymbols: ["XOM", "CVX"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-aapl-services",
      title: "Apple services momentum supports margin resilience into next quarter",
      summary:
        "Analysts note recurring revenue may offset softer hardware cycles in some regions.",
      source: "Barron's",
      url: "https://example.com/news/aapl-services",
      publishedAt: hoursAgo(5),
      category: "portfolio",
      sentiment: "positive",
      relatedSymbols: ["AAPL"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-msft-cloud",
      title: "Microsoft cloud growth remains a focus ahead of upcoming earnings",
      summary:
        "Enterprise demand trends and AI attach rates are key variables for the print.",
      source: "MarketWatch",
      publishedAt: hoursAgo(7),
      category: "portfolio",
      sentiment: "positive",
      relatedSymbols: ["MSFT"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-tsla-deliveries",
      title: "Tesla delivery expectations shift after recent channel checks",
      summary:
        "Investors are weighing pricing actions against volume targets for the quarter.",
      source: "Reuters",
      publishedAt: hoursAgo(9),
      category: "portfolio",
      sentiment: "negative",
      relatedSymbols: ["TSLA"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-nvda-earnings-preview",
      title: "NVIDIA earnings preview: data-center demand in the spotlight",
      summary:
        "Consensus expects strong revenue growth, with focus on supply and customer concentration.",
      source: "Seeking Alpha",
      publishedAt: hoursAgo(11),
      category: "earnings",
      sentiment: "positive",
      relatedSymbols: ["NVDA"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-amzn-analyst",
      title: "Analysts revisit Amazon price targets after retail margin update",
      summary:
        "Several firms adjusted models following recent operating efficiency commentary.",
      source: "TipRanks",
      publishedAt: hoursAgo(14),
      category: "analysts",
      sentiment: "neutral",
      relatedSymbols: ["AMZN"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-googl-report",
      title: "Alphabet ad trends report highlights mixed vertical performance",
      summary:
        "Search remained resilient while some brand budgets stayed cautious.",
      source: "Financial Times",
      publishedAt: hoursAgo(18),
      category: "reports",
      sentiment: "neutral",
      relatedSymbols: ["GOOGL"],
      isFallback: true,
      dataSource: "mock",
    },
    {
      id: "news-meta-watchlist",
      title: "Meta engagement metrics draw attention ahead of product event",
      summary:
        "Watchlist holders are monitoring ad load changes and Reels monetization.",
      source: "The Verge",
      publishedAt: hoursAgo(22),
      category: "watchlist",
      sentiment: "positive",
      relatedSymbols: ["META"],
      isFallback: true,
      dataSource: "mock",
    },
  ],
  marketPulse: [
    {
      id: "pulse-tech",
      text: "Tech sentiment remains positive",
      trend: "up",
    },
    {
      id: "pulse-bonds",
      text: "Bond yields moved slightly lower",
      trend: "down",
    },
    {
      id: "pulse-oil",
      text: "Oil prices moved after supply concerns",
      trend: "down",
    },
    {
      id: "pulse-dollar",
      text: "Dollar index remains steady",
      trend: "neutral",
    },
  ],
  portfolioNews: [
    {
      id: "portfolio-news-aapl",
      symbol: "AAPL",
      headline: "Services growth supports margin resilience",
      publishedAt: hoursAgo(5),
      newsItemId: "news-aapl-services",
    },
    {
      id: "portfolio-news-msft",
      symbol: "MSFT",
      headline: "Cloud growth in focus before earnings",
      publishedAt: hoursAgo(7),
      newsItemId: "news-msft-cloud",
    },
    {
      id: "portfolio-news-nvda",
      symbol: "NVDA",
      headline: "AI chip launch draws sector attention",
      publishedAt: hoursAgo(0.6),
      newsItemId: "news-featured-nvda-ai-chips",
    },
  ],
  upcomingEvents: [
    {
      id: "event-nvda-earnings",
      symbol: "NVDA",
      label: "Q1 Earnings",
      date: daysFromNow(3),
      type: "earnings",
    },
    {
      id: "event-aapl-wwdc",
      symbol: "AAPL",
      label: "WWDC 2026",
      date: daysFromNow(8),
      type: "conference",
    },
    {
      id: "event-fed-decision",
      symbol: "FED",
      label: "Fed Rate Decision",
      date: daysFromNow(12),
      type: "macro",
    },
  ],
};
