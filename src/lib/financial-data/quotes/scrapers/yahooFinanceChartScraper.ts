import "server-only";

import type { Quote } from "@/data/market/quote.types";
import type { Asset } from "@/data/market/market.types";
import type {
  StockProviderIntradayHistory,
  StockProviderPriceHistory,
  StockProviderPricePoint,
} from "@/data/financial-data/financial-data.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { buildYahooFinanceSymbols } from "@/lib/financial-data/quotes/buildExternalSymbols";
import { fetchJson } from "@/lib/financial-data/quotes/scrapers/scrapeFetch";

type YahooChartMeta = {
  currency?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketTime?: number;
};

type YahooChartResponse = {
  chart?: {
    result?: Array<{
      meta?: YahooChartMeta;
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: Array<number | null>;
          high?: Array<number | null>;
          low?: Array<number | null>;
          close?: Array<number | null>;
          volume?: Array<number | null>;
        }>;
      };
    }> | null;
    error?: {
      code?: string;
      description?: string;
    } | null;
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
};

const resolveQuoteCurrency = (
  currency: string | undefined,
  asset: Asset,
): "USD" | "ILS" => {
  if (currency === "USD" || currency === "ILS") {
    return currency;
  }

  return asset.currency;
};

const YAHOO_CHART_HOSTS = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];

const buildYahooChartUrls = (
  symbol: string,
  query = "interval=1d&range=1d",
): string[] =>
  YAHOO_CHART_HOSTS.map(
    (host) =>
      `https://${host}/v8/finance/chart/${encodeURIComponent(symbol)}?${query}`,
  );

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const mapChartMetaToQuote = (asset: Asset, meta: YahooChartMeta, symbol: string): Quote | null => {
  const price = toFiniteNumber(meta.regularMarketPrice);

  if (price === null) {
    logFinancialDataDebug("scraper.yahooChart.missingPrice", {
      assetId: asset.id,
      symbol,
    });
    return null;
  }

  const previousClose =
    toFiniteNumber(meta.chartPreviousClose) ?? toFiniteNumber(meta.previousClose);
  const change =
    previousClose === null ? null : Number((price - previousClose).toFixed(4));
  const changePercent =
    change === null || previousClose === null || previousClose === 0
      ? null
      : Number(((change / previousClose) * 100).toFixed(4));

  const marketTime = toFiniteNumber(meta.regularMarketTime);
  const asOf =
    marketTime === null
      ? new Date().toISOString()
      : new Date(marketTime * 1000).toISOString();

  logFinancialDataDebug("scraper.yahooChart.success", {
    assetId: asset.id,
    symbol,
    price,
  });

  return {
    assetId: asset.id,
    price,
    change,
    changePercent,
    currency: resolveQuoteCurrency(meta.currency, asset),
    asOf,
    source: "yahoo_chart",
    quality: "fallback",
    isStale: false,
  };
};

const parseYahooChartQuote = (
  asset: Asset,
  symbol: string,
  payload: YahooChartResponse,
): Quote | null => {
  const chartError = payload.chart?.error;

  if (chartError) {
    logFinancialDataDebug("scraper.yahooChart.error", {
      assetId: asset.id,
      symbol,
      code: chartError.code,
      description: chartError.description,
    });
    return null;
  }

  const meta = payload.chart?.result?.[0]?.meta;

  if (!meta || !isRecord(meta)) {
    logFinancialDataDebug("scraper.yahooChart.missingMeta", {
      assetId: asset.id,
      symbol,
    });
    return null;
  }

  return mapChartMetaToQuote(asset, meta, symbol);
};

const scrapeYahooChartSymbol = async (
  asset: Asset,
  symbol: string,
): Promise<Quote | null> => {
  for (const url of buildYahooChartUrls(symbol)) {
    const payload = await fetchJson<YahooChartResponse>(url);

    if (!payload) {
      continue;
    }

    const quote = parseYahooChartQuote(asset, symbol, payload);

    if (quote) {
      return quote;
    }
  }

  return null;
};

