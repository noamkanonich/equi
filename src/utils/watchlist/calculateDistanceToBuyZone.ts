import type { BuyZone } from "@/data/watchlist/watchlist.types";

export const calculateDistanceToBuyZone = (
  currentPrice: number,
  buyZone: BuyZone,
) => {
  if (currentPrice >= buyZone.low && currentPrice <= buyZone.high) {
    return 0;
  }

  if (currentPrice > buyZone.high) {
    return ((currentPrice - buyZone.high) / buyZone.high) * 100;
  }

  return ((currentPrice - buyZone.low) / buyZone.low) * 100;
};
