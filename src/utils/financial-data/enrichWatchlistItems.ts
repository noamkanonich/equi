import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type {
  EnrichedWatchlistItem,
  WatchlistStoredItem,
} from "@/data/watchlist/watchlist.types";
import { enrichWatchlistItem } from "./enrichWatchlistItem";

export const enrichWatchlistItems = (
  items: WatchlistStoredItem[],
  bundles: Record<string, StockProviderDataBundle>,
): EnrichedWatchlistItem[] =>
  items.map((item) => enrichWatchlistItem(item, bundles[item.symbol]));
