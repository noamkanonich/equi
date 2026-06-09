"use client";

import {
  CircleDollarSign,
  Landmark,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import styled, { css } from "styled-components";
import { MiniSparklineChart } from "@/components/charts/MiniSparklineChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { ReportMetricCard as ReportMetricCardData } from "@/data/reports/reports.types";
import { useAppStore } from "@/store/app.store";
import { convertCurrency } from "@/utils/currencies/convertCurrency";
import { formatMoney } from "@/utils/currencies/formatMoney";
import { formatPercent } from "@/utils/formatting/formatPercent";

const metricIcons = {
  portfolioValue: Wallet,
  totalGainLoss: TrendingUp,
  annualReturn: Trophy,
  unrealizedGain: CircleDollarSign,
  cashBalance: Landmark,
};

type ReportMetricCardProps = {
  metric: ReportMetricCardData;
  locale: string;
  cardIndex?: number;
};

export const ReportMetricCard = ({
  metric,
  locale,
  cardIndex = 0,
}: ReportMetricCardProps) => {
  const t = useTranslations("reports.metrics");
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);
  const Icon = metricIcons[metric.kind];

  const isPercentPrimary =
    metric.kind === "annualReturn" && metric.secondaryKind === "percent";

  const convertedValue = convertCurrency({
    amount: metric.value,
    fromCurrency: metric.currency,
    toCurrency: displayCurrency,
    fxRates,
  });

  const formatConverted = useCallback(
    (value: number) => formatMoney(value, displayCurrency, { locale }),
    [displayCurrency, locale],
  );

  const sublabel = metric.sublabelParams
    ? t(metric.sublabelKey, metric.sublabelParams)
    : t(metric.sublabelKey);

  return (
    <Card $tone={metric.tone}>
      <TopRow>
        <IconWrap $tone={metric.tone} aria-hidden>
          <Icon size={18} strokeWidth={1.9} />
        </IconWrap>
        <Label>{t(metric.kind)}</Label>
      </TopRow>
      <ValueRow>
        {isPercentPrimary ? (
          <Value $tone={metric.tone}>
            {formatPercent(metric.value, { locale })}
          </Value>
        ) : (
          <AnimatedNumber
            value={convertedValue}
            formatter={formatConverted}
            delay={cardIndex * 70}
          />
        )}
        {metric.secondaryValue !== undefined && metric.secondaryKind === "percent" ? (
          <Secondary $tone={metric.tone}>
            {formatPercent(metric.secondaryValue, { locale, showSign: true })}
          </Secondary>
        ) : null}
      </ValueRow>
      <Sublabel>{sublabel}</Sublabel>
      {metric.trend.length > 1 ? (
        <SparkWrap>
          <MiniSparklineChart
            data={metric.trend}
            variant={metric.tone === "neutral" ? "neutral" : metric.tone}
            height={34}
          />
        </SparkWrap>
      ) : null}
    </Card>
  );
};

const Card = styled.article<{ $tone: "positive" | "negative" | "neutral" }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span<{ $tone: "positive" | "negative" | "neutral" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ theme, $tone }) =>
    $tone === "positive"
      ? css`
          color: ${theme.colors.status.positive};
          background: ${theme.colors.status.positiveSoft};
        `
      : $tone === "negative"
        ? css`
            color: ${theme.colors.status.negative};
            background: ${theme.colors.status.negativeSoft};
          `
        : css`
            color: ${theme.colors.text.muted};
            background: ${theme.colors.background.elevated};
          `}
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Value = styled.span<{ $tone: "positive" | "negative" | "neutral" }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  ${({ theme, $tone }) =>
    $tone === "positive"
      ? css`color: ${theme.colors.status.positive};`
      : $tone === "negative"
        ? css`color: ${theme.colors.status.negative};`
        : ""}
`;

const Secondary = styled.span<{ $tone: "positive" | "negative" | "neutral" }>`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  ${({ theme, $tone }) =>
    $tone === "positive"
      ? css`color: ${theme.colors.status.positive};`
      : $tone === "negative"
        ? css`color: ${theme.colors.status.negative};`
        : css`color: ${theme.colors.text.secondary};`}
`;

const Sublabel = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const SparkWrap = styled.div`
  margin-block-start: auto;
  block-size: 2rem;
`;
