"use client";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { reportTabs } from "@/data/reports/mappers";
import type { ReportTabKey } from "@/data/reports/reports.types";

type ReportsTabsProps = {
  activeTab: ReportTabKey;
  onTabChange: (tab: ReportTabKey) => void;
};

export const ReportsTabs = ({ activeTab, onTabChange }: ReportsTabsProps) => {
  const t = useTranslations("reports.tabs");
  const prefersReducedMotion = useReducedMotion();

  return (
    <TabsBar>
      <LayoutGroup id="reports-tabs">
        <TabsList aria-label={t("label")}>
          {reportTabs.map((tab) => {
            const active = tab === activeTab;

            return (
              <TabButton
                key={tab}
                type="button"
                $active={active}
                aria-pressed={active}
                onClick={() => onTabChange(tab)}
              >
                <TabLabel>{t(tab)}</TabLabel>
                {active ? (
                  <ActiveUnderline
                    layoutId="reports-active-tab-underline"
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
    </TabsBar>
  );
};

const TabsBar = styled.div`
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding-block-end: ${({ theme }) => theme.spacing.sm};
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

const ActiveUnderline = styled(motion.span)`
  position: absolute;
  inset-inline: ${({ theme }) => theme.spacing.md};
  inset-block-end: -${({ theme }) => theme.spacing.sm};
  block-size: 2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.brand.primary};
`;
