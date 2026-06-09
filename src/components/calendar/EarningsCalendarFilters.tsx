"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { CalendarFilter } from "@/data/calendar/calendar.types";

type FilterOption = {
  value: CalendarFilter;
  label: string;
};

type EarningsCalendarFiltersProps = {
  label: string;
  filters: FilterOption[];
  selectedFilter: CalendarFilter;
  onFilterChange: (filter: CalendarFilter) => void;
};

export const EarningsCalendarFilters = ({
  label,
  filters,
  selectedFilter,
  onFilterChange,
}: EarningsCalendarFiltersProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <FilterBar aria-label={label}>
      {filters.map((filter) => {
        const isActive = filter.value === selectedFilter;

        return (
          <FilterButton
            key={filter.value}
            type="button"
            $active={isActive}
            aria-pressed={isActive}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
            {isActive && !prefersReducedMotion ? (
              <ActiveIndicator layoutId="earnings-calendar-filter" aria-hidden />
            ) : null}
          </FilterButton>
        );
      })}
    </FilterBar>
  );
};

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md} 0;
    border-block-end: 0;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  position: relative;
  min-block-size: 2.5rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.brand.primary : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primarySoft : theme.colors.background.card};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    color 0.16s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ActiveIndicator = styled(motion.span)`
  position: absolute;
  inset-inline: ${({ theme }) => theme.spacing.sm};
  inset-block-end: 0;
  block-size: 0.125rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.brand.primary};
`;
