"use client";

import styled from "styled-components";
import type {
  CalendarDay,
  EarningsCalendarEvent,
} from "@/data/calendar/calendar.types";
import { EarningsCalendarDay } from "./EarningsCalendarDay";

type EarningsCalendarGridProps = {
  days: CalendarDay[];
  selectedDate: string;
  weekdayLabels: string[];
  todayLabel: string;
  moreEventsLabel: (count: number) => string;
  getTimingLabel: (event: EarningsCalendarEvent) => string;
  getImpactLabel: (event: EarningsCalendarEvent) => string;
  onSelectDay: (day: CalendarDay) => void;
  onSelectEvent: (event: EarningsCalendarEvent) => void;
};

export const EarningsCalendarGrid = ({
  days,
  selectedDate,
  weekdayLabels,
  todayLabel,
  moreEventsLabel,
  getTimingLabel,
  getImpactLabel,
  onSelectDay,
  onSelectEvent,
}: EarningsCalendarGridProps) => {
  return (
    <GridWrap>
      <Weekdays aria-hidden>
        {weekdayLabels.map((weekday) => (
          <Weekday key={weekday}>{weekday}</Weekday>
        ))}
      </Weekdays>
      <DaysGrid>
        {days.map((day) => (
          <EarningsCalendarDay
            key={day.date}
            day={day}
            isSelected={day.date === selectedDate}
            todayLabel={todayLabel}
            moreEventsLabel={moreEventsLabel}
            getTimingLabel={getTimingLabel}
            getImpactLabel={getImpactLabel}
            onSelectDay={onSelectDay}
            onSelectEvent={onSelectEvent}
          />
        ))}
      </DaysGrid>
    </GridWrap>
  );
};

const GridWrap = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Weekday = styled.span`
  padding-block: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: center;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    gap: 0;
    border: 1px solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
  }
`;
