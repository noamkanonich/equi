import "server-only";

import type { Quote } from "@/data/market/quote.types";
import type { Asset } from "@/data/market/market.types";
import {
  getFreshFallbackQuote,
  getStaleFallbackQuote,
  setFallbackQuoteCache,
} from "@/lib/financial-data/quotes/fallbackQuoteCache";
import { getGoogleFinanceFallbackQuote } from "@/lib/financial-data/quotes/scrapers/googleFinanceScraper";
import { getYahooFinanceChartFallbackQuote } from "@/lib/financial-data/quotes/scrapers/yahooFinanceChartScraper";
import { getYahooFinanceFallbackQuote } from "@/lib/financial-data/quotes/scrapers/yahooFinanceScraper";

const toStaleCachedQuote = (quote: Quote): Quote => ({
  ...quote,
  source: "cache",
  quality: "cached",
  isStale: true,
});

export type GetFallbackQuoteOptions = {
  bypassCache?: boolean;
};

export const getFallbackQuote = async (
  asset: Asset,
  options?: GetFallbackQuoteOptions,
): Promise<Quote | null> => {
  if (!options?.bypassCache) {
    const freshCachedQuote = getFreshFallbackQuote(asset.id);

    if (freshCachedQuote) {
      return freshCachedQuote;
    }
  }

  const yahooQuote = await getYahooFinanceFallbackQuote(asset);

  if (yahooQuote) {
    setFallbackQuoteCache(yahooQuote);
    return yahooQuote;
  }

  const googleQuote = await getGoogleFinanceFallbackQuote(asset);

  if (googleQuote) {
    setFallbackQuoteCache(googleQuote);
    return googleQuote;
  }

  const yahooChartQuote = await getYahooFinanceChartFallbackQuote(asset);

  if (yahooChartQuote) {
    setFallbackQuoteCache(yahooChartQuote);
    return yahooChartQuote;
  }

  const staleCachedQuote = getStaleFallbackQuote(asset.id);

  if (staleCachedQuote) {
    return toStaleCachedQuote(staleCachedQuote);
  }

  return null;
};
