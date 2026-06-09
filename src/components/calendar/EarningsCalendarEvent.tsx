"use client";

import styled from "styled-components";
import type { EarningsCalendarEvent as EarningsCalendarEventType } from "@/data/calendar/calendar.types";
import { mapCalendarImpactToTone } from "@/data/calendar/mappers";

type EarningsCalendarEventProps = {
  event: EarningsCalendarEventType;
  timingLabel: string;
  impactLabel: string;
  onClick?: (event: EarningsCalendarEventType) => void;
};

export const EarningsCalendarEvent = ({
  event,
  timingLabel,
  impactLabel,
  onClick,
}: EarningsCalendarEventProps) => {
  return (
    <EventButton
      type="button"
      $tone={mapCalendarImpactToTone(event.impact)}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onClick?.(event);
      }}
    >
      <Symbol dir="ltr">{event.symbol}</Symbol>
      <Meta>{timingLabel}</Meta>
      <Impact>{impactLabel}</Impact>
    </EventButton>
  );
};

const EventButton = styled.button<{
  $tone: "negative" | "warning" | "neutral";
}>`
  min-inline-size: 0;
  inline-size: 100%;
  min-block-size: 1.75rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0 ${({ theme }) => theme.spacing.xs};
  border: 1px solid
    ${({ theme, $tone }) =>
      $tone === "negative"
        ? theme.colors.status.negativeSoft
        : $tone === "warning"
          ? theme.colors.status.warningSoft
          : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $tone }) =>
    $tone === "negative"
      ? theme.colors.status.negativeSoft
      : $tone === "warning"
        ? theme.colors.status.warningSoft
        : theme.colors.status.neutralSoft};
  color: ${({ theme, $tone }) =>
    $tone === "negative"
      ? theme.colors.status.negative
      : $tone === "warning"
        ? theme.colors.status.warning
        : theme.colors.status.neutral};
  cursor: pointer;
  text-align: start;
  transition:
    border-color 0.16s ease,
    transform 0.16s ease;

  &:hover {
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-block-size: 1.5rem;
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Symbol = styled.strong`
  min-inline-size: 0;
  overflow: hidden;
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
`;

const Meta = styled.span`
  min-inline-size: 0;
  overflow: hidden;
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  opacity: 0.86;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const Impact = styled.span`
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  opacity: 0.8;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;
