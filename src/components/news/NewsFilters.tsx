"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { newsFilterKeys } from "@/data/news/mappers";
import type { NewsFilterKey, NewsSortKey } from "@/data/news/news.types";

type NewsFiltersProps = {
  activeFilter: NewsFilterKey;
  sortKey: NewsSortKey;
  onFilterChange: (filter: NewsFilterKey) => void;
  onSortChange: (sort: NewsSortKey) => void;
};

const sortOptions: NewsSortKey[] = ["newest", "relevant"];

export const NewsFilters = ({
  activeFilter,
  sortKey,
  onFilterChange,
  onSortChange,
}: NewsFiltersProps) => {
  const t = useTranslations("news");
  const prefersReducedMotion = useReducedMotion();

  return (
    <Bar>
      <FilterBar aria-label={t("filters.label")}>
        {newsFilterKeys.map((filterKey) => {
          const isActive = filterKey === activeFilter;

          return (
            <FilterButton
              key={filterKey}
              type="button"
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => onFilterChange(filterKey)}
            >
              {t(`filters.${filterKey}`)}
              {isActive && !prefersReducedMotion ? (
                <ActiveIndicator layoutId="news-active-filter" aria-hidden />
              ) : null}
            </FilterButton>
          );
        })}
      </FilterBar>
      <SortWrap>
        {sortOptions.map((option) => {
          const isActive = sortKey === option;
          return (
            <SortButton
              key={option}
              type="button"
              $active={isActive}
              aria-pressed={isActive}
              onClick={() => onSortChange(option)}
            >
              {t(`sort.${option}`)}
            </SortButton>
          );
        })}
      </SortWrap>
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  scrollbar-width: none;
  min-inline-size: 0;
  flex: 1;
  padding-block-end: ${({ theme }) => theme.spacing.xs};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  position: relative;
  min-block-size: 2.25rem;
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
  white-space: nowrap;
  flex-shrink: 0;
`;

const ActiveIndicator = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid ${({ theme }) => theme.colors.brand.primary};
  pointer-events: none;
`;

const SortWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
  ${({ theme, $active }) =>
    $active
      ? css`
          background: ${theme.colors.background.card};
          color: ${theme.colors.brand.primary};
          box-shadow: ${theme.colors.shadow.soft};
        `
      : css`
          background: transparent;
          color: ${theme.colors.text.secondary};
        `}
`;
