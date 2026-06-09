"use client";

import {
  PieChart,
  RefreshCw,
  Shield,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { Card } from "@/components/ui/Card";
import { portfolioSummaryItems } from "@/data/settings/settings.mock";
import type {
  PortfolioSettingsState,
  PortfolioSummaryItemKey,
} from "@/data/settings/settings.types";
import {
  getPortfolioSummaryValueKey,
  isPortfolioSummaryPercentKey,
} from "@/utils/settings/getPortfolioSummaryValueKey";

import type { SettingsCardAccent } from "./SettingsCard";

type PortfolioSettingsSummaryCardProps = {
  settings: PortfolioSettingsState;
};

const summaryIcons: Record<PortfolioSummaryItemKey, typeof Shield> = {
  riskProfile: Shield,
  targetAllocation: Target,
  benchmark: TrendingUp,
  maxSectorExposure: PieChart,
  maxSingleStockExposure: UserRound,
  rebalancingThreshold: RefreshCw,
};

const summaryIconAccents: Record<PortfolioSummaryItemKey, SettingsCardAccent> = {
  riskProfile: "positive",
  targetAllocation: "primary",
  benchmark: "primary",
  maxSectorExposure: "purple",
  maxSingleStockExposure: "purple",
  rebalancingThreshold: "positive",
};

export const PortfolioSettingsSummaryCard = ({
  settings,
}: PortfolioSettingsSummaryCardProps) => {
  const t = useTranslations("settings.portfolio.summary");
  const tPortfolio = useTranslations("settings.portfolio");

  const formatValue = (key: PortfolioSummaryItemKey) => {
    if (isPortfolioSummaryPercentKey(key)) {
      return t("percentValue", {
        value: getPortfolioSummaryValueKey(key, settings),
      });
    }

    if (key === "benchmark") {
      return tPortfolio(
        `benchmark.${settings.benchmark}` as "benchmark.sp500",
      );
    }

    const valueKey = getPortfolioSummaryValueKey(key, settings);
    return t(`values.${valueKey}` as "values.moderate");
  };

  return (
    <StyledCard $padding="md">
      <Header>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
      </Header>
      <List>
        {portfolioSummaryItems.map((item) => {
          const Icon = summaryIcons[item.key];
          const accent = summaryIconAccents[item.key];

          return (
            <SummaryRow key={item.key}>
              <RowStart>
                <IconWrap $accent={accent} aria-hidden>
                  <Icon size={16} strokeWidth={1.9} />
                </IconWrap>
                <Copy>
                  <Label>{t(`labels.${item.key}`)}</Label>
                  <Value>{formatValue(item.key)}</Value>
                </Copy>
              </RowStart>
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

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const RowStart = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const summaryAccentStyles = {
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
};

const IconWrap = styled.span<{ $accent: SettingsCardAccent }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  ${({ $accent }) => summaryAccentStyles[$accent]}

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
