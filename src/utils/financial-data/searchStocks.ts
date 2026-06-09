import "server-only";

import { financialDataConfig } from "@/config/financial-data.config";
import { mockStockSearchCatalog } from "@/data/stocks/stock-search.mock";
import type { StockSearchResponse, StockSearchResultItem } from "@/data/financial-data/search.types";
import { normalizeProviderSymbol } from "@/data/financial-data/mappers";
import type { Asset } from "@/data/market/market.types";
import { logFinancialDataDebug } from "@/lib/financial-data/devFinancialDataLog";
import { fetchFmp, isFmpConfigured } from "@/lib/financial-data/providers/fmp/fmp.client";
import { fmpEndpoints } from "@/lib/financial-data/providers/fmp/fmp.endpoints";
import { isFmpArrayResponse } from "@/lib/financial-data/providers/fmp/fmpResponseGuards";
import { fetchFinnhub, isFinnhubConfigured } from "@/lib/financial-data/providers/finnhub/finnhub.client";
import { mapFinnhubSearchResults } from "@/lib/financial-data/providers/finnhub/mappers";
import type { FinnhubSearchResult } from "@/lib/financial-data/providers/finnhub/finnhub.types";
import {
  mapAssetToStockSearchResult,
  mapStockSearchResultToAsset,
  searchAssets,
} from "@/lib/financial-data/asset-registry";
import { filterMockStockSearchCatalog } from "@/utils/add-stock/filterStockSearchResults";
import { mapMockSearchEntryToResultItem } from "@/utils/stocks/mapMockSearchEntryToResultItem";

const SEARCH_TTL_MS = 10 * 60 * 1000;
const SEARCH_CACHE_VERSION = "v7";
const SEARCH_RESULT_LIMIT = 20;
const MIN_QUERY_LENGTH = 2;

type SearchCacheEntry = {
  response: StockSearchResponse;
  expiresAt: number;
};

const searchCache = new Map<string, SearchCacheEntry>();
const REAL_SEARCH_PROVIDER_IDS = ["fmp", "finnhub"] as const;

type RealSearchProviderId = (typeof REAL_SEARCH_PROVIDER_IDS)[number];

type FmpSearchRow = {
  symbol: string;
  name: string;
  exchange?: string;
  exchangeShortName?: string;
};

const SUPPORTED_FMP_EXCHANGES = new Set(["AMEX", "NASDAQ", "NYSE", "NYSE ARCA"]);

const mapFmpSearchResults = (rows: FmpSearchRow[]): StockSearchResultItem[] =>
  rows
    .filter((row) => {
      const exchange = (row.exchangeShortName ?? row.exchange ?? "").trim().toUpperCase();

      return row.symbol && row.name && SUPPORTED_FMP_EXCHANGES.has(exchange);
    })
    .slice(0, SEARCH_RESULT_LIMIT)
    .map((row) => ({
      symbol: normalizeProviderSymbol(row.symbol),
      displaySymbol: normalizeProviderSymbol(row.symbol),
      companyName: row.name,
      exchange: row.exchangeShortName ?? row.exchange ?? "US",
      currency: "USD",
      market: "US",
      assetType: "stock",
      provider: "fmp",
      providerSymbol: normalizeProviderSymbol(row.symbol),
      hasLivePrice: true,
      isMock: false,
    }));

const searchViaFmp = async (query: string): Promise<StockSearchResultItem[] | null> => {
  if (!isFmpConfigured()) {
    return null;
  }

  try {
    const [symbolData, nameData] = await Promise.all([
      fetchFmp<unknown>(fmpEndpoints.searchSymbol(query)).catch(() => null),
      fetchFmp<unknown>(fmpEndpoints.searchName(query)).catch(() => null),
    ]);

    const rows = [
      ...(isFmpArrayResponse<FmpSearchRow>(symbolData) ? symbolData : []),
      ...(isFmpArrayResponse<FmpSearchRow>(nameData) ? nameData : []),
    ];

    return rows.length > 0 ? mapFmpSearchResults(rows) : null;
  } catch {
    return null;
  }
};

const searchViaFinnhub = async (query: string): Promise<StockSearchResultItem[] | null> => {
  if (!isFinnhubConfigured()) {
    return null;
  }

  try {
    const data = await fetchFinnhub<FinnhubSearchResult[]>("/search", { q: query });
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    return mapFinnhubSearchResults(data);
  } catch {
    return null;
  }
};

const searchViaMock = (query: string): StockSearchResultItem[] =>
  filterMockStockSearchCatalog(mockStockSearchCatalog, query)
    .slice(0, SEARCH_RESULT_LIMIT)
    .map(mapMockSearchEntryToResultItem);

