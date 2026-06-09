"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type {
  AlertQuickFilter,
  AlertQuickFilterKey,
  AlertTone,
} from "@/data/alerts/alerts.types";

type AlertQuickFiltersCardProps = {
  filters: AlertQuickFilter[];
  activeFilterKey: AlertQuickFilterKey | null;
  onFilterClick: (key: AlertQuickFilterKey) => void;
  onClearFilters: () => void;
};

const toneDotStyles = {
  positive: css`
    background: ${({ theme }) => theme.colors.status.positive};
  `,
  negative: css`
    background: ${({ theme }) => theme.colors.status.negative};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.status.warning};
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.brand.primary};
  `,
};

export const AlertQuickFiltersCard = ({
  filters,
  activeFilterKey,
  onFilterClick,
  onClearFilters,
}: AlertQuickFiltersCardProps) => {
  const t = useTranslations("alerts");

  return (
    <Card>
      <Title>{t("sidebar.quickFilters")}</Title>
      <FilterList>
        {filters.map((filter) => {
          const active = activeFilterKey === filter.key;
          return (
            <FilterButton
              key={filter.key}
              type="button"
              $active={active}
              onClick={() => onFilterClick(filter.key)}
            >
              <FilterDot $tone={filter.tone} aria-hidden />
              <FilterLabel>{t(`sidebar.${filter.key}`)}</FilterLabel>
              <CountBadge $active={active}>{filter.count}</CountBadge>
            </FilterButton>
          );
        })}
      </FilterList>
      <ClearButton type="button" onClick={onClearFilters}>
        {t("sidebar.clearFilters")}
      </ClearButton>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.shadow.card};
  }
`;

const Title = styled.h2`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primarySoft : "transparent"};
  cursor: pointer;
  text-align: start;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.elevated};
    transform: translateY(-1px);
  }

  ${({ theme, $active }) =>
    $active &&
    css`
      border-color: color-mix(in srgb, ${theme.colors.brand.primary} 20%, transparent);
    `}
`;

const FilterDot = styled.span<{ $tone: AlertTone }>`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
  ${({ $tone }) => toneDotStyles[$tone]}
`;

const FilterLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const CountBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 1.5rem;
  padding-inline: ${({ theme }) => theme.spacing.xs};
  block-size: 1.375rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.muted};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.background.card : theme.colors.background.elevated};
`;

const ClearButton = styled.button`
  margin-block-start: ${({ theme }) => theme.spacing.md};
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;
