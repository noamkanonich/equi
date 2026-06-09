import type { MarketSessionClock } from "@/data/market/market.types";
import { mapLocaleToIntlLocale } from "@/utils/formatting/mappers";
import { mapWeekdayToMarketDay } from "./mappers";

const MARKET_TIME_ZONE = "America/New_York";
const MARKET_OPEN_MINUTES = 9 * 60 + 30;
const MARKET_CLOSE_MINUTES = 16 * 60;
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_MINUTE = 60;

type MarketTimeParts = {
  year: number;
  month: number;
  day: number;
  weekday: string;
  hour: number;
  minute: number;
  second: number;
};

const marketPartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: MARKET_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const getMarketTimeParts = (date: Date): MarketTimeParts => {
  const parts = marketPartsFormatter.formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "0";

  return {
    year: Number(getPart("year")),
    month: Number(getPart("month")),
    day: Number(getPart("day")),
    weekday: getPart("weekday"),
    hour: Number(getPart("hour")),
    minute: Number(getPart("minute")),
    second: Number(getPart("second")),
  };
};

const getMarketWallTimeInstant = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
) => {
  const desiredWallTime = Date.UTC(year, month - 1, day, hour, minute, 0);
  let candidate = new Date(desiredWallTime);

  for (let index = 0; index < 3; index += 1) {
    const candidateParts = getMarketTimeParts(candidate);
    const candidateWallTime = Date.UTC(
      candidateParts.year,
      candidateParts.month - 1,
      candidateParts.day,
      candidateParts.hour,
      candidateParts.minute,
      candidateParts.second,
    );
    candidate = new Date(candidate.getTime() + desiredWallTime - candidateWallTime);
  }

  return candidate;
};

const getNextMarketOpenInstant = (date: Date) => {
  let nextDate = new Date(date);

  for (let offset = 0; offset < 8; offset += 1) {
    const parts = getMarketTimeParts(nextDate);
    const minutes = parts.hour * 60 + parts.minute;
    const isMarketDay = mapWeekdayToMarketDay(parts.weekday);
    const canOpenToday = offset > 0 || minutes < MARKET_OPEN_MINUTES;

    if (isMarketDay && canOpenToday) {
      return getMarketWallTimeInstant(parts.year, parts.month, parts.day, 9, 30);
    }

    nextDate = new Date(
      getMarketWallTimeInstant(parts.year, parts.month, parts.day, 12, 0).getTime() +
        24 * 60 * 60 * MILLISECONDS_IN_SECOND,
    );
  }

  return date;
};

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / MILLISECONDS_IN_SECOND));
  const hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const seconds = totalSeconds % SECONDS_IN_MINUTE;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const formatMarketTimestamp = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(mapLocaleToIntlLocale(locale), {
    timeZone: MARKET_TIME_ZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const getMarketSessionClock = (
  date: Date,
  locale: string,
): MarketSessionClock => {
  const parts = getMarketTimeParts(date);
  const minutes = parts.hour * 60 + parts.minute;
  const isMarketOpen =
    mapWeekdayToMarketDay(parts.weekday) &&
    minutes >= MARKET_OPEN_MINUTES &&
    minutes < MARKET_CLOSE_MINUTES;
  const targetInstant = isMarketOpen
    ? getMarketWallTimeInstant(parts.year, parts.month, parts.day, 16, 0)
    : getNextMarketOpenInstant(date);

  return {
    status: isMarketOpen ? "open" : "closed",
    countdown: formatCountdown(targetInstant.getTime() - date.getTime()),
    timestamp: formatMarketTimestamp(date, locale),
    targetKind: isMarketOpen ? "close" : "open",
  };
};
