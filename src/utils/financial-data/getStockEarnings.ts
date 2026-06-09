import type { StockProviderEarningsEvent } from "@/data/financial-data/financial-data.types";
import { getStockDataBundle } from "./getStockDataBundle";

export const getStockEarnings = async (
  symbol: string,
): Promise<StockProviderEarningsEvent[]> => {
  const bundle = await getStockDataBundle(symbol);
  return bundle.earnings;
};
