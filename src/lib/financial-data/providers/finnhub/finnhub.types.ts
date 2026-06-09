export type FinnhubQuote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

export type FinnhubProfile = {
  name: string;
  ticker: string;
  exchange: string;
  finnhubIndustry?: string;
  marketCapitalization?: number;
  shareOutstanding?: number;
  weburl?: string;
  logo?: string;
  country?: string;
  currency?: string;
  ipo?: string;
};

export type FinnhubNewsItem = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};

export type FinnhubEarningsCalendarItem = {
  date: string;
  epsActual?: number | null;
  epsEstimate?: number | null;
  hour?: string;
  quarter?: number;
  revenueActual?: number | null;
  revenueEstimate?: number | null;
  symbol: string;
  year?: number;
};

export type FinnhubPriceTarget = {
  lastUpdated: string;
  symbol: string;
  targetHigh: number;
  targetLow: number;
  targetMean: number;
  targetMedian: number;
};

export type FinnhubSearchResult = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};

export type FinnhubMetricSeries = {
  metric: Record<string, number | null>;
  metricType: string;
  series: Record<string, Array<{ period: string; v: number }>>;
  symbol: string;
};

export type FinnhubCandle = {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
};

export type FinnhubRecommendationTrend = {
  symbol: string;
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
};
