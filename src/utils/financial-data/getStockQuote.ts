import type { StockProviderQuote } from "@/data/financial-data/financial-data.types";
import { getStockDataBundle } from "./getStockDataBundle";

export const getStockQuote = async (
  symbol: string,
): Promise<StockProviderQuote | null> => {
  const bundle = await getStockDataBundle(symbol);
  return bundle.quote;
};
