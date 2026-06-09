import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";
import { newsPageMockData } from "@/data/news/news.mock";
import {
  mapStockProviderNewsItemToNewsItem,
  mergeNewsItems,
} from "@/data/news/mappers";
import type { NewsItem } from "@/data/news/news.types";
import type { FinancialDataProviderId } from "@/data/financial-data/financial-data.types";
import { getStockDataBundles } from "@/utils/financial-data/getStockDataBundles";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const newsScopeSchema = z.enum(["portfolio", "watchlist", "market"]);

const newsSymbolsSchema = z
  .string()
  .trim()
  .transform((raw) =>
    raw
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().min(1)).max(30))
  .optional();

// ---------------------------------------------------------------------------
// Server-side route cache (1 hour TTL)
// ---------------------------------------------------------------------------

const NEWS_CACHE_TTL_MS = 60 * 60 * 1000;

type NewsCacheEntry = {
  items: NewsItem[];
  isFallback: boolean;
  provider: FinancialDataProviderId;
  expiresAt: number;
};

const newsRouteCache = new Map<string, NewsCacheEntry>();

const buildNewsCacheKey = (scope: string, symbols: string[]): string =>
  `${scope}:${[...symbols].sort().join(",")}`;

const getCachedNewsEntry = (key: string): NewsCacheEntry | undefined => {
  const entry = newsRouteCache.get(key);
  if (!entry || Date.now() >= entry.expiresAt) {
    newsRouteCache.delete(key);
    return undefined;
  }
  return entry;
};

const setCachedNewsEntry = (
  key: string,
  entry: Omit<NewsCacheEntry, "expiresAt">,
): void => {
  newsRouteCache.set(key, { ...entry, expiresAt: Date.now() + NEWS_CACHE_TTL_MS });
};

// ---------------------------------------------------------------------------
// Market symbols used for scope=market
// ---------------------------------------------------------------------------

const MARKET_NEWS_SYMBOLS = ["SPY", "QQQ", "AAPL", "MSFT", "AMZN", "GOOGL"];

// ---------------------------------------------------------------------------
// News extraction helpers
// ---------------------------------------------------------------------------

const extractNewsFromBundles = (
  bundles: Awaited<ReturnType<typeof getStockDataBundles>>,
  portfolioSymbols: string[],
  watchlistSymbols: string[],
): { items: NewsItem[]; isFallback: boolean; provider: FinancialDataProviderId } => {
  const providerItems: NewsItem[] = [];
  let anyFallback = false;
  let detectedProvider: FinancialDataProviderId = "mock";

  for (const bundle of Object.values(bundles)) {
    if (!bundle?.news?.length) {
      continue;
    }

    if (bundle.meta.isFallback) {
      anyFallback = true;
    } else {
      detectedProvider = bundle.meta.provider;
    }

    for (const newsItem of bundle.news) {
      providerItems.push(
        mapStockProviderNewsItemToNewsItem(newsItem, {
          portfolioSymbols,
          watchlistSymbols,
          isFallback: bundle.meta.isFallback,
          provider: bundle.meta.provider,
        }),
      );
    }
  }

  const items = mergeNewsItems(newsPageMockData.items, providerItems);

  return {
    items,
    isFallback: anyFallback || providerItems.length === 0,
    provider: providerItems.length === 0 ? "mock" : detectedProvider,
  };
};

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const scopeResult = newsScopeSchema.safeParse(searchParams.get("scope"));
  if (!scopeResult.success) {
    return NextResponse.json(
      {
        error:
          "Invalid or missing scope parameter. Use: portfolio, watchlist, market",
      },
      { status: 400 },
    );
  }

  const scope = scopeResult.data;

  const symbolsResult = newsSymbolsSchema.safeParse(
    searchParams.get("symbols") ?? undefined,
  );
  if (!symbolsResult.success) {
    return NextResponse.json(
      { error: "Invalid symbols parameter" },
      { status: 400 },
    );
  }

  const requestedSymbols = symbolsResult.data ?? [];

  if (
    (scope === "portfolio" || scope === "watchlist") &&
    requestedSymbols.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "symbols parameter is required for portfolio and watchlist scopes",
      },
      { status: 400 },
    );
  }

  const symbols = scope === "market" ? MARKET_NEWS_SYMBOLS : requestedSymbols;
  const portfolioSymbols = scope === "portfolio" ? requestedSymbols : [];
  const watchlistSymbols = scope === "watchlist" ? requestedSymbols : [];

  const cacheKey = buildNewsCacheKey(scope, symbols);
  const cached = getCachedNewsEntry(cacheKey);

  if (cached) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[news-data] cache hit scope: ${scope} symbols: ${symbols.join(",")}`,
      );
    }
    return NextResponse.json({
      items: cached.items,
      isFallback: cached.isFallback,
      provider: cached.provider,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.info(
      `[news-data] news fetch scope: ${scope} symbols: ${symbols.join(",")}`,
    );
  }

  try {
    const bundles = await getStockDataBundles(symbols, { sections: ["news"] });
    const result = extractNewsFromBundles(bundles, portfolioSymbols, watchlistSymbols);

    setCachedNewsEntry(cacheKey, result);

    return NextResponse.json({
      items: result.items,
      isFallback: result.isFallback,
      provider: result.provider,
    });
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[news-data] fetch failed for scope: ${scope} — returning mock`,
      );
    }

    const mockResult = {
      items: newsPageMockData.items,
      isFallback: true,
      provider: "mock" as FinancialDataProviderId,
    };

    setCachedNewsEntry(cacheKey, mockResult);

    return NextResponse.json(mockResult);
  }
};
