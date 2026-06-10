import "server-only";

import {
  buildMockStockDataBundle,
  mockAnalystTarget,
  mockCashFlowStatements,
  mockEarnings,
  mockIncomeStatements,
  mockIntradayHistory,
  mockKeyMetrics,
  mockNews,
  mockPriceHistory,
  mockStockProfile,
  mockStockQuote,
} from "@/data/financial-data/financial-data.mock";
import {
  buildFinancialDataMeta,
  normalizeProviderSymbol,
} from "@/data/financial-data/mappers";
import type {
  FinancialDataFallbackReason,
  FinancialDataSection,
  FinancialDataSource,
  StockProviderDataBundle,
} from "@/data/financial-data/financial-data.types";
import { findAssetBySymbol } from "@/lib/financial-data/asset-registry";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { getFallbackQuote } from "@/lib/financial-data/quotes/fallbackQuoteProvider";
import { mapQuoteToStockProviderQuote } from "@/lib/financial-data/quotes/mapQuoteToStockProviderQuote";
import {
  getYahooFinanceChartFallbackIntradayHistory,
  getYahooFinanceChartFallbackPriceHistory,
} from "@/lib/financial-data/quotes/scrapers/yahooFinanceChartScraper";
import { getNasdaqHistoricalPriceHistory } from "@/lib/financial-data/quotes/scrapers/nasdaqHistoricalScraper";
import {
  getActiveProviderId,
  resolveStockProviders,
} from "@/lib/financial-data/providers";
import type { StockDataProvider } from "@/lib/financial-data/providers/types";
import {
  getCachedSection,
  incrementProviderCalls,
  isRateLimitCooldownActive,
  recordCacheHit,
  recordCacheMiss,
  recordFallback,
  resolveRequestedSections,
  setCachedSection,
} from "@/lib/financial-data/stock-data-cache";

type SectionResult<T> = {
  section: FinancialDataSection;
  value: T;
  fromProvider: boolean;
  sectionSource?: FinancialDataSource;
  fallbackReason?: FinancialDataFallbackReason;
};

const isEmptyValue = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  (Array.isArray(value) && value.length === 0);

export type StockDataBundleScope = "full" | "display";

export type GetStockDataBundleOptions = {
  scope?: StockDataBundleScope;
  sections?: FinancialDataSection[];
};

type SymbolBatchTracker = {
  hadCacheHit: boolean;
  hadCacheMiss: boolean;
};

const tryProviderFetch = async <T>({
  fetcher,
  isEmpty = isEmptyValue,
}: {
  fetcher: () => Promise<T>;
  isEmpty?: (value: T) => boolean;
}): Promise<T | null> => {
  incrementProviderCalls();
  const value = await fetcher();
  return isEmpty(value) ? null : value;
};

const fetchFromProviders = async <T>({
  symbol,
  section,
  primary,
  fallback,
  primaryFetcher,
  fallbackFetcher,
  isEmpty = isEmptyValue,
}: {
  symbol: string;
  section: FinancialDataSection;
  primary: StockDataProvider | null;
  fallback: StockDataProvider | null;
  primaryFetcher: (provider: StockDataProvider) => Promise<T>;
  fallbackFetcher?: (provider: StockDataProvider) => Promise<T>;
  isEmpty?: (value: T) => boolean;
}): Promise<{ value: T | null; source?: FinancialDataSource }> => {
  if (primary) {
    try {
      const value = await tryProviderFetch({ fetcher: () => primaryFetcher(primary), isEmpty });
      if (value !== null) {
        return { value, source: primary.id };
      }
    } catch (error) {
      logFinancialDataDebug("bundle.section.primaryError", {
        section,
        symbol,
        provider: primary.id,
        errorMessage: error instanceof Error ? error.message.slice(0, 120) : "fetch failed",
      });
    }
  }

  const secondary = fallback ?? null;
  const secondaryFetcher = fallbackFetcher ?? primaryFetcher;

  if (secondary && secondary !== primary) {
    logFinancialDataDebug("bundle.section.finnhubFallback", {
      section,
      symbol,
      from: primary?.id ?? "none",
      to: secondary.id,
    });

    try {
      const value = await tryProviderFetch({
        fetcher: () => secondaryFetcher(secondary),
        isEmpty,
      });
      if (value !== null) {
        return { value, source: secondary.id };
      }
    } catch (error) {
      logFinancialDataDebug("bundle.section.fallbackError", {
        section,
        symbol,
        provider: secondary.id,
        errorMessage: error instanceof Error ? error.message.slice(0, 120) : "fetch failed",
      });
    }
  }

  return { value: null };
};

