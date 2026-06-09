export type CalendarEventType = "earnings";

export type CalendarEventImpact = "high" | "medium" | "low";

export type CalendarEventSource = "portfolio" | "watchlist";

export type CalendarFilter = "all" | "portfolio" | "watchlist" | "highImpact";

export type EarningsCalendarEvent = {
  id: string;
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  type: CalendarEventType;
  date: string;
  timing: "beforeMarket" | "afterMarket";
  source: CalendarEventSource;
  impact: CalendarEventImpact;
  portfolioWeight?: number;
  watchlistStatus?: "watching" | "highPriority";
};

export type CalendarDay = {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EarningsCalendarEvent[];
};
