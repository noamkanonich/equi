"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Modal } from "@/components/ui/Modal";
import type {
  CalendarDay,
  CalendarFilter,
  EarningsCalendarEvent,
} from "@/data/calendar/calendar.types";
import { useRouter } from "@/i18n/routing";
import { buildCalendarMonth } from "@/utils/calendar/buildCalendarMonth";
import { filterCalendarEvents } from "@/utils/calendar/filterCalendarEvents";
import { formatCalendarDate } from "@/utils/calendar/formatCalendarDate";
import {
  getCalendarEvents,
  getInitialCalendarMonth,
  mapIsoDateToLocalDate,
  sortCalendarEvents,
} from "@/utils/calendar/mappers";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { EarningsCalendarEventDetails } from "./EarningsCalendarEventDetails";
import { EarningsCalendarEventList } from "./EarningsCalendarEventList";
import { EarningsCalendarFilters } from "./EarningsCalendarFilters";
import { EarningsCalendarGrid } from "./EarningsCalendarGrid";
import { EarningsCalendarHeader } from "./EarningsCalendarHeader";

type EarningsCalendarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  events?: EarningsCalendarEvent[];
  initialFilter?: CalendarFilter;
};

const filterOptions: CalendarFilter[] = [
  "all",
  "portfolio",
  "watchlist",
  "highImpact",
];

