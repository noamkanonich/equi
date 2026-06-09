import { apiClient } from "@/lib/api/api-client";
import { addStockSearchResultsMock } from "@/data/add-stock/add-stock.mock";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import { mockStockSearchCatalog } from "@/data/stocks/stock-search.mock";
import type { StockSearchResponse } from "@/data/financial-data/search.types";
import {
  filterMockStockSearchCatalog,
  filterStockSearchResults,
} from "@/utils/add-stock/filterStockSearchResults";
import { buildMockAddStockSearchResult } from "@/utils/stocks/buildMockAddStockSearchResult";
import { getStockScoreBySymbol } from "@/utils/scoring/getStockScoreBySymbol";

const MIN_QUERY_LENGTH = 2;

const mapSearchItemToAddStockResult = (
  item: StockSearchResponse["results"][number],
  metaIsFallback: boolean,
): AddStockSearchResult => {
  const template = addStockSearchResultsMock.find((mock) => mock.symbol === item.symbol);
  const score = getStockScoreBySymbol(item.symbol).score;
  const market = item.market ?? "US";
  const hasLivePrice = item.hasLivePrice ?? market !== "IL";
  const currency = item.currency ?? (market === "IL" ? "ILS" : "USD");
  const assetId = item.assetId ?? `${market}:${item.symbol}`;
  const isMock = item.isMock === true || item.provider === "mock";
  const isFallback = metaIsFallback || isMock;

  if (template) {
    return {
      ...template,
      assetId,
      symbol: item.symbol,
      displaySymbol: item.displaySymbol ?? item.symbol,
      companyName: item.companyName,
      exchange: item.exchange,
      currency,
      market,
      assetType: item.assetType ?? template.assetType ?? "stock",
      provider: item.provider ?? template.provider ?? "mock",
      providerSymbol: item.providerSymbol ?? item.symbol,
      hasLivePrice,
      isMock,
      isFallback,
    };
  }

  return {
    assetId,
    symbol: item.symbol,
    displaySymbol: item.displaySymbol ?? item.symbol,
    companyName: item.companyName,
    logoUrl: null,
    exchange: item.exchange,
    market,
    assetType: item.assetType ?? "stock",
    provider: item.provider ?? (market === "IL" ? "tase" : "fmp"),
    providerSymbol: item.providerSymbol ?? item.symbol,
    hasLivePrice,
    sector: item.sector ?? "—",
    industry: item.industry ?? "—",
    price: 0,
    currency,
    dayChangePercent: 0,
    score: hasLivePrice ? score : 0,
    marketCap: 0,
    weekRangeLow: 0,
    weekRangeHigh: 0,
    analystRating: "watch",
    analystRatingScore: 3,
    sparkline: [],
    isMock,
    isFallback,
  };
};

const buildClientMockFallback = (query: string) => {
  const filteredCatalog = filterMockStockSearchCatalog(mockStockSearchCatalog, query);
  const results = filteredCatalog.map(buildMockAddStockSearchResult);

  return {
    results,
    meta: {
      source: "mock" as const,
      isFallback: true,
      fetchedAt: new Date().toISOString(),
    },
  };
};

export const fetchStockSearch = async (
  query: string,
): Promise<{ results: AddStockSearchResult[]; meta: StockSearchResponse["meta"] }> => {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) {
    return {
      results: [],
      meta: { source: "mock", isFallback: true, fetchedAt: new Date().toISOString() },
    };
  }

  try {
    const response = await apiClient.get<StockSearchResponse>("/api/stocks/search", {
      params: { query: trimmed },
    });

    return {
      results: response.data.results.map((item) =>
        mapSearchItemToAddStockResult(item, response.data.meta.isFallback),
      ),
      meta: response.data.meta,
    };
  } catch {
    const fallback = filterStockSearchResults(addStockSearchResultsMock, trimmed);
    if (fallback.length > 0) {
      return {
        results: fallback.map((item) => ({ ...item, isMock: true, isFallback: true })),
        meta: {
          source: "mock",
          isFallback: true,
          fetchedAt: new Date().toISOString(),
        },
      };
    }

    return buildClientMockFallback(trimmed);
  }
};
