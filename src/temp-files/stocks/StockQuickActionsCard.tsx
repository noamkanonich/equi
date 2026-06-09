"use client";

import {
  BarChart3,
  Bell,
  FileText,
  GitCompare,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { StockQuickActionKind } from "@/data/stocks/stock-analysis.types";

const ACTION_ICONS: Record<
  StockQuickActionKind,
  React.ComponentType<{ size?: number; strokeWidth?: number }>
> = {
  setPriceAlert: Bell,
  addNote: FileText,
  compareCompetitors: GitCompare,
  viewSecFilings: BarChart3,
  optionsChain: TrendingUp,
};

const ACTION_KEYS: StockQuickActionKind[] = [
  "setPriceAlert",
  "addNote",
  "compareCompetitors",
  "viewSecFilings",
  "optionsChain",
];

export const StockQuickActionsCard = () => {
  const t = useTranslations("stockAnalysis");

  return (
    <Card>
      <Header>
        <Title>{t("quickActions.title")}</Title>
        <EditButton type="button">{t("quickActions.edit")}</EditButton>
      </Header>
      <ActionList>
        {ACTION_KEYS.map((action) => {
          const Icon = ACTION_ICONS[action];
          return (
            <ActionItem key={action} type="button">
              <IconWrap aria-hidden>
                <Icon size={16} strokeWidth={1.8} />
              </IconWrap>
              {t(`actions.${action}`)}
            </ActionItem>
          );
        })}
      </ActionList>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const EditButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  text-align: start;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }
`;

const IconWrap = styled.span`
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;
