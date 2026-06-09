import type { StockProviderNewsItem } from "@/data/financial-data/financial-data.types";
import { getStockDataBundle } from "./getStockDataBundle";

export const getStockNews = async (
  symbol: string,
): Promise<StockProviderNewsItem[]> => {
  const bundle = await getStockDataBundle(symbol);
  return bundle.news;
};
