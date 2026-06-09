import type {
  NextMoveMetricTrend,
  NextMovePriority,
  NextMoveType,
} from "@/data/next-moves/next-moves.types";

export type NextMoveTone = "positive" | "negative" | "warning" | "neutral" | "brand";

export const getNextMoveStatusTone = (type: NextMoveType): NextMoveTone => {
  if (type === "opportunity") return "positive";
  if (type === "needsAction") return "negative";
  if (type === "risk" || type === "monitor") return "warning";
  if (type === "earnings") return "brand";
  return "neutral";
};

export const getNextMoveStatusColor = getNextMoveStatusTone;

export const getNextMovePriorityTone = (
  priority: NextMovePriority,
): Exclude<NextMoveTone, "brand"> => {
  if (priority === "high") return "negative";
  if (priority === "medium") return "warning";
  return "neutral";
};

export const getMetricTrendTone = (
  trend?: NextMoveMetricTrend,
): Exclude<NextMoveTone, "brand"> => {
  if (trend === "up") return "positive";
  if (trend === "down") return "negative";
  if (trend === "warning") return "warning";
  return "neutral";
};
