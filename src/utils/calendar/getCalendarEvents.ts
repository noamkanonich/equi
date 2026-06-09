import { earningsCalendarEventsMock } from "@/data/calendar/calendar.mock";
import type { EarningsCalendarEvent } from "@/data/calendar/calendar.types";

export const getCalendarEvents = (): EarningsCalendarEvent[] =>
  earningsCalendarEventsMock;
