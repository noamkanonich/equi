"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { StockAnalysisTabKey } from "@/data/stocks/stock-analysis.types";

type StockTabsProps = {
  activeTab: StockAnalysisTabKey;
  onTabChange: (tab: StockAnalysisTabKey) => void;
};

const TAB_KEYS: StockAnalysisTabKey[] = ["overview", "fundamentals", "news", "notes"];

export const StockTabs = ({ activeTab, onTabChange }: StockTabsProps) => {
  const t = useTranslations("stockAnalysis");

  return (
    <Nav role="tablist" aria-label={t("tabs.overview")}>
      {TAB_KEYS.map((tab) => (
        <TabButton
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          $active={activeTab === tab}
          onClick={() => onTabChange(tab)}
          type="button"
        >
          {t(`tabs.${tab}`)}
          {activeTab === tab && (
            <ActiveUnderline layoutId="stock-tab-underline" />
          )}
        </TabButton>
      ))}
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  border-block-end: 2px solid ${({ theme }) => theme.colors.border.subtle};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  padding-block: ${({ theme }) => theme.spacing.sm};
  padding-inline: ${({ theme }) => theme.spacing.md};
  border: 0;
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  cursor: pointer;
  scroll-snap-align: start;
  transition: color 200ms ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: -2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

const ActiveUnderline = styled(motion.span)`
  position: absolute;
  inset-inline-start: 0;
  inset-inline-end: 0;
  inset-block-end: -2px;
  block-size: 2px;
  background: ${({ theme }) => theme.colors.brand.primary};
  border-radius: 1px 1px 0 0;
`;
