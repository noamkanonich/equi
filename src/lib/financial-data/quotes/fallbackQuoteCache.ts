import "server-only";

import type { Quote } from "@/data/market/quote.types";

const FALLBACK_QUOTE_TTL_MS = 10 * 60 * 1000;

type FallbackQuoteCacheEntry = {
  quote: Quote;
  expiresAt: number;
};

const fallbackQuoteCache = new Map<string, FallbackQuoteCacheEntry>();

export const getFreshFallbackQuote = (assetId: string): Quote | null => {
  const entry = fallbackQuoteCache.get(assetId);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    return null;
  }

  return entry.quote;
};

export const getStaleFallbackQuote = (assetId: string): Quote | null => {
  const entry = fallbackQuoteCache.get(assetId);

  return entry?.quote ?? null;
};

export const setFallbackQuoteCache = (quote: Quote): void => {
  fallbackQuoteCache.set(quote.assetId, {
    quote,
    expiresAt: Date.now() + FALLBACK_QUOTE_TTL_MS,
  });
};
