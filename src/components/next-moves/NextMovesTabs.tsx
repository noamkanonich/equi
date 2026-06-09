"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Filter,
  Inbox,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { NextMovesTab } from "@/data/next-moves/next-moves.types";
import { nextMoveTabs } from "@/data/next-moves/mappers";

type NextMovesTabsProps = {
  activeTab: NextMovesTab;
  counts: Record<NextMovesTab, number>;
  onTabChange: (tab: NextMovesTab) => void;
  onFilterClick?: () => void;
  isFilterActive?: boolean;
};

const tabIcons = {
  allActions: CheckCircle2,
  needsAction: AlertTriangle,
  opportunities: Sparkles,
  risks: ShieldAlert,
  earnings: CalendarDays,
  dismissed: Inbox,
};

type TabTone = "brand" | "negative" | "positive" | "warning" | "neutral";

const tabTones: Record<NextMovesTab, TabTone> = {
  allActions: "brand",
  needsAction: "negative",
  opportunities: "positive",
  risks: "warning",
  earnings: "brand",
  dismissed: "neutral",
};

export const NextMovesTabs = ({
  activeTab,
  counts,
  onTabChange,
  onFilterClick,
  isFilterActive = false,
}: NextMovesTabsProps) => {
  const t = useTranslations("nextMoves");
  const prefersReducedMotion = useReducedMotion();

  return (
    <TabsBar>
      <LayoutGroup id="next-moves-tabs">
        <TabsList aria-label={t("tabs.label")}>
          {nextMoveTabs.map((tab) => {
            const Icon = tabIcons[tab];
            const tone = tabTones[tab];
            const active = tab === activeTab;

            return (
              <TabButton
                key={tab}
                type="button"
                $active={active}
                $tone={tone}
                aria-pressed={active}
                onClick={() => onTabChange(tab)}
              >
                {active ? (
                  <ActivePill
                    $tone={tone}
                    layoutId="next-moves-active-tab"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                ) : null}
                <TabIconWrap $tone={tone} $active={active}>
                  <Icon size={15} strokeWidth={1.9} aria-hidden />
                </TabIconWrap>
                <TabLabel>{t(`tabs.${tab}`)}</TabLabel>
                <CountBadge $active={active} $tone={tone}>
                  {counts[tab]}
                </CountBadge>
              </TabButton>
            );
          })}
        </TabsList>
      </LayoutGroup>
      <FilterButton
        type="button"
        aria-label={t("filters.filter")}
        aria-pressed={isFilterActive}
        $active={isFilterActive}
        onClick={onFilterClick}
      >
        <Filter size={16} strokeWidth={1.9} aria-hidden />
        {t("filters.filter")}
      </FilterButton>
    </TabsBar>
  );
};

const TabsBar = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const TabsList = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
  overflow-x: auto;
  padding-block: ${({ theme }) => theme.spacing.xs};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const toneColorStyles = {
  brand: css`
    color: ${({ theme }) => theme.colors.brand.primary};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
  `,
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.status.neutral};
  `,
};

const toneSoftBackgroundStyles = {
  brand: css`
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
  negative: css`
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  positive: css`
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.status.neutralSoft};
  `,
};

const TabButton = styled.button<{ $active: boolean; $tone: TabTone }>`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-block-size: 2.35rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  ${({ $active, $tone }) => $active && toneColorStyles[$tone]}
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ActivePill = styled(motion.span)<{ $tone: TabTone }>`
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ $tone }) => toneColorStyles[$tone]}
  ${({ $tone }) => toneSoftBackgroundStyles[$tone]}
  box-shadow: inset 0 -2px 0 currentColor;
`;

const TabIconWrap = styled.span<{ $tone: TabTone; $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.35rem;
  block-size: 1.35rem;
  border-radius: 999px;
  ${({ $tone }) => toneColorStyles[$tone]}

  ${({ $active, $tone }) =>
    $active &&
    css`
      ${toneSoftBackgroundStyles[$tone]}
    `}
`;

const TabLabel = styled.span``;

const CountBadge = styled.span<{ $active: boolean; $tone: TabTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 1.25rem;
  block-size: 1.25rem;
  padding-inline: ${({ theme }) => theme.spacing.xs};
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  ${({ theme, $active, $tone }) =>
    $active
      ? css`
          ${toneColorStyles[$tone]}
          ${toneSoftBackgroundStyles[$tone]}
          box-shadow: inset 0 0 0 1px currentColor;
          color: currentColor;
        `
      : css`
          background: ${theme.colors.status.neutralSoft};
          color: ${theme.colors.text.secondary};
        `}
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-block-size: 2.35rem;
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
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
