import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { mergeStockBundleIntoStockItem } from "./mergeStockProfileIntoStockItem";
import type { StockProfileEnrichable } from "./mergeStockProfileIntoStockItem";
import type { StockQuoteEnrichable } from "./mergeStockQuoteIntoHolding";

export const enrichItemWithBundle = <
  T extends StockQuoteEnrichable & StockProfileEnrichable,
>(
  item: T,
  bundles: Record<string, StockProviderDataBundle>,
): T => mergeStockBundleIntoStockItem(item, bundles[item.symbol]);

export const enrichItemsWithBundles = <
  T extends StockQuoteEnrichable & StockProfileEnrichable,
>(
  items: T[],
  bundles: Record<string, StockProviderDataBundle>,
): T[] => items.map((item) => enrichItemWithBundle(item, bundles));
