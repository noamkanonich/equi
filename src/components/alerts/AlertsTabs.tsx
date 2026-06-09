"use client";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { AlertSortOption, AlertTab } from "@/data/alerts/alerts.types";
import { alertTabs } from "@/data/alerts/mappers";

type AlertsTabsProps = {
  activeTab: AlertTab;
  counts: Record<AlertTab, number>;
  sort: AlertSortOption;
  onTabChange: (tab: AlertTab) => void;
  onSortChange: (sort: AlertSortOption) => void;
};

const sortOptions: AlertSortOption[] = ["newest", "oldest", "priority"];

export const AlertsTabs = ({
  activeTab,
  counts,
  sort,
  onTabChange,
  onSortChange,
}: AlertsTabsProps) => {
  const t = useTranslations("alerts");
  const prefersReducedMotion = useReducedMotion();

  return (
    <Bar>
      <LayoutGroup id="alerts-tabs">
        <TabsList aria-label={t("tabs.label")}>
          {alertTabs.map((tab) => {
            const active = tab === activeTab;
            return (
              <TabButton
                key={tab}
                type="button"
                $active={active}
                aria-pressed={active}
                onClick={() => onTabChange(tab)}
              >
                <TabLabel>{t(`tabs.${tab}`)}</TabLabel>
                <CountBadge $active={active}>{counts[tab]}</CountBadge>
                {active ? (
                  <ActiveUnderline
                    layoutId="alerts-active-tab-underline"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                ) : null}
              </TabButton>
            );
          })}
        </TabsList>
      </LayoutGroup>
      <SortWrap>
        <SortLabel htmlFor="alerts-sort">{t("sort.sortBy")}</SortLabel>
        <SortSelect
          id="alerts-sort"
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as AlertSortOption)
          }
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {t(`sort.${option}`)}
            </option>
          ))}
        </SortSelect>
      </SortWrap>
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding-block-end: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TabsList = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  scrollbar-width: none;
  min-inline-size: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const TabLabel = styled.span``;

const CountBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 1.375rem;
  padding-inline: ${({ theme }) => theme.spacing.xs};
  block-size: 1.25rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: 1;
  ${({ theme, $active }) =>
    $active
      ? css`
          color: ${theme.colors.brand.primary};
          background: ${theme.colors.brand.primarySoft};
        `
      : css`
          color: ${theme.colors.text.muted};
          background: ${theme.colors.background.elevated};
        `}
`;

const ActiveUnderline = styled(motion.span)`
  position: absolute;
  inset-inline: ${({ theme }) => theme.spacing.md};
  inset-block-end: -${({ theme }) => theme.spacing.sm};
  block-size: 2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.brand.primary};
`;

const SortWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    justify-content: flex-end;
  }
`;

const SortLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;
`;

const SortSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primarySoft};
    outline-offset: 2px;
  }
`;
