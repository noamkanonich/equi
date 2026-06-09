import type {
  WatchlistAction,
  WatchlistItem,
  WatchlistStatus,
} from "./watchlist.types";
import { mapScoreToBadgeTone } from "@/utils/scoring/mappers";

export const mapWatchlistStatusToTone = (
  status: WatchlistStatus,
): "positive" | "warning" | "negative" | "neutral" => {
  if (status === "readyToBuy") return "positive";
  if (status === "tooExpensive") return "negative";
  if (status === "needsMoreData") return "neutral";
  return "warning";
};

export const mapWatchlistActionToVariant = (
  action: WatchlistAction,
): "primary" | "secondary" => {
  if (action === "reviewStock") return "primary";
  return "secondary";
};

export const mapWatchlistScoreToTone = (
  score: WatchlistItem["opportunityScore"],
): "positive" | "warning" | "negative" => mapScoreToBadgeTone(score);

export const mapDistanceToTone = (
  distanceToBuyZonePercent: number,
): "positive" | "warning" | "negative" => {
  if (distanceToBuyZonePercent <= 0) return "positive";
  if (distanceToBuyZonePercent <= 2) return "warning";
  return "negative";
};
