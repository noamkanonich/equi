import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";

export type FreshnessBadgeTone = "neutral" | "positive" | "negative" | "warning";

export const getDataFreshnessTone = (
  status: DataFreshnessStatus,
): FreshnessBadgeTone => {
  switch (status) {
    case "live":
    case "recent":
      return "positive";
    case "stale":
      return "warning";
    case "unavailable":
      return "negative";
    case "loading":
      return "neutral";
    case "mock":
    default:
      return "neutral";
  }
};
