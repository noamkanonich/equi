"use client";

import {
  BookOpen,
  Eye,
  RefreshCw,
  Shield,
} from "lucide-react";
import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { aiPreferencesQuickActions } from "@/data/settings/settings.mock";
import type { AiPreferencesQuickActionKey } from "@/data/settings/settings.types";

type AiPreferencesQuickActionsCardProps = {
  onReset: () => void;
  onPreview: () => void;
  onSafetyRules: () => void;
  onConfidenceScores: () => void;
};

const actionIcons: Record<AiPreferencesQuickActionKey, typeof BookOpen> = {
  resetAiPreferences: RefreshCw,
  previewAiResponse: Eye,
  viewAiSafetyRules: Shield,
  explainConfidenceScores: BookOpen,
};

export const AiPreferencesQuickActionsCard = ({
  onReset,
  onPreview,
  onSafetyRules,
  onConfidenceScores,
}: AiPreferencesQuickActionsCardProps) => {
  const t = useTranslations("settings.aiPreferences.quickActions");

  const handleAction = (key: AiPreferencesQuickActionKey) => {
    if (key === "resetAiPreferences") {
      onReset();
      return;
    }

    if (key === "previewAiResponse") {
      onPreview();
      return;
    }

    if (key === "viewAiSafetyRules") {
      onSafetyRules();
      return;
    }

    onConfidenceScores();
  };

  return (
    <StyledCard $padding="md">
      <Title>{t("title")}</Title>
      <List>
        {aiPreferencesQuickActions.map((action) => {
          const Icon = actionIcons[action.key];

          return (
            <ActionRow
              key={action.key}
              type="button"
              onClick={() => handleAction(action.key)}
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