const mapQuoteSourceToFinancialDataSource = (
  source: "yahoo_scraper" | "yahoo_chart" | "google_scraper" | "cache",
): FinancialDataSource => {
  if (source === "cache") {
    return "scraper_cache";
  }

  return source;
};

const fetchSectionWithCache = async <T>({
  symbol,
  section,
  primary,
  fallback,
  primaryFetcher,
  fallbackFetcher,
  mockFallback,
  liveFallback,
  isEmpty = isEmptyValue,
  batchTracker,
}: {
  symbol: string;
  section: FinancialDataSection;
  primary: StockDataProvider | null;
  fallback: StockDataProvider | null;
  primaryFetcher: (provider: StockDataProvider) => Promise<T>;
  fallbackFetcher?: (provider: StockDataProvider) => Promise<T>;
  mockFallback: () => T;
  liveFallback?: () => Promise<{ value: T; sectionSource: FinancialDataSource } | null>;
  isEmpty?: (value: T) => boolean;
  batchTracker?: SymbolBatchTracker;
}): Promise<SectionResult<T>> => {
  const cached = getCachedSection<T>(symbol, section);

  if (cached !== undefined) {
    if (batchTracker) {
      batchTracker.hadCacheHit = true;
    }
    return {
      section,
      value: cached.value,
      fromProvider: !cached.isFallback,
      sectionSource: cached.sectionSource ?? (cached.isFallback ? "mock" : primary?.id ?? fallback?.id),
      fallbackReason: cached.fallbackReason,
    };
  }

  if (batchTracker) {
    batchTracker.hadCacheMiss = true;
  }

  const buildMockFallbackResult = (reason: FinancialDataFallbackReason): SectionResult<T> => {
    const fallbackValue = mockFallback();
    setCachedSection(symbol, section, fallbackValue, {
      isFallback: true,
      fallbackReason: reason,
      sectionSource: "mock",
    });
    if (batchTracker) {
      recordFallback(symbol, reason);
    }
    return {
      section,
      value: fallbackValue,
      fromProvider: false,
      sectionSource: "mock",
      fallbackReason: reason,
    };
  };

  if (isRateLimitCooldownActive() && !fallback) {
    return buildMockFallbackResult("rateLimited");
  }

  const providerResult = await fetchFromProviders({
    symbol,
    section,
    primary: isRateLimitCooldownActive() ? null : primary,
    fallback,
    primaryFetcher,
    fallbackFetcher,
    isEmpty,
  });

  if (providerResult.value !== null && providerResult.source) {
    setCachedSection(symbol, section, providerResult.value, {
      sectionSource: providerResult.source,
    });
    return {
      section,
      value: providerResult.value,
      fromProvider: true,
      sectionSource: providerResult.source,
    };
  }

  if (liveFallback) {
    const liveResult = await liveFallback();

    if (liveResult !== null) {
      setCachedSection(symbol, section, liveResult.value, {
        sectionSource: liveResult.sectionSource,
      });
      return {
        section,
        value: liveResult.value,
        fromProvider: true,
        sectionSource: liveResult.sectionSource,
      };
    }
  }

  if (isRateLimitCooldownActive()) {
    return buildMockFallbackResult("rateLimited");
  }

  return buildMockFallbackResult("providerError");
};

