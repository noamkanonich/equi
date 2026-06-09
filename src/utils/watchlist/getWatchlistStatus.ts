import type { WatchlistStatus } from "@/data/watchlist/watchlist.types";

export const getWatchlistStatus = ({
  distanceToBuyZonePercent,
  opportunityScore,
  hasEnoughData = true,
}: {
  distanceToBuyZonePercent: number;
  opportunityScore: number;
  hasEnoughData?: boolean;
}): WatchlistStatus => {
  if (!hasEnoughData) return "needsMoreData";
  if (distanceToBuyZonePercent <= 0 && opportunityScore >= 75) return "readyToBuy";
  if (distanceToBuyZonePercent > 6) return "tooExpensive";
  if (opportunityScore >= 75) return "waitForPullback";
  return "watchClosely";
};
