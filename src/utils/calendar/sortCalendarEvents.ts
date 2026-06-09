import type { EarningsCalendarEvent } from "@/data/calendar/calendar.types";

export const sortCalendarEvents = (
  events: EarningsCalendarEvent[],
): EarningsCalendarEvent[] =>
  [...events].sort((firstEvent, secondEvent) =>
    firstEvent.date.localeCompare(secondEvent.date),
  );