const getConfiguredSearchProviders = (): RealSearchProviderId[] => {
  if (financialDataConfig.provider === "finnhub") {
    return ["finnhub", "fmp"];
  }

  return ["fmp", "finnhub"];
};

const searchViaProvider = async (
  providerId: RealSearchProviderId,
  query: string,
): Promise<StockSearchResultItem[] | null> => {
  if (providerId === "finnhub") {
    const finnhubResults = await searchViaFinnhub(query);

    return finnhubResults?.map((result) => ({
      ...result,
      displaySymbol: result.symbol,
      currency: "USD",
      market: "US",
      assetType: "stock",
      provider: "finnhub",
      providerSymbol: result.symbol,
      hasLivePrice: true,
      isMock: false,
    })) ?? null;
  }

  return searchViaFmp(query);
};

const dedupeSearchResults = (results: StockSearchResultItem[]): StockSearchResultItem[] => {
  const seen = new Set<string>();
  const deduped: StockSearchResultItem[] = [];

  for (const result of results) {
    const key = result.symbol.trim().toUpperCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(result);
  }

  return deduped;
};

const buildResponse = (
  results: StockSearchResultItem[],
  source: StockSearchResponse["meta"]["source"],
  isFallback: boolean,
): StockSearchResponse => ({
  results: dedupeSearchResults(results).slice(0, SEARCH_RESULT_LIMIT),
  meta: {
    source,
    isFallback,
    fetchedAt: new Date().toISOString(),
  },
});

const resolveSearchSource = (
  results: StockSearchResultItem[],
  fallbackSource: StockSearchResponse["meta"]["source"],
): StockSearchResponse["meta"]["source"] => {
  const sources = new Set(
    results
      .map((result) => {
        if (
          result.provider === "fmp" ||
          result.provider === "finnhub" ||
          result.provider === "mock" ||
          result.provider === "tase"
        ) {
          return result.provider;
        }

        return undefined;
      })
      .filter(Boolean),
  );

  if (sources.size > 1) {
    return "mixed";
  }

  return [...sources][0] ?? fallbackSource;
};

const searchUsAssets = async (
  query: string,
): Promise<{
  assets: Asset[];
  source: StockSearchResponse["meta"]["source"];
  isFallback: boolean;
}> => {
  if (financialDataConfig.useMockStockSearch) {
    const mockResults = searchViaMock(query);
    logFinancialDataDebug("search.provider", {
      query,
      source: "mock",
      count: mockResults.length,
      mockFirst: true,
    });
    return {
      assets: mockResults.map((result) => mapStockSearchResultToAsset(result, "mock")),
      source: "mock",
      isFallback: true,
    };
  }

  const providerIds = getConfiguredSearchProviders();

  for (const providerId of providerIds) {
    const providerResults = await searchViaProvider(providerId, query);
    if (providerResults && providerResults.length > 0) {
      logFinancialDataDebug("search.provider", {
        query,
        source: providerId,
        count: providerResults.length,
      });
      return {
        assets: providerResults.map((result) =>
          mapStockSearchResultToAsset(result, providerId),
        ),
        source: providerId,
        isFallback: providerId !== providerIds[0],
      };
    }
  }

  if (!financialDataConfig.allowMockStockSearchFallback) {
    logFinancialDataDebug("search.provider", {
      query,
      source: providerIds[0],
      count: 0,
      mockFallback: false,
    });
    return {
      assets: [],
      source: providerIds[0],
      isFallback: false,
    };
  }

  const mockResults = searchViaMock(query);
  return {
    assets: mockResults.map((result) => mapStockSearchResultToAsset(result, "mock")),
    source: "mock",
    isFallback: true,
  };
};

export const searchStocks = async (rawQuery: string): Promise<StockSearchResponse> => {
  const query = rawQuery.trim();
  if (query.length < MIN_QUERY_LENGTH) {
    return buildResponse([], "mock", true);
  }

  const cacheKey = `${SEARCH_CACHE_VERSION}:${query.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    logFinancialDataDebug("search.cacheHit", { query: cacheKey });
    return cached.response;
  }

  const usSearch = await searchUsAssets(query);
  const unifiedAssets = await searchAssets(query, usSearch.assets);
  const results = unifiedAssets.slice(0, SEARCH_RESULT_LIMIT).map(mapAssetToStockSearchResult);
  const source = resolveSearchSource(results, usSearch.source);
  const response = buildResponse(results, source, usSearch.isFallback && source !== "tase");

  searchCache.set(cacheKey, { response, expiresAt: Date.now() + SEARCH_TTL_MS });
  logFinancialDataDebug("search.unified", { query, source, count: results.length });

  return response;
};
