import type { EarningsCalendarEvent } from "@/data/calendar/calendar.types";
import { mapIsoDateToLocalDate } from "./mappers";

export const getInitialCalendarMonth = (events: EarningsCalendarEvent[]) => {
  const firstEventDate = events[0]?.date;
  return firstEventDate ? mapIsoDateToLocalDate(firstEventDate) : new Date();
};
