import type { CalendarEventImpact, CalendarEventSource } from "./calendar.types";

export const mapCalendarImpactToTone = (
  impact: CalendarEventImpact,
): "negative" | "warning" | "neutral" => {
  if (impact === "high") return "negative";
  if (impact === "medium") return "warning";
  return "neutral";
};

export const mapCalendarSourceToFilter = (
  source: CalendarEventSource,
): "portfolio" | "watchlist" => source;
