import type {
  CalendarFilter,
  EarningsCalendarEvent,
} from "@/data/calendar/calendar.types";

export const filterCalendarEvents = (
  events: EarningsCalendarEvent[],
  filter: CalendarFilter,
) => {
  if (filter === "portfolio") {
    return events.filter((event) => event.source === "portfolio");
  }

  if (filter === "watchlist") {
    return events.filter((event) => event.source === "watchlist");
  }

  if (filter === "highImpact") {
    return events.filter((event) => event.impact === "high");
  }

  return events;
};
