import type { StockDataProvider } from "@/lib/financial-data/providers/types";
import { fetchFinnhub } from "./finnhub.client";
import {
  finnhubNewsDateRange,
  mapFinnhubCandleToIntradayHistory,
  mapFinnhubCandleToPriceHistory,
  mapFinnhubEarningsToStockProvider,
  mapFinnhubMetricsToKeyMetrics,
  mapFinnhubNewsToStockProviderNews,
  mapFinnhubPriceTargetToStockProvider,
  mapFinnhubRecommendationToDistribution,
  mapFinnhubProfileToStockProviderProfile,
  mapFinnhubQuoteToStockProviderQuote,
} from "./mappers";
import type {
  FinnhubCandle,
  FinnhubEarningsCalendarItem,
  FinnhubMetricSeries,
  FinnhubNewsItem,
  FinnhubPriceTarget,
  FinnhubProfile,
  FinnhubQuote,
  FinnhubRecommendationTrend,
} from "./finnhub.types";

const unixNow = (): number => Math.floor(Date.now() / 1000);
const oneYearAgo = (): number => unixNow() - 365 * 24 * 60 * 60;
const startOfUtcDay = (): number => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

export const finnhubStockProvider: StockDataProvider = {
  id: "finnhub",

  fetchProfile: async (symbol) => {
    const data = await fetchFinnhub<FinnhubProfile>("/stock/profile2", { symbol });
    if (!data?.ticker) {
      return null;
    }
    return mapFinnhubProfileToStockProviderProfile(data);
  },

  fetchQuote: async (symbol) => {
    const data = await fetchFinnhub<FinnhubQuote>("/quote", { symbol });
    if (!data?.c) {
      return null;
    }
    return mapFinnhubQuoteToStockProviderQuote(symbol, data);
  },

  fetchKeyMetrics: async (symbol) => {
    const data = await fetchFinnhub<FinnhubMetricSeries>("/stock/metric", {
      symbol,
      metric: "all",
    });
    if (!data?.metric) {
      return null;
    }
    return mapFinnhubMetricsToKeyMetrics(symbol, data.metric);
  },

  fetchIncomeStatements: async () => [],

  fetchCashFlowStatements: async () => [],

  fetchIntradayHistory: async (symbol) => {
    const data = await fetchFinnhub<FinnhubCandle>("/stock/candle", {
      symbol,
      resolution: "5",
      from: startOfUtcDay(),
      to: unixNow(),
    });
    return mapFinnhubCandleToIntradayHistory(symbol, data);
  },

  fetchPriceHistory: async (symbol) => {
    const data = await fetchFinnhub<FinnhubCandle>("/stock/candle", {
      symbol,
      resolution: "D",
      from: oneYearAgo(),
      to: unixNow(),
    });
    return mapFinnhubCandleToPriceHistory(symbol, data);
  },

  fetchNews: async (symbol) => {
    const { from, to } = finnhubNewsDateRange();
    const data = await fetchFinnhub<FinnhubNewsItem[]>("/company-news", {
      symbol,
      from,
      to,
    });
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return mapFinnhubNewsToStockProviderNews(symbol, data);
  },

  fetchEarnings: async (symbol, context) => {
    const from = new Date().toISOString().slice(0, 10);
    const toDate = new Date();
    toDate.setMonth(toDate.getMonth() + 3);
    const to = toDate.toISOString().slice(0, 10);

    const data = await fetchFinnhub<FinnhubEarningsCalendarItem[] | { earningsCalendar: FinnhubEarningsCalendarItem[] }>(
      "/calendar/earnings",
      { symbol, from, to },
    );

    const items = Array.isArray(data)
      ? data.filter((item) => item.symbol?.toUpperCase() === symbol.toUpperCase())
      : (data?.earningsCalendar ?? []);
    const profile =
      context?.profile ?? (await finnhubStockProvider.fetchProfile(symbol));
    return mapFinnhubEarningsToStockProvider(items.slice(0, 5), profile?.companyName ?? symbol);
  },

  fetchAnalystTarget: async (symbol, context) => {
    const quote = context?.quote ?? (await finnhubStockProvider.fetchQuote(symbol));
    if (!quote) {
      return null;
    }

    const [targetData, recommendationData] = await Promise.all([
      fetchFinnhub<FinnhubPriceTarget>("/stock/price-target", { symbol }).catch(
        () => null,
      ),
      fetchFinnhub<FinnhubRecommendationTrend[]>("/stock/recommendation", {
        symbol,
      }).catch(() => null),
    ]);

    if (!targetData?.targetMean) {
      return null;
    }

    const distribution = Array.isArray(recommendationData)
      ? mapFinnhubRecommendationToDistribution(recommendationData)
      : undefined;

    return mapFinnhubPriceTargetToStockProvider(targetData, quote.price, distribution);
  },
};