const fetchYahooChartPayload = async (
  symbol: string,
  query: string,
): Promise<YahooChartResponse | null> => {
  for (const url of buildYahooChartUrls(symbol, query)) {
    const payload = await fetchJson<YahooChartResponse>(url);
    const chartError = payload?.chart?.error;

    if (chartError) {
      logFinancialDataDebug("scraper.yahooChart.error", {
        symbol,
        code: chartError.code,
        description: chartError.description,
      });
      continue;
    }

    if (payload?.chart?.result?.[0]) {
      return payload;
    }
  }

  return null;
};

const mapYahooChartToPriceHistory = (
  asset: Asset,
  symbol: string,
  payload: YahooChartResponse,
): StockProviderPriceHistory | null => {
  const result = payload.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const quote = result?.indicators?.quote?.[0];

  if (!quote || timestamps.length === 0) {
    return null;
  }

  const points: StockProviderPricePoint[] = timestamps.flatMap((timestamp, index) => {
    const open = quote.open?.[index];
    const high = quote.high?.[index];
    const low = quote.low?.[index];
    const close = quote.close?.[index];

    if (
      !isFiniteNumber(open) ||
      !isFiniteNumber(high) ||
      !isFiniteNumber(low) ||
      !isFiniteNumber(close)
    ) {
      return [];
    }

    const volume = quote.volume?.[index];

    return {
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
      volume: isFiniteNumber(volume) ? volume : 0,
    };
  });

  if (points.length === 0) {
    return null;
  }

  logFinancialDataDebug("scraper.yahooChart.history.success", {
    assetId: asset.id,
    symbol,
    points: points.length,
  });

  return {
    symbol: asset.symbol,
    currency: resolveQuoteCurrency(result?.meta?.currency, asset),
    points,
  };
};

const mapYahooChartToIntradayHistory = (
  asset: Asset,
  symbol: string,
  payload: YahooChartResponse,
): StockProviderIntradayHistory | null => {
  const result = payload.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const closePrices = result?.indicators?.quote?.[0]?.close ?? [];

  if (timestamps.length === 0 || closePrices.length === 0) {
    return null;
  }

  const points = timestamps.flatMap((timestamp, index) => {
    const price = closePrices[index];

    if (!isFiniteNumber(price)) {
      return [];
    }

    return {
      time: new Date(timestamp * 1000).toISOString().slice(11, 16),
      price,
    };
  });

  if (points.length === 0) {
    return null;
  }

  logFinancialDataDebug("scraper.yahooChart.intraday.success", {
    assetId: asset.id,
    symbol,
    points: points.length,
  });

  return {
    symbol: asset.symbol,
    currency: resolveQuoteCurrency(result?.meta?.currency, asset),
    points,
  };
};

export const getYahooFinanceChartFallbackQuote = async (asset: Asset): Promise<Quote | null> => {
  const symbols = buildYahooFinanceSymbols(asset);

  if (symbols.length === 0) {
    logFinancialDataDebug("scraper.yahooChart.noSymbol", {
      assetId: asset.id,
      symbol: asset.symbol,
    });
    return null;
  }

  for (const symbol of symbols) {
    const quote = await scrapeYahooChartSymbol(asset, symbol);

    if (quote) {
      return quote;
    }
  }

  return null;
};

export const getYahooFinanceChartFallbackPriceHistory = async (
  asset: Asset,
): Promise<StockProviderPriceHistory | null> => {
  const symbols = buildYahooFinanceSymbols(asset);

  for (const symbol of symbols) {
    const payload = await fetchYahooChartPayload(symbol, "interval=1d&range=1y");

    if (!payload) {
      continue;
    }

    const history = mapYahooChartToPriceHistory(asset, symbol, payload);

    if (history) {
      return history;
    }
  }

  return null;
};

export const getYahooFinanceChartFallbackIntradayHistory = async (
  asset: Asset,
): Promise<StockProviderIntradayHistory | null> => {
  const symbols = buildYahooFinanceSymbols(asset);

  for (const symbol of symbols) {
    const payload = await fetchYahooChartPayload(symbol, "interval=5m&range=1d");

    if (!payload) {
      continue;
    }

    const history = mapYahooChartToIntradayHistory(asset, symbol, payload);

    if (history) {
      return history;
    }
  }

  return null;
};