const buildBundleFromSectionResults = (
  normalized: string,
  providerId: ReturnType<typeof getActiveProviderId>,
  mockBundle: StockProviderDataBundle,
  results: SectionResult<unknown>[],
  profileResult: SectionResult<StockProviderDataBundle["profile"]>,
  quoteResult: SectionResult<StockProviderDataBundle["quote"]>,
  keyMetricsResult: SectionResult<StockProviderDataBundle["keyMetrics"]>,
  incomeResult: SectionResult<StockProviderDataBundle["incomeStatements"]>,
  cashFlowResult: SectionResult<StockProviderDataBundle["cashFlowStatements"]>,
  historyResult: SectionResult<StockProviderDataBundle["priceHistory"]>,
  intradayResult: SectionResult<StockProviderDataBundle["intraday"]>,
  newsResult: SectionResult<StockProviderDataBundle["news"]>,
  earningsResult: SectionResult<StockProviderDataBundle["earnings"]>,
  analystResult: SectionResult<StockProviderDataBundle["analystTarget"]>,
): StockProviderDataBundle => {
  const availableDataSections = results
    .filter((result) => result.fromProvider)
    .map((result) => result.section);

  const missingDataSections = results
    .filter((result) => !result.fromProvider)
    .map((result) => result.section);

  const allRequiredFailed = missingDataSections.length === results.length;

  const fallbackSections =
    !allRequiredFailed && missingDataSections.length > 0
      ? missingDataSections
      : undefined;

  const bundleFallbackReason = results.find((r) => r.fallbackReason)?.fallbackReason;

  const sectionProviders = results.reduce<
    Partial<Record<FinancialDataSection, FinancialDataSource>>
  >((acc, result) => {
    if (result.fromProvider && result.sectionSource) {
      acc[result.section] = result.sectionSource;
    }
    return acc;
  }, {});

  const primarySource = results.find((r) => r.sectionSource && r.sectionSource !== "mock")
    ?.sectionSource;
  const source = allRequiredFailed ? "mock" : (primarySource ?? providerId);
  const isFallback = allRequiredFailed;
  const fetchedAt = new Date().toISOString();

  logFinancialDataDebug("bundle.summary", {
    symbol: normalized,
    activeProvider: providerId,
    sectionsFromProvider: availableDataSections,
    sectionProviders,
    fallbackSections: missingDataSections,
    isFallback,
    source,
    fallbackReason: bundleFallbackReason,
  });

  return {
    symbol: normalized,
    profile: profileResult.value,
    quote: quoteResult.value,
    keyMetrics: keyMetricsResult.value,
    incomeStatements: incomeResult.value,
    cashFlowStatements: cashFlowResult.value,
    priceHistory: historyResult.value,
    intraday: intradayResult.value,
    news: newsResult.value,
    earnings: earningsResult.value,
    analystTarget: analystResult.value,
    analystRatings: mockBundle.analystRatings,
    meta: buildFinancialDataMeta({
      provider: providerId,
      source,
      isFallback,
      availableDataSections,
      missingDataSections,
      sectionProviders:
        Object.keys(sectionProviders).length > 0 ? sectionProviders : undefined,
      fallbackSections,
      fallbackReason: bundleFallbackReason,
      fetchedAt,
      cachedAt: fetchedAt,
    }),
  };
};

