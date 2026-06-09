import { mockStockSearchCatalog } from "@/data/stocks/stock-search.mock";
import { coreStockSymbols } from "@/utils/stocks/stockSymbolRegistry";
import { buildMockAddStockSearchResult } from "@/utils/stocks/buildMockAddStockSearchResult";
import type { AddStockSearchResult } from "./add-stock.types";

const POPULAR_ADD_STOCK_SYMBOLS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "GOOGL",
  "AMZN",
  "TSLA",
] as const satisfies readonly (typeof coreStockSymbols)[number][];

export const popularAddStockSymbols = [...POPULAR_ADD_STOCK_SYMBOLS];

export const addStockSearchResultsMock: AddStockSearchResult[] = mockStockSearchCatalog.map(
  buildMockAddStockSearchResult,
);

const addStockSearchResultsBySymbol = new Map(
  addStockSearchResultsMock.map((result) => [result.symbol, result]),
);

export const trendingAddStockSearchResults: AddStockSearchResult[] = POPULAR_ADD_STOCK_SYMBOLS.map(
  (symbol) => addStockSearchResultsBySymbol.get(symbol)!,
);
