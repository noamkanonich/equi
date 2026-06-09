import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { enrichItemsWithBundles } from "./enrichItemsWithBundles";
import type { StockProfileEnrichable } from "./mergeStockProfileIntoStockItem";
import type { StockQuoteEnrichable } from "./mergeStockQuoteIntoHolding";

export const enrichStockRows = <
  T extends StockQuoteEnrichable & StockProfileEnrichable,
>(
  rows: T[],
  bundles: Record<string, StockProviderDataBundle>,
): T[] => enrichItemsWithBundles(rows, bundles);
