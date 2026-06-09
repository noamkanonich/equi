"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { ReportPeriodKey } from "@/data/reports/reports.types";
import { reportPeriods } from "@/data/reports/mappers";

type ReportsPeriodFilterProps = {
  period: ReportPeriodKey;
  onPeriodChange: (period: ReportPeriodKey) => void;
};

export const ReportsPeriodFilter = ({
  period,
  onPeriodChange,
}: ReportsPeriodFilterProps) => {
  const t = useTranslations("reports.period");
  const prefersReducedMotion = useReducedMotion();

  return (
    <FilterBar aria-label={t("label")}>
      {reportPeriods.map((key) => {
        const isActive = key === period;

        return (
          <FilterButton
            key={key}
            type="button"
            $active={isActive}
            aria-pressed={isActive}
            onClick={() => onPeriodChange(key)}
          >
            {t(key)}
            {isActive && !prefersReducedMotion ? (
              <ActiveIndicator layoutId="reports-period-filter" aria-hidden />
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
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  scrollbar-width: none;
  flex-wrap: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  min-block-size: 2.25rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.brand.primary : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primarySoft : theme.colors.background.card};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const ActiveIndicator = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid ${({ theme }) => theme.colors.brand.primary};
  pointer-events: none;
`;
