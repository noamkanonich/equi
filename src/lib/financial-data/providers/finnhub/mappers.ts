import { format, formatISO, fromUnixTime, subYears } from "date-fns";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type {
  StockProviderAnalystConsensus,
  StockProviderAnalystDistribution,
  StockProviderAnalystTarget,
  StockProviderEarningsEvent,
  StockProviderEarningsTime,
  StockProviderIntradayHistory,
  StockProviderKeyMetrics,
  StockProviderNewsItem,
  StockProviderPriceHistory,
  StockProviderProfile,
  StockProviderQuote,
} from "@/data/financial-data/financial-data.types";
import type {
  FinnhubCandle,
  FinnhubEarningsCalendarItem,
  FinnhubNewsItem,
  FinnhubPriceTarget,
  FinnhubProfile,
  FinnhubQuote,
  FinnhubRecommendationTrend,
  FinnhubSearchResult,
} from "./finnhub.types";

const normalizeCurrency = (currency?: string): CurrencyCode => {
  const upper = currency?.toUpperCase();
  if (upper === "ILS" || upper === "EUR") {
    return upper;
  }
  return "USD";
};

export const mapFinnhubProfileToStockProviderProfile = (
  raw: FinnhubProfile,
): StockProviderProfile => ({
  symbol: normalizeProviderSymbol(raw.ticker),
  companyName: raw.name,
  exchange: raw.exchange ?? "UNKNOWN",
  sector: raw.finnhubIndustry,
  industry: raw.finnhubIndustry,
  country: raw.country,
  website: raw.weburl,
  logoUrl: raw.logo ?? null,
  currency: normalizeCurrency(raw.currency),
  marketCap: raw.marketCapitalization
    ? raw.marketCapitalization * 1_000_000
    : undefined,
});

export const mapFinnhubQuoteToStockProviderQuote = (
  symbol: string,
  raw: FinnhubQuote,
): StockProviderQuote => {
  const price = raw.c ?? 0;
  const previousClose = raw.pc ?? price;
  const change = raw.d ?? price - previousClose;
  const changePercent = raw.dp ?? (previousClose === 0 ? 0 : (change / previousClose) * 100);

  return {
    symbol: normalizeProviderSymbol(symbol),
    price,
    change,
    changePercent: Number(changePercent.toFixed(2)),
    previousClose,
    dayHigh: raw.h ?? price,
    dayLow: raw.l ?? price,
    volume: 0,
    currency: "USD",
    updatedAt: raw.t
      ? formatISO(fromUnixTime(raw.t))
      : new Date().toISOString(),
  };
};

export const mapFinnhubNewsToStockProviderNews = (
  symbol: string,
  items: FinnhubNewsItem[],
): StockProviderNewsItem[] =>
  items.slice(0, 20).map((item) => ({
    id: String(item.id),
    symbol: normalizeProviderSymbol(symbol),
    title: item.headline,
    summary: item.summary,
    source: item.source,
    url: item.url,
    publishedAt: formatISO(fromUnixTime(item.datetime)),
    imageUrl: item.image || undefined,
    relatedSymbols: item.related
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean),
  }));

const mapEarningsHour = (hour?: string): StockProviderEarningsTime => {
  if (hour === "bmo") {
    return "beforeMarket";
  }
  if (hour === "amc") {
    return "afterMarket";
  }
  return "unknown";
};

export const mapFinnhubEarningsToStockProvider = (
  items: FinnhubEarningsCalendarItem[],
  companyName: string,
): StockProviderEarningsEvent[] =>
  items.map((item) => ({
    symbol: normalizeProviderSymbol(item.symbol),
    companyName,
    date: item.date,
    time: mapEarningsHour(item.hour),
    epsEstimate: item.epsEstimate ?? undefined,
    revenueEstimate: item.revenueEstimate ?? undefined,
    source: "finnhub",
    impact: "medium",
  }));

const mapConsensus = (targetMean: number, currentPrice: number): StockProviderAnalystConsensus => {
  const upside = currentPrice === 0 ? 0 : ((targetMean - currentPrice) / currentPrice) * 100;
  if (upside > 8) {
    return "buy";
  }
  if (upside < -5) {
    return "sell";
  }
  return "hold";
};

