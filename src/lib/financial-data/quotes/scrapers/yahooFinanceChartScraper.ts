import "server-only";

import type { Quote } from "@/data/market/quote.types";
import type { Asset } from "@/data/market/market.types";
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

const buildYahooChartUrls = (symbol: string): string[] =>
  YAHOO_CHART_HOSTS.map(
    (host) =>
      `https://${host}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
  );

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
