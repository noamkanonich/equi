import "server-only";

import type { Quote } from "@/data/market/quote.types";
import type { Asset } from "@/data/market/market.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { buildGoogleFinanceSymbols } from "@/lib/financial-data/quotes/buildExternalSymbols";
import { normalizeScrapedNumber } from "@/lib/financial-data/quotes/normalizeScrapedNumber";
import { fetchHtml } from "@/lib/financial-data/quotes/scrapers/scrapeFetch";

type GoogleScrapedFields = {
  price: number | null;
  change: number | null;
  changePercent: number | null;
};

const extractGoogleAttributeNumber = (
  html: string,
  attribute: string,
): number | null => {
  const pattern = new RegExp(`${attribute}="([^"]+)"`, "i");
  const match = html.match(pattern);

  return match?.[1] ? normalizeScrapedNumber(match[1]) : null;
};

const extractGoogleJsonNumber = (html: string, field: string): number | null => {
  const pattern = new RegExp(`"${field}"\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`, "i");
  const match = html.match(pattern);

  return match?.[1] ? normalizeScrapedNumber(match[1]) : null;
};

const extractGoogleFields = (html: string): GoogleScrapedFields => {
  const price =
    extractGoogleAttributeNumber(html, "data-last-price") ??
    extractGoogleJsonNumber(html, "price");

  const change =
    extractGoogleAttributeNumber(html, "data-last-normal-market-change") ??
    extractGoogleJsonNumber(html, "change");

  const changePercent =
    extractGoogleAttributeNumber(html, "data-last-normal-market-change-percent") ??
    extractGoogleJsonNumber(html, "changePercent");

  return {
    price,
    change,
    changePercent,
  };
};

const buildGoogleQuoteUrl = (symbol: string): string =>
  `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}`;

const scrapeGoogleSymbol = async (
  asset: Asset,
  symbol: string,
): Promise<Quote | null> => {
  const html = await fetchHtml(buildGoogleQuoteUrl(symbol));

  if (!html) {
    return null;
  }

  const fields = extractGoogleFields(html);

  if (fields.price === null) {
    logFinancialDataDebug("scraper.google.missingPrice", {
      assetId: asset.id,
      symbol,
    });
    return null;
  }

  logFinancialDataDebug("scraper.google.success", {
    assetId: asset.id,
    symbol,
    price: fields.price,
  });

  return {
    assetId: asset.id,
    price: fields.price,
    change: fields.change,
    changePercent: fields.changePercent,
    currency: asset.currency,
    asOf: new Date().toISOString(),
    source: "google_scraper",
    quality: "fallback",
    isStale: false,
  };
};

export const getGoogleFinanceFallbackQuote = async (asset: Asset): Promise<Quote | null> => {
  const symbols = buildGoogleFinanceSymbols(asset);

  if (symbols.length === 0) {
    logFinancialDataDebug("scraper.google.noSymbol", {
      assetId: asset.id,
      symbol: asset.symbol,
    });
    return null;
  }

  for (const symbol of symbols) {
    const quote = await scrapeGoogleSymbol(asset, symbol);

    if (quote) {
      return quote;
    }
  }

  return null;
};
