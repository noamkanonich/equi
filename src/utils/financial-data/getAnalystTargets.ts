import type { StockProviderAnalystTarget } from "@/data/financial-data/financial-data.types";
import { getStockDataBundle } from "./getStockDataBundle";

export const getAnalystTargets = async (
  symbol: string,
): Promise<StockProviderAnalystTarget | null> => {
  const bundle = await getStockDataBundle(symbol);
  return bundle.analystTarget;
};
