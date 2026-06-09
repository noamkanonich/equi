"use client";

import {
  Bell,
  PieChart,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { Card } from "@/components/ui/Card";
import { settingsSummaryItems } from "@/data/settings/settings.mock";
import type {
  AiPreferencesState,
  AlertSettingsState,
  PortfolioSettingsState,
  ScoringModelSettingsState,
  SettingsSummaryIconAccent,
  SettingsSummaryItemKey,
  SettingsTabKey,
} from "@/data/settings/settings.types";
import {
  getSettingsSummaryDisplayKey,
  getSettingsSummaryTabForKey,
} from "@/utils/settings/getSettingsSummaryDisplayKey";

type SettingsSummaryCardProps = {
  portfolio: PortfolioSettingsState;
  scoringModel: ScoringModelSettingsState;
  alerts: AlertSettingsState;
  aiPreferences: AiPreferencesState;
  onNavigateTab: (tab: SettingsTabKey) => void;
};

const summaryIcons: Record<SettingsSummaryItemKey, typeof UserRound> = {
  riskProfile: UserRound,
  targetAllocation: PieChart,
  scoringModel: Target,
  alerts: Bell,
  aiInsights: Sparkles,
};

const accentStyles: Record<SettingsSummaryIconAccent, ReturnType<typeof css>> = {
  primary: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 12%,
      transparent
    );
  `,
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.status.positive} 12%,
      transparent
    );
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.status.warning} 12%,
      transparent
    );
  `,
  purple: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: ${({ theme }) => theme.colors.chart.sparklineFill.purple};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.chart.purple} 12%,
      transparent
    );
  `,
  accentAi: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: ${({ theme }) => theme.colors.chart.sparklineFill.purple};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.chart.purple} 18%,
      transparent
    );
  `,
};

export const SettingsSummaryCard = ({
  portfolio,
  scoringModel,
  alerts,
  aiPreferences,
  onNavigateTab,
}: SettingsSummaryCardProps) => {
  const t = useTranslations("settings.summary");
  const tPortfolio = useTranslations("settings.portfolio.summary");
  const tAi = useTranslations("settings.aiPreferences.summary");

  const sources = { portfolio, scoringModel, alerts, aiPreferences };

  const formatValue = (key: SettingsSummaryItemKey) => {
    const valueKey = getSettingsSummaryDisplayKey(key, sources);

    if (key === "riskProfile" || key === "targetAllocation") {
      return tPortfolio(`values.${valueKey}` as "values.moderate");
    }

    if (key === "scoringModel") {
      return t(valueKey as "recommended");
    }

    if (key === "alerts") {
      return t(valueKey as "enabled");
    }

    return tAi(valueKey as "concise");
  };

  return (
    <StyledCard $padding="md">
      <Header>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
      </Header>
      <List>
        {settingsSummaryItems.map((item) => {
          const Icon = summaryIcons[item.key];
          const targetTab = getSettingsSummaryTabForKey(item.key);

          return (
            <SummaryRow
              key={item.key}
              type="button"
              onClick={() => onNavigateTab(targetTab)}
            >
              <RowStart>
                <IconWrap $accent={item.iconAccent} aria-hidden>
                  <Icon size={16} strokeWidth={1.9} />
                </IconWrap>
                <Copy>
                  <Label>{t(item.key)}</Label>
                  <Value>{formatValue(item.key)}</Value>
                </Copy>
              </RowStart>
              <DirectionalChevron />
            </SummaryRow>
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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SummaryRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  cursor: pointer;
  text-align: start;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  & > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text.muted};

    [dir="rtl"] & {
      transform: scaleX(-1);
    }
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.subtle};
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

const IconWrap = styled.span<{ $accent: SettingsSummaryIconAccent }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  ${({ $accent }) => accentStyles[$accent]}

  svg {
    color: inherit;
    flex-shrink: 0;
  }
`;

const Copy = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
