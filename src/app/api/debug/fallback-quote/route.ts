import { NextResponse } from "next/server";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type { Quote } from "@/data/market/quote.types";
import type { Asset } from "@/data/market/market.types";
import { findAssetBySymbol } from "@/lib/financial-data/asset-registry";
import {
  getFreshFallbackQuote,
  getStaleFallbackQuote,
} from "@/lib/financial-data/quotes/fallbackQuoteCache";
import { getFallbackQuote } from "@/lib/financial-data/quotes/fallbackQuoteProvider";
import { getGoogleFinanceFallbackQuote } from "@/lib/financial-data/quotes/scrapers/googleFinanceScraper";
import { getYahooFinanceChartFallbackQuote } from "@/lib/financial-data/quotes/scrapers/yahooFinanceChartScraper";
import { getYahooFinanceFallbackQuote } from "@/lib/financial-data/quotes/scrapers/yahooFinanceScraper";

type FallbackQuoteDebugSource =
  | "all"
  | "yahoo_scraper"
  | "google_scraper"
  | "yahoo_chart";

const isDevEnvironment = (): boolean => process.env.NODE_ENV === "development";

const US_TICKER_PATTERN = /^[A-Z][A-Z0-9.-]{0,9}$/;

const buildSyntheticUsAsset = (symbol: string): Asset => ({
  id: `US:${symbol}`,
  symbol,
  displaySymbol: symbol,
  name: symbol,
  market: "US",
  exchange: "NASDAQ",
  currency: "USD",
  assetType: "stock",
  provider: "fmp",
  providerSymbol: symbol,
});

const resolveDebugAsset = async (symbol: string): Promise<Asset | null> => {
  if (US_TICKER_PATTERN.test(symbol)) {
    return buildSyntheticUsAsset(symbol);
  }

  return findAssetBySymbol(symbol);
};

const parseDebugSource = (value: string | null): FallbackQuoteDebugSource | null => {
  if (!value || value === "all") {
    return "all";
  }

  if (
    value === "yahoo_scraper" ||
    value === "google_scraper" ||
    value === "yahoo_chart"
  ) {
    return value;
  }

  return null;
};

const toStaleCachedQuote = (quote: Quote): Quote => ({
  ...quote,
  source: "cache",
  quality: "cached",
  isStale: true,
});

const matchesDebugSource = (
  quote: Quote,
  source: FallbackQuoteDebugSource,
): boolean => {
  if (source === "all") {
    return true;
  }

  if (source === "yahoo_scraper") {
    return quote.source === "yahoo_scraper";
  }

  if (source === "google_scraper") {
    return quote.source === "google_scraper";
  }

  return quote.source === "yahoo_chart";
};

const scrapeQuoteBySource = async (
  source: FallbackQuoteDebugSource,
  asset: Asset,
): Promise<Quote | null> => {
  if (source === "yahoo_scraper") {
    return getYahooFinanceFallbackQuote(asset);
  }

  if (source === "google_scraper") {
    return getGoogleFinanceFallbackQuote(asset);
  }

  if (source === "yahoo_chart") {
    return getYahooFinanceChartFallbackQuote(asset);
  }

  return getFallbackQuote(asset, { bypassCache: true });
};

const fetchQuoteBySource = async (
  source: FallbackQuoteDebugSource,
  asset: Asset,
  bypassCache: boolean,
): Promise<{ quote: Quote | null; servedFrom: "live" | "cache" | "stale_cache" | null }> => {
  if (!bypassCache) {
    const cachedQuote = getFreshFallbackQuote(asset.id);

    if (cachedQuote && matchesDebugSource(cachedQuote, source)) {
      return { quote: cachedQuote, servedFrom: "cache" };
    }
  }

  const liveQuote = await scrapeQuoteBySource(source, asset);

  if (liveQuote) {
    return { quote: liveQuote, servedFrom: "live" };
  }

  const staleQuote = getStaleFallbackQuote(asset.id);

  if (staleQuote && matchesDebugSource(staleQuote, source)) {
    return { quote: toStaleCachedQuote(staleQuote), servedFrom: "stale_cache" };
  }

  return { quote: null, servedFrom: null };
};

export const GET = async (request: Request) => {
  if (!isDevEnvironment()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const rawSymbol = searchParams.get("symbol") ?? searchParams.get("assetId") ?? "";
  const symbol = normalizeProviderSymbol(rawSymbol);
  const source = parseDebugSource(searchParams.get("source"));
  const bypassCache = searchParams.get("fresh") === "true";

  if (!symbol) {
    return NextResponse.json(
      { error: "Missing symbol or assetId query parameter" },
      { status: 400 },
    );
  }

  if (!source) {
    return NextResponse.json(
      {
        error:
          "Invalid source. Use all, yahoo_scraper, google_scraper, or yahoo_chart",
      },
      { status: 400 },
    );
  }

  const asset = await resolveDebugAsset(symbol);

  if (!asset) {
    return NextResponse.json({
      symbol,
      asset: null,
      quote: null,
      source,
      bypassCache,
    });
  }

  const { quote, servedFrom } = await fetchQuoteBySource(source, asset, bypassCache);

  return NextResponse.json({
    symbol,
    asset: {
      id: asset.id,
      symbol: asset.symbol,
      displaySymbol: asset.displaySymbol,
      market: asset.market,
      exchange: asset.exchange,
      currency: asset.currency,
      providerSymbol: asset.providerSymbol,
    },
    quote,
    source,
    bypassCache,
    servedFrom,
    hint:
      quote === null
        ? "Yahoo returned 429 (rate limited). Stop using fresh=true. Wait 30-60 minutes, then open once without fresh."
        : servedFrom === "stale_cache"
          ? "Live scrape failed (likely 429). Returning last cached quote."
          : servedFrom === "cache"
            ? "Returned fresh cached quote. Omit fresh=true to avoid hitting Yahoo."
            : undefined,
  });
};