const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const monthKeys = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export const EarningsCalendarModal = ({
  isOpen,
  onClose,
  events = getCalendarEvents(),
  initialFilter = "all",
}: EarningsCalendarModalProps) => {
  const t = useTranslations("calendar");
  const tStates = useTranslations("states");
  const locale = useLocale();
  const router = useRouter();
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const sortedEvents = useMemo(() => sortCalendarEvents(events), [events]);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getInitialCalendarMonth(sortedEvents),
  );
  const [selectedFilter, setSelectedFilter] = useState<CalendarFilter>(initialFilter);
  const [selectedDate, setSelectedDate] = useState(sortedEvents[0]?.date ?? "");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    sortedEvents[0]?.id ?? null,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.tablet - 1}px)`,
    );

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, [theme.breakpoints.tablet]);

  const filteredEvents = useMemo(
    () => filterCalendarEvents(sortedEvents, selectedFilter),
    [selectedFilter, sortedEvents],
  );

  const calendarDays = useMemo(
    () => buildCalendarMonth({ visibleMonth, events: filteredEvents }),
    [filteredEvents, visibleMonth],
  );

  const selectedDayEvents = useMemo(
    () => filteredEvents.filter((event) => event.date === selectedDate),
    [filteredEvents, selectedDate],
  );

  const listEvents = selectedDayEvents.length > 0 ? selectedDayEvents : filteredEvents;
  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedEventId) ?? listEvents[0] ?? null;

  const monthLabel = `${t(`months.${monthKeys[visibleMonth.getMonth()]}`)} ${visibleMonth.getFullYear()}`;
  const weekdayLabels = weekdayKeys.map((weekday) => t(`weekdays.${weekday}`));
  const filterLabels = filterOptions.map((filter) => ({
    value: filter,
    label: t(`filters.${filter}`),
  }));

  const getTimingLabel = (event: EarningsCalendarEvent) =>
    t(`earnings.${event.timing}`);
  const getImpactLabel = (event: EarningsCalendarEvent) =>
    t(`earnings.${event.impact}Impact`);
  const getSourceLabel = (event: EarningsCalendarEvent) =>
    t(`earnings.${event.source}`);

  const handleSelectDay = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setSelectedEventId(day.events[0]?.id ?? null);
  };

  const handleSelectEvent = (event: EarningsCalendarEvent) => {
    setSelectedDate(event.date);
    setSelectedEventId(event.id);
  };

  const handleFilterChange = (filter: CalendarFilter) => {
    const nextEvents = filterCalendarEvents(sortedEvents, filter);
    const nextEvent = nextEvents[0] ?? null;

    setSelectedFilter(filter);
    setSelectedDate(nextEvent?.date ?? "");
    setSelectedEventId(nextEvent?.id ?? null);
    if (nextEvent) setVisibleMonth(mapIsoDateToLocalDate(nextEvent.date));
  };

  const handlePreviousMonth = () => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleReviewStock = (symbol: string) => {
    onClose();
    router.push(`/stocks/${symbol}`);
  };

  const detailRows = selectedEvent
    ? [
        {
          label: t("details.earningsDate"),
          value: formatCalendarDate(selectedEvent.date, {
            locale,
            includeWeekday: true,
          }),
        },
        { label: t("details.timing"), value: getTimingLabel(selectedEvent) },
        { label: t("details.source"), value: getSourceLabel(selectedEvent) },
        {
          label: t("details.portfolioWeight"),
          value:
            selectedEvent.portfolioWeight === undefined
              ? t("details.notInPortfolio")
              : formatPercent(selectedEvent.portfolioWeight, {
                  decimals: 1,
                  locale,
                  showSign: false,
                }),
        },
      ]
    : [];

  const content = (
    <Content>
      <EarningsCalendarHeader
        titleId={titleId}
        descriptionId={descriptionId}
        title={t("earnings.title")}
        subtitle={t("earnings.subtitle")}
        monthLabel={monthLabel}
        previousLabel={t("actions.previousMonth")}
        nextLabel={t("actions.nextMonth")}
        closeLabel={t("actions.close")}
        showCloseButton={!isMobile}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onClose={onClose}
      />
      <EarningsCalendarFilters
        label={t("filters.label")}
        filters={filterLabels}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />
      <Body>
        <CalendarColumn>
          <EarningsCalendarGrid
            days={calendarDays}
            selectedDate={selectedDate}
            weekdayLabels={weekdayLabels}
            todayLabel={t("earnings.today")}
            moreEventsLabel={(count) => t("earnings.moreEvents", { count })}
            getTimingLabel={getTimingLabel}
            getImpactLabel={getImpactLabel}
            onSelectDay={handleSelectDay}
            onSelectEvent={handleSelectEvent}
          />
        </CalendarColumn>
        <SidePanel>
          <EarningsCalendarEventList
            title={
              selectedDayEvents.length > 0
                ? t("earnings.selectedDay")
                : t("earnings.upcomingEvents")
            }
            emptyTitle={t("earnings.noEvents")}
            emptyDescription={t("earnings.noEventsDescription")}
            noResultsTitle={tStates("noResults.title")}
            noResultsDescription={tStates("noResults.description")}
            clearFiltersLabel={tStates("noResults.clearFilters")}
            events={listEvents}
            totalEvents={sortedEvents.length}
            selectedEventId={selectedEvent?.id}
            reviewStockLabel={t("earnings.reviewStock")}
            getDateLabel={(event) => formatCalendarDate(event.date, { locale })}
            getTimingLabel={getTimingLabel}
            getSourceLabel={getSourceLabel}
            getImpactLabel={getImpactLabel}
            onSelectEvent={handleSelectEvent}
            onReviewStock={handleReviewStock}
            onClearFilters={() => handleFilterChange("all")}
          />
          <EarningsCalendarEventDetails
            event={selectedEvent}
            title={t("earnings.eventDetails")}
            emptyTitle={t("earnings.noEvents")}
            note={t("earnings.considerReviewing")}
            impactLabel={selectedEvent ? getImpactLabel(selectedEvent) : undefined}
            detailRows={detailRows}
          />
        </SidePanel>
      </Body>
    </Content>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t("earnings.title")}
        closeLabel={t("actions.close")}
      >
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
    >
      {content}
    </Modal>
  );
};

const Content = styled.div`
  display: flex;
  min-block-size: 0;
  flex: 1;
  flex-direction: column;
  background:
    radial-gradient(
      circle at top left,
      ${({ theme }) => theme.colors.brand.primarySoft},
      transparent 28%
    ),
    ${({ theme }) => theme.colors.background.app};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    background: ${({ theme }) => theme.colors.background.card};
  }
`;

const Body = styled.div`
  min-block-size: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(17.5rem, 22rem);
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: 0;
    gap: ${({ theme }) => theme.spacing.md};
    overflow: visible;
  }
`;

const CalendarColumn = styled.section`
  min-inline-size: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: none;
  }
`;

const SidePanel = styled.aside`
  min-inline-size: 0;
  max-block-size: calc(90vh - 11rem);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
  padding-inline-end: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    max-block-size: none;
    overflow: visible;
    padding-inline-end: 0;
  }
`;