const fetchSectionsForSymbol = async (
  normalized: string,
  primary: StockDataProvider | null,
  fallback: StockDataProvider | null,
  requestedSections: FinancialDataSection[],
  mockBundle: StockProviderDataBundle,
  batchTracker?: SymbolBatchTracker,
): Promise<StockProviderDataBundle> => {
  const providerId = getActiveProviderId();
  const includes = (section: FinancialDataSection) =>
    requestedSections.includes(section);

  const profileResult = includes("profile")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "profile",
        primary,
        fallback,
        primaryFetcher: (p) => p.fetchProfile(normalized),
        mockFallback: () => mockStockProfile(normalized),
        isEmpty: (value) => value === null,
        batchTracker,
      })
    : {
        section: "profile" as const,
        value: mockStockProfile(normalized),
        fromProvider: false,
      };

  const quoteResult = includes("quote")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "quote",
        primary,
        fallback,
        primaryFetcher: (p) => p.fetchQuote(normalized),
        mockFallback: () => mockStockQuote(normalized),
        liveFallback: async () => {
          const asset = await findAssetBySymbol(normalized);

          if (!asset) {
            return null;
          }

          const quote = await getFallbackQuote(asset);

          if (!quote || quote.price === null) {
            return null;
          }

          const value = mapQuoteToStockProviderQuote(quote, normalized);

          if (!value) {
            return null;
          }

          if (
            quote.source !== "yahoo_scraper" &&
            quote.source !== "yahoo_chart" &&
            quote.source !== "google_scraper" &&
            quote.source !== "cache"
          ) {
            return null;
          }

          return {
            value,
            sectionSource: mapQuoteSourceToFinancialDataSource(quote.source),
          };
        },
        isEmpty: (value) => value === null,
        batchTracker,
      })
    : {
        section: "quote" as const,
        value: mockStockQuote(normalized),
        fromProvider: false,
      };

  const keyMetricsResult = includes("keyMetrics")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "keyMetrics",
        primary,
        fallback,
        primaryFetcher: (p) => p.fetchKeyMetrics(normalized),
        mockFallback: () => mockKeyMetrics(normalized),
        isEmpty: (value) => value === null,
        batchTracker,
      })
    : {
        section: "keyMetrics" as const,
        value: mockKeyMetrics(normalized),
        fromProvider: false,
      };

  const incomeResult = includes("incomeStatements")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "incomeStatements",
        primary,
        fallback,
        primaryFetcher: (p) => p.fetchIncomeStatements(normalized),
        mockFallback: () => mockIncomeStatements(normalized),
        batchTracker,
      })
    : {
        section: "incomeStatements" as const,
        value: mockIncomeStatements(normalized),
        fromProvider: false,
      };

  const cashFlowResult = includes("cashFlowStatements")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "cashFlowStatements",
        primary,
        fallback,
        primaryFetcher: (p) => p.fetchCashFlowStatements(normalized),
        mockFallback: () => mockCashFlowStatements(normalized),
        batchTracker,
      })
    : {
        section: "cashFlowStatements" as const,
        value: mockCashFlowStatements(normalized),
        fromProvider: false,
      };

  const historyResult = includes("priceHistory")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "priceHistory",
        primary,
        fallback,
        primaryFetcher: (p) => p.fetchPriceHistory(normalized),
        mockFallback: () => mockPriceHistory(normalized),
        liveFallback: async () => {
          const asset = await findAssetBySymbol(normalized);

          if (!asset) {
            return null;
          }

          const nasdaqHistory = await getNasdaqHistoricalPriceHistory(asset);
          const value =
            nasdaqHistory ?? (await getYahooFinanceChartFallbackPriceHistory(asset));

          if (!value || value.points.length === 0) {
            return null;
          }

          return {
            value,
            sectionSource: nasdaqHistory ? "nasdaq" : "yahoo_chart",
          };
        },
        isEmpty: (value) => value === null || (value?.points?.length ?? 0) === 0,
        batchTracker,
      })
    : {
        section: "priceHistory" as const,
        value: mockPriceHistory(normalized),
        fromProvider: false,
      };

  const intradayResult = includes("intraday")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "intraday",
        primary,
        fallback,
        primaryFetcher: (p) =>
          p.fetchIntradayHistory
            ? p.fetchIntradayHistory(normalized)
            : Promise.resolve(null),
        mockFallback: () => mockIntradayHistory(normalized),
        liveFallback: async () => {
          const asset = await findAssetBySymbol(normalized);

          if (!asset) {
            return null;
          }

          const value = await getYahooFinanceChartFallbackIntradayHistory(asset);

          if (!value || value.points.length === 0) {
            return null;
          }

          return {
            value,
            sectionSource: "yahoo_chart",
          };
        },
        isEmpty: (value) => value === null || (value?.points?.length ?? 0) === 0,
        batchTracker,
      })
    : {
        section: "intraday" as const,
        value: null,
        fromProvider: false,
      };

  const newsResult = includes("news")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "news",
        primary,
        fallback,
        primaryFetcher: (p) =>
          p.fetchNews ? p.fetchNews(normalized) : Promise.resolve([]),
        mockFallback: () => mockNews(normalized),
        batchTracker,
      })
    : {
        section: "news" as const,
        value: mockNews(normalized),
        fromProvider: false,
      };

  const earningsResult = includes("earnings")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "earnings",
        primary,
        fallback,
        primaryFetcher: (p) =>
          p.fetchEarnings
            ? p.fetchEarnings(normalized, { profile: profileResult.value })
            : Promise.resolve([]),
        mockFallback: () => mockEarnings(normalized),
        batchTracker,
      })
    : {
        section: "earnings" as const,
        value: mockEarnings(normalized),
        fromProvider: false,
      };

  const analystResult = includes("analystTarget")
    ? await fetchSectionWithCache({
        symbol: normalized,
        section: "analystTarget",
        primary,
        fallback,
        primaryFetcher: (p) =>
          p.fetchAnalystTarget
            ? p.fetchAnalystTarget(normalized, { quote: quoteResult.value })
            : Promise.resolve(null),
        mockFallback: () => mockAnalystTarget(normalized),
        isEmpty: (value) => value === null,
        batchTracker,
      })
    : {
        section: "analystTarget" as const,
        value: mockAnalystTarget(normalized),
        fromProvider: false,
      };

  const results = [
    profileResult,
    quoteResult,
    keyMetricsResult,
    incomeResult,
    cashFlowResult,
    historyResult,
    intradayResult,
    newsResult,
    earningsResult,
    analystResult,
  ].filter((result) => requestedSections.includes(result.section));

  return buildBundleFromSectionResults(
    normalized,
    providerId,
    mockBundle,
    results,
    profileResult,
    quoteResult,
    keyMetricsResult,
    incomeResult,
    cashFlowResult,
    historyResult,
    intradayResult,
    newsResult,
    earningsResult,
    analystResult,
  );
};

