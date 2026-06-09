"use client";

import styled from "styled-components";
import type {
  CalendarDay,
  EarningsCalendarEvent as EarningsCalendarEventType,
} from "@/data/calendar/calendar.types";
import { EarningsCalendarEvent } from "./EarningsCalendarEvent";

type EarningsCalendarDayProps = {
  day: CalendarDay;
  isSelected: boolean;
  todayLabel: string;
  moreEventsLabel: (count: number) => string;
  getTimingLabel: (event: EarningsCalendarEventType) => string;
  getImpactLabel: (event: EarningsCalendarEventType) => string;
  onSelectDay: (day: CalendarDay) => void;
  onSelectEvent: (event: EarningsCalendarEventType) => void;
};

export const EarningsCalendarDay = ({
  day,
  isSelected,
  todayLabel,
  moreEventsLabel,
  getTimingLabel,
  getImpactLabel,
  onSelectDay,
  onSelectEvent,
}: EarningsCalendarDayProps) => {
  const visibleEvents = day.events.slice(0, 2);
  const hiddenEventCount = Math.max(day.events.length - visibleEvents.length, 0);

  return (
    <DayButton
      type="button"
      $currentMonth={day.isCurrentMonth}
      $today={day.isToday}
      $selected={isSelected}
      onClick={() => onSelectDay(day)}
    >
      <DayHeader>
        <DayNumber>{day.dayOfMonth}</DayNumber>
        {day.isToday ? <TodayBadge>{todayLabel}</TodayBadge> : null}
      </DayHeader>
      <Events>
        {visibleEvents.map((event) => (
          <EarningsCalendarEvent
            key={event.id}
            event={event}
            timingLabel={getTimingLabel(event)}
            impactLabel={getImpactLabel(event)}
            onClick={onSelectEvent}
          />
        ))}
        {hiddenEventCount > 0 ? (
          <MoreEvents>{moreEventsLabel(hiddenEventCount)}</MoreEvents>
        ) : null}
      </Events>
    </DayButton>
  );
};

const DayButton = styled.button<{
  $currentMonth: boolean;
  $today: boolean;
  $selected: boolean;
}>`
  min-block-size: 6.75rem;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ theme, $selected, $today }) =>
      $selected || $today ? theme.colors.brand.primary : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $selected, $currentMonth }) =>
    $selected
      ? theme.colors.brand.primarySoft
      : $currentMonth
        ? theme.colors.background.card
        : theme.colors.background.app};
  color: ${({ theme, $currentMonth }) =>
    $currentMonth ? theme.colors.text.primary : theme.colors.text.muted};
  cursor: pointer;
  text-align: start;
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    transform 0.16s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-block-size: 4.75rem;
    padding: ${({ theme }) => theme.spacing.xs};
    border: 0;
    border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
    border-inline-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: 0;

    &:hover {
      transform: none;
    }
  }
`;

const DayHeader = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DayNumber = styled.span`
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const TodayBadge = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const Events = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-block-size: 0;
`;

const MoreEvents = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;
