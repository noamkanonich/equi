import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { WatchlistItemFormInput } from "@/data/watchlist/watchlist.types";

export const buildDefaultWatchlistInput = (
  symbol: string,
  referencePrice: number,
  currency: CurrencyCode,
): WatchlistItemFormInput => ({
  symbol,
  buyZone: {
    low: Number((referencePrice * 0.88).toFixed(2)),
    high: Number((referencePrice * 0.96).toFixed(2)),
    currency,
  },
  status: "watchClosely",
});
