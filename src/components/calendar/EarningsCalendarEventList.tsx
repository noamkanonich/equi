"use client";

import { ArrowUpRight } from "lucide-react";
import type { KeyboardEvent } from "react";
import styled from "styled-components";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SkeletonCard } from "@/components/ui/states/SkeletonCard";
import { StockLogo } from "@/components/ui/StockLogo";
import type { EarningsCalendarEvent } from "@/data/calendar/calendar.types";
import { mapCalendarImpactToTone } from "@/data/calendar/mappers";

type EarningsCalendarEventListProps = {
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  noResultsTitle?: string;
  noResultsDescription?: string;
  clearFiltersLabel?: string;
  events: EarningsCalendarEvent[];
  totalEvents?: number;
  isLoading?: boolean;
  selectedEventId?: string | null;
  reviewStockLabel: string;
  getDateLabel: (event: EarningsCalendarEvent) => string;
  getTimingLabel: (event: EarningsCalendarEvent) => string;
  getSourceLabel: (event: EarningsCalendarEvent) => string;
  getImpactLabel: (event: EarningsCalendarEvent) => string;
  onSelectEvent: (event: EarningsCalendarEvent) => void;
  onReviewStock: (symbol: string) => void;
  onClearFilters?: () => void;
};

export const EarningsCalendarEventList = ({
  title,
  emptyTitle,
  emptyDescription,
  noResultsTitle,
  noResultsDescription,
  clearFiltersLabel,
  events,
  totalEvents,
  isLoading = false,
  selectedEventId,
  reviewStockLabel,
  getDateLabel,
  getTimingLabel,
  getSourceLabel,
  getImpactLabel,
  onSelectEvent,
  onReviewStock,
  onClearFilters,
}: EarningsCalendarEventListProps) => {
  const handleEventKeyDown = (
    keyboardEvent: KeyboardEvent<HTMLDivElement>,
    event: EarningsCalendarEvent,
  ) => {
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault();
      onSelectEvent(event);
    }
  };

  const resolvedTotal = totalEvents ?? events.length;
  const isFilteredEmpty = events.length === 0 && resolvedTotal > 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingWrap>
          <SkeletonCard $bodyLines={3} />
          <SkeletonCard $bodyLines={3} />
        </LoadingWrap>
      );
    }

    if (events.length > 0) {
      return (
        <List>
          {events.map((event) => (
            <EventItem
              key={event.id}
              role="button"
              tabIndex={0}
              $selected={event.id === selectedEventId}
              onClick={() => onSelectEvent(event)}
              onKeyDown={(keyboardEvent) => handleEventKeyDown(keyboardEvent, event)}
            >
              <StockLogo
                symbol={event.symbol}
                companyName={event.companyName}
                logoUrl={event.logoUrl}
              />
              <EventCopy>
                <EventTopLine>
                  <Symbol dir="ltr">{event.symbol}</Symbol>
                  <Badge $tone={mapCalendarImpactToTone(event.impact)}>
                    {getImpactLabel(event)}
                  </Badge>
                </EventTopLine>
                <Company>{event.companyName}</Company>
                <Meta>
                  <span>{getDateLabel(event)}</span>
                  <MetaDot aria-hidden />
                  <span>{getTimingLabel(event)}</span>
                  <MetaDot aria-hidden />
                  <span>{getSourceLabel(event)}</span>
                </Meta>
              </EventCopy>
              <ReviewButton
                $variant="ghost"
                $size="sm"
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  onReviewStock(event.symbol);
                }}
              >
                {reviewStockLabel}
                <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
              </ReviewButton>
            </EventItem>
          ))}
        </List>
      );
    }

    if (isFilteredEmpty) {
      return (
        <NoResultsState
          title={noResultsTitle ?? emptyTitle}
          description={noResultsDescription ?? emptyDescription}
          clearAction={
            onClearFilters && clearFiltersLabel
              ? {
                  label: clearFiltersLabel,
                  onClick: onClearFilters,
                  variant: "secondary",
                }
              : undefined
          }
        />
      );
    }

    return (
      <EmptyState title={emptyTitle} description={emptyDescription} $compact />
    );
  };

  return (
    <ListCard>
      <ListTitle>{title}</ListTitle>
      {renderContent()}
    </ListCard>
  );
};

const ListCard = styled.section`
  display: flex;
  min-inline-size: 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: none;
  }
`;

const ListTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  text-align: start;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EventItem = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.brand.primarySoft : theme.colors.background.card};
  box-shadow: ${({ theme, $selected }) =>
    $selected ? theme.colors.shadow.soft : "none"};
  cursor: pointer;
  text-align: start;
  transition:
    border-color 0.16s ease,
    background 0.16s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: auto minmax(0, 1fr);
  }
`;

const EventCopy = styled.span`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EventTopLine = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Company = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const MetaDot = styled.span`
  inline-size: 0.25rem;
  block-size: 0.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border.strong};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const ReviewButton = styled(Button)`
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 2 / -1;
    justify-self: flex-start;
  }
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
