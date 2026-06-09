import type {
  CalendarDay,
  EarningsCalendarEvent,
} from "@/data/calendar/calendar.types";
import { mapDateToIsoDate } from "./mappers";

type BuildCalendarMonthOptions = {
  visibleMonth: Date;
  events: EarningsCalendarEvent[];
  today?: Date;
};

const getEventsByDate = (events: EarningsCalendarEvent[]) => {
  return events.reduce<Record<string, EarningsCalendarEvent[]>>((eventsByDate, event) => {
    eventsByDate[event.date] = [...(eventsByDate[event.date] ?? []), event];
    return eventsByDate;
  }, {});
};

export const buildCalendarMonth = ({
  visibleMonth,
  events,
  today = new Date(),
}: BuildCalendarMonthOptions): CalendarDay[] => {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  const todayIsoDate = mapDateToIsoDate(today);
  const eventsByDate = getEventsByDate(events);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const isoDate = mapDateToIsoDate(date);

    return {
      date: isoDate,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: isoDate === todayIsoDate,
      events: eventsByDate[isoDate] ?? [],
    };
  });
};
