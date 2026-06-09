import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type { StockQuoteEnrichable } from "./mergeStockQuoteIntoHolding";
import { mergeStockQuoteIntoHolding } from "./mergeStockQuoteIntoHolding";

export type StockProfileEnrichable = {
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  exchange?: string;
  sector?: string;
};

export const mergeStockProfileIntoStockItem = <T extends StockProfileEnrichable>(
  item: T,
  bundle: StockProviderDataBundle | undefined,
): T => {
  if (!bundle?.profile) {
    return item;
  }

  const { profile } = bundle;

  return {
    ...item,
    companyName: profile.companyName || item.companyName,
    logoUrl: profile.logoUrl ?? item.logoUrl,
    ...(profile.exchange ? { exchange: profile.exchange } : {}),
    ...(profile.sector ? { sector: profile.sector } : {}),
  };
};

export const mergeStockBundleIntoStockItem = <
  T extends StockQuoteEnrichable & StockProfileEnrichable,
>(
  item: T,
  bundle: StockProviderDataBundle | undefined,
): T =>
  mergeStockQuoteIntoHolding(mergeStockProfileIntoStockItem(item, bundle), bundle);
