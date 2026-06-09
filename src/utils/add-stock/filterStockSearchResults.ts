import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { MockStockSearchEntry } from "@/data/stocks/stock-search.mock";

type SearchableStock = Pick<
  AddStockSearchResult,
  "symbol" | "companyName" | "exchange" | "sector" | "industry"
>;

export const filterStockSearchResults = <T extends SearchableStock>(
  searchResults: T[],
  query: string,
): T[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return searchResults;
  }

  return searchResults.filter((stock) => {
    const searchableText = [
      stock.symbol,
      stock.companyName,
      stock.exchange,
      stock.sector,
      stock.industry,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
};

export const filterMockStockSearchCatalog = (
  catalog: MockStockSearchEntry[],
  query: string,
): MockStockSearchEntry[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return catalog;
  }

  return catalog.filter((entry) => {
    const searchableText = [
      entry.symbol,
      entry.companyName,
      entry.exchange,
      entry.sector,
      entry.industry,
      entry.country,
      entry.assetType,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
};
