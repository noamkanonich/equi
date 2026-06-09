"use client";

import {
  CheckCircle2,
  GitCompare,
  HelpCircle,
  ListTree,
  RefreshCw,
  Save,
} from "lucide-react";
import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { scoringQuickActions } from "@/data/settings/settings.mock";
import type { ScoringQuickActionKey } from "@/data/settings/settings.types";
import { SettingsInfoBox } from "./SettingsInfoBox";

type ScoringModelQuickActionsCardProps = {
  onCompareRecommended: () => void;
  onResetRecommended: () => void;
  onSaveCustomModel: () => void;
  onHowScoringWorks: () => void;
  onViewFactorDefinitions: () => void;
  showSavedCustomFeedback?: boolean;
};

const actionIcons: Record<ScoringQuickActionKey, typeof RefreshCw> = {
  compareRecommended: GitCompare,
  resetRecommended: RefreshCw,
  saveCustomModel: Save,
  howScoringWorks: HelpCircle,
  viewFactorDefinitions: ListTree,
};

export const ScoringModelQuickActionsCard = ({
  onCompareRecommended,
  onResetRecommended,
  onSaveCustomModel,
  onHowScoringWorks,
  onViewFactorDefinitions,
  showSavedCustomFeedback = false,
}: ScoringModelQuickActionsCardProps) => {
  const t = useTranslations("settings.scoringModel.quickActions");

  const handlers: Record<ScoringQuickActionKey, () => void> = {
    compareRecommended: onCompareRecommended,
    resetRecommended: onResetRecommended,
    saveCustomModel: onSaveCustomModel,
    howScoringWorks: onHowScoringWorks,
    viewFactorDefinitions: onViewFactorDefinitions,
  };

  return (
    <StyledCard $padding="md">
      <Title>{t("title")}</Title>
      {showSavedCustomFeedback ? (
        <SettingsInfoBox variant="positive" icon={CheckCircle2}>
          {t("savedCustomModel")}
        </SettingsInfoBox>
      ) : null}
      <List>
        {scoringQuickActions.map((action) => {
          const Icon = actionIcons[action.key];
          return (
            <ActionRow
              key={action.key}
              type="button"
              onClick={handlers[action.key]}
            >
              <RowStart>
                <IconWrap aria-hidden>
                  <Icon size={16} strokeWidth={1.9} />
                </IconWrap>
                <Label>{t(action.key)}</Label>
              </RowStart>
              <DirectionalChevron />
            </ActionRow>
          );
        })}
      </List>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  text-align: start;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  svg:last-child {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text.muted};

    [dir="rtl"] & {
      transform: scaleX(-1);
    }
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const RowStart = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