export const getStockDataBundle = async (
  symbol: string,
  options?: GetStockDataBundleOptions,
): Promise<StockProviderDataBundle> => {
  const normalized = normalizeProviderSymbol(symbol);
  const { primary, fallback } = resolveStockProviders();
  const requestedSections = resolveRequestedSections({
    scope: options?.scope,
    sections: options?.sections,
  });

  if (!primary && !fallback) {
    return buildMockStockDataBundle(normalized);
  }

  const mockBundle = buildMockStockDataBundle(normalized);

  return fetchSectionsForSymbol(
    normalized,
    primary,
    fallback,
    requestedSections,
    mockBundle,
  );
};

export const getStockDataBundleForBatch = async (
  symbol: string,
  options?: GetStockDataBundleOptions,
): Promise<StockProviderDataBundle> => {
  const normalized = normalizeProviderSymbol(symbol);
  const { primary, fallback } = resolveStockProviders();
  const requestedSections = resolveRequestedSections({
    scope: options?.scope,
    sections: options?.sections,
  });

  if (!primary && !fallback) {
    return buildMockStockDataBundle(normalized);
  }

  const mockBundle = buildMockStockDataBundle(normalized);
  const batchTracker: SymbolBatchTracker = {
    hadCacheHit: false,
    hadCacheMiss: false,
  };

  const bundle = await fetchSectionsForSymbol(
    normalized,
    primary,
    fallback,
    requestedSections,
    mockBundle,
    batchTracker,
  );

  if (batchTracker.hadCacheMiss) {
    recordCacheMiss(normalized);
  } else if (batchTracker.hadCacheHit) {
    recordCacheHit(normalized);
  }

  return bundle;
};
