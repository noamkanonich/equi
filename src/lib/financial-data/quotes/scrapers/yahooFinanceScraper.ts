import "server-only";

import type { Quote } from "@/data/market/quote.types";
import type { Asset } from "@/data/market/market.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { buildYahooFinanceSymbols } from "@/lib/financial-data/quotes/buildExternalSymbols";
import { normalizeScrapedNumber } from "@/lib/financial-data/quotes/normalizeScrapedNumber";
import { fetchHtml } from "@/lib/financial-data/quotes/scrapers/scrapeFetch";

type YahooScrapedFields = {
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: "USD" | "ILS" | null;
};

const extractYahooJsonNumber = (html: string, field: string): number | null => {
  const rawObjectPattern = new RegExp(
    `"${field}"\\s*:\\s*\\{[^}]*"raw"\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`,
    "i",
  );
  const rawObjectMatch = html.match(rawObjectPattern);

  if (rawObjectMatch?.[1]) {
    return normalizeScrapedNumber(rawObjectMatch[1]);
  }

  const directPattern = new RegExp(`"${field}"\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`, "i");
  const directMatch = html.match(directPattern);

  return directMatch?.[1] ? normalizeScrapedNumber(directMatch[1]) : null;
};

const extractYahooStreamerValue = (html: string, field: string): number | null => {
  const pattern = new RegExp(
    `<fin-streamer[^>]*data-field="${field}"[^>]*value="([^"]+)"`,
    "i",
  );
  const match = html.match(pattern);

  return match?.[1] ? normalizeScrapedNumber(match[1]) : null;
};

const extractYahooTestIdValue = (html: string, testId: string): number | null => {
  const pattern = new RegExp(`data-testid="${testId}"[^>]*>([^<]+)<`, "i");
  const match = html.match(pattern);

  return match?.[1] ? normalizeScrapedNumber(match[1]) : null;
};

const extractYahooCurrency = (html: string): "USD" | "ILS" | null => {
  const currencyMatch = html.match(/"currency"\s*:\s*"([A-Z]{3})"/i);

  if (!currencyMatch?.[1]) {
    return null;
  }

  if (currencyMatch[1] === "USD" || currencyMatch[1] === "ILS") {
    return currencyMatch[1];
  }

  return null;
};

const extractYahooFields = (html: string): YahooScrapedFields => ({
  price:
    extractYahooJsonNumber(html, "regularMarketPrice") ??
    extractYahooStreamerValue(html, "regularMarketPrice") ??
    extractYahooTestIdValue(html, "qsp-price"),
  change:
    extractYahooJsonNumber(html, "regularMarketChange") ??
    extractYahooStreamerValue(html, "regularMarketChange") ??
    extractYahooTestIdValue(html, "qsp-price-change"),
  changePercent:
    extractYahooJsonNumber(html, "regularMarketChangePercent") ??
    extractYahooStreamerValue(html, "regularMarketChangePercent") ??
    extractYahooTestIdValue(html, "qsp-price-change-percent"),
  currency: extractYahooCurrency(html),
});

const buildYahooQuoteUrl = (symbol: string): string =>
  `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}/`;

const scrapeYahooSymbol = async (
  asset: Asset,
  symbol: string,
): Promise<Quote | null> => {
  const html = await fetchHtml(buildYahooQuoteUrl(symbol));

  if (!html) {
    return null;
  }

  const fields = extractYahooFields(html);

  if (fields.price === null) {
    logFinancialDataDebug("scraper.yahoo.missingPrice", {
      assetId: asset.id,
      symbol,
    });
    return null;
  }

  logFinancialDataDebug("scraper.yahoo.success", {
    assetId: asset.id,
    symbol,
    price: fields.price,
  });

  return {
    assetId: asset.id,
    price: fields.price,
    change: fields.change,
    changePercent: fields.changePercent,
    currency: fields.currency ?? asset.currency,
    asOf: new Date().toISOString(),
    source: "yahoo_scraper",
    quality: "fallback",
    isStale: false,
  };
};

export const getYahooFinanceFallbackQuote = async (asset: Asset): Promise<Quote | null> => {
  const symbols = buildYahooFinanceSymbols(asset);

  if (symbols.length === 0) {
    logFinancialDataDebug("scraper.yahoo.noSymbol", {
      assetId: asset.id,
      symbol: asset.symbol,
    });
    return null;
  }

  for (const symbol of symbols) {
    const quote = await scrapeYahooSymbol(asset, symbol);

    if (quote) {
      return quote;
    }
  }

  return null;
};
