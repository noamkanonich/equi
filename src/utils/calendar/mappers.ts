const padDatePart = (value: number) => value.toString().padStart(2, "0");

export const mapDateToIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());

  return `${year}-${month}-${day}`;
};

export const mapIsoDateToLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

// TODO: mapProviderEarningsToCalendarEvent — normalize provider earnings API into EarningsCalendarEvent

export { getCalendarEvents } from "./getCalendarEvents";
export { sortCalendarEvents } from "./sortCalendarEvents";
export { getInitialCalendarMonth } from "./getInitialCalendarMonth";
