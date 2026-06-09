import { addStockSearchResultsMock } from "@/data/add-stock/add-stock.mock";
import type { RecentSearchDisplayEntry, RecentSearchEntry } from "@/data/search/recent-search.types";
import { getStockSymbolRegistryEntry } from "@/utils/stocks/stockSymbolRegistry";

const mockResultsBySymbol = new Map(
  addStockSearchResultsMock.map((result) => [result.symbol, result]),
);

export const resolveRecentSearchEntry = (
  entry: RecentSearchEntry,
): RecentSearchDisplayEntry => {
  const normalizedSymbol = entry.symbol.trim().toUpperCase();
  const mockResult = mockResultsBySymbol.get(normalizedSymbol);
  const registryEntry = getStockSymbolRegistryEntry(normalizedSymbol);

  return {
    symbol: normalizedSymbol,
    displaySymbol: mockResult?.displaySymbol ?? normalizedSymbol,
    companyName:
      mockResult?.companyName ??
      registryEntry?.companyName ??
      entry.companyName ??
      normalizedSymbol,
    isMock: mockResult?.isMock,
  };
};

export const resolveRecentSearchEntries = (
  entries: RecentSearchEntry[],
): RecentSearchDisplayEntry[] => entries.map(resolveRecentSearchEntry);