export const mapFinnhubRecommendationToDistribution = (
  trends: FinnhubRecommendationTrend[],
): StockProviderAnalystDistribution | undefined => {
  if (!trends.length) {
    return undefined;
  }

  const latest = [...trends].sort((a, b) => b.period.localeCompare(a.period))[0];
  return {
    buy: (latest.strongBuy ?? 0) + (latest.buy ?? 0),
    hold: latest.hold ?? 0,
    sell: (latest.sell ?? 0) + (latest.strongSell ?? 0),
  };
};

export const mapFinnhubCandleToIntradayHistory = (
  symbol: string,
  raw: FinnhubCandle,
): StockProviderIntradayHistory | null => {
  if (raw.s !== "ok" || !raw.t?.length) {
    return null;
  }

  const points = raw.t.map((timestamp, index) => ({
    time: format(fromUnixTime(timestamp), "HH:mm"),
    price: raw.c[index] ?? 0,
  }));

  return {
    symbol: normalizeProviderSymbol(symbol),
    currency: "USD",
    points: points.filter((point) => point.price > 0),
  };
};

export const mapFinnhubPriceTargetToStockProvider = (
  raw: FinnhubPriceTarget,
  currentPrice: number,
  distribution?: StockProviderAnalystDistribution,
): StockProviderAnalystTarget => {
  const averageTarget = raw.targetMean ?? raw.targetMedian ?? currentPrice;
  const upsidePercent =
    currentPrice === 0 ? 0 : ((averageTarget - currentPrice) / currentPrice) * 100;

  const analystCount = distribution
    ? distribution.buy + distribution.hold + distribution.sell
    : undefined;

  return {
    symbol: normalizeProviderSymbol(raw.symbol),
    averageTarget,
    highTarget: raw.targetHigh ?? averageTarget,
    lowTarget: raw.targetLow ?? averageTarget,
    upsidePercent,
    consensus: mapConsensus(averageTarget, currentPrice),
    analystCount,
    distribution,
    updatedAt: raw.lastUpdated ?? new Date().toISOString(),
  };
};

export const mapFinnhubCandleToPriceHistory = (
  symbol: string,
  raw: FinnhubCandle,
): StockProviderPriceHistory | null => {
  if (raw.s !== "ok" || !raw.t?.length) {
    return null;
  }

  const points = raw.t.map((timestamp, index) => ({
    date: formatISO(fromUnixTime(timestamp), { representation: "date" }),
    open: raw.o[index] ?? 0,
    high: raw.h[index] ?? 0,
    low: raw.l[index] ?? 0,
    close: raw.c[index] ?? 0,
    volume: raw.v[index] ?? 0,
  }));

  return {
    symbol: normalizeProviderSymbol(symbol),
    currency: "USD",
    points,
  };
};

export const mapFinnhubMetricsToKeyMetrics = (
  symbol: string,
  metric: Record<string, number | null>,
): StockProviderKeyMetrics | null => {
  if (!metric || Object.keys(metric).length === 0) {
    return null;
  }

  return {
    symbol: normalizeProviderSymbol(symbol),
    currency: "USD",
    asOfDate: new Date().toISOString().slice(0, 10),
    peRatio: metric.peBasic ?? metric.peTTM ?? undefined,
    pegRatio: metric.pegRatio ?? undefined,
    priceToSalesRatio: metric.psTTM ?? undefined,
    marketCap: metric.marketCapitalization ?? undefined,
    roe: metric.roeTTM ?? undefined,
    roa: metric.roaTTM ?? undefined,
    debtToEquity: metric["totalDebt/totalEquityAnnual"] ?? undefined,
    currentRatio: metric.currentRatioAnnual ?? undefined,
    grossMargin: metric.grossMarginTTM ?? undefined,
    operatingMargin: metric.operatingMarginTTM ?? undefined,
    netMargin: metric.netProfitMarginTTM ?? undefined,
    revenueGrowth: metric.revenueGrowth3Y ?? undefined,
    epsGrowth: metric.epsGrowth3Y ?? undefined,
  };
};

export const mapFinnhubSearchResults = (
  results: FinnhubSearchResult[],
): Array<{ symbol: string; companyName: string; exchange: string }> =>
  results
    .filter((item) => item.type === "Common Stock" || item.type === "EQS")
    .slice(0, 20)
    .map((item) => ({
      symbol: normalizeProviderSymbol(item.symbol),
      companyName: item.description || item.displaySymbol,
      exchange: "US",
    }));

export const finnhubNewsDateRange = (): { from: string; to: string } => {
  const to = new Date();
  const from = subYears(to, 1);
  return {
    from: formatISO(from, { representation: "date" }),
    to: formatISO(to, { representation: "date" }),
  };
};
