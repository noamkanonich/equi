import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type {
  EnrichedWatchlistItem,
  WatchlistStoredItem,
} from "@/data/watchlist/watchlist.types";
import { calculateDistanceToBuyZone } from "@/utils/watchlist/calculateDistanceToBuyZone";
import { mergeStockBundleIntoStockItem } from "./mergeStockProfileIntoStockItem";

export const enrichWatchlistItem = (
  item: WatchlistStoredItem,
  bundle: StockProviderDataBundle | undefined,
): EnrichedWatchlistItem => {
  const mergeBase = {
    ...item,
    companyName: item.symbol,
    logoUrl: null as string | null,
    currentPrice: 0,
    currency: item.buyZone.currency,
    dayChangePercent: 0,
  };

  const merged = mergeStockBundleIntoStockItem(mergeBase, bundle);

  return {
    ...item,
    companyName: merged.companyName,
    logoUrl: merged.logoUrl,
    currentPrice: merged.currentPrice,
    currency: merged.currency ?? item.buyZone.currency,
    dayChangePercent: merged.dayChangePercent,
    status: item.status ?? "watchClosely",
    distanceToBuyZonePercent: Number(
      calculateDistanceToBuyZone(merged.currentPrice, item.buyZone).toFixed(1),
    ),
  };
};
