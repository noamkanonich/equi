"use client";

import {
  BarChart3,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { LucideIcon } from "lucide-react";
import { MiniSparklineChart } from "@/components/charts/MiniSparklineChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type {
  SmartReplaceSummaryMetric,
  SmartReplaceSummaryMetricKind,
  SmartReplaceTone,
} from "@/data/smart-replace/smart-replace.types";
import { getSmartReplaceTranslationKey } from "@/utils/smart-replace/getSmartReplaceTranslationKey";

type SmartReplaceMetricCardProps = {
  metric: SmartReplaceSummaryMetric;
  locale: string;
  cardIndex: number;
  replayKey: number;
};

const metricIcons: Record<SmartReplaceSummaryMetricKind, LucideIcon> = {
  positionsToReview: ShieldAlert,
  bestReplacementMatches: CheckCircle2,
  potentialScoreImprovement: TrendingUp,
  estimatedUpsideDifference: BarChart3,
};

export const SmartReplaceMetricCard = ({
  metric,
  locale,
  cardIndex,
  replayKey,
}: SmartReplaceMetricCardProps) => {
  const t = useTranslations("smartReplace");
  const Icon = metricIcons[metric.kind];
  const hasTrend = metric.trend.length > 0;

  const formatter = (value: number) => {
    if (metric.unit === "points") return `+${Math.round(value)} ${t("units.points")}`;
    if (metric.unit === "percent") {
      return new Intl.NumberFormat(locale, {
        signDisplay: "always",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value) + "%";
    }
    return new Intl.NumberFormat(locale).format(Math.round(value));
  };

  return (
    <Card>
      <TopRow>
        <Label>{t(`metrics.${metric.kind}`)}</Label>
        <IconWrap $tone={metric.tone}>
          <Icon size={18} strokeWidth={1.9} aria-hidden />
        </IconWrap>
      </TopRow>
      <Value $tone={metric.tone}>
        <AnimatedNumber
          value={metric.value}
          formatter={formatter}
          decimals={metric.unit === "percent" ? 1 : 0}
          delay={cardIndex * 70}
          replayKey={replayKey}
        />
      </Value>
      <Helper>{t(getSmartReplaceTranslationKey(metric.helperKey))}</Helper>
      {hasTrend ? (
        <SparklineWrap>
          <MiniSparklineChart
            data={metric.trend}
            variant={metric.tone === "negative" ? "negative" : "positive"}
            height={34}
            ariaLabel={t(`metrics.${metric.kind}`)}
          />
        </SparklineWrap>
      ) : null}
    </Card>
  );
};

const toneTextStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.brand.primary};
  `,
};

const toneIconStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
};

const Card = styled.article`
  min-block-size: 8.75rem;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  overflow: hidden;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-0.125rem);
    border-color: ${({ theme }) => theme.colors.border.strong};
    box-shadow: ${({ theme }) => theme.colors.shadow.card};
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const IconWrap = styled.span<{ $tone: SmartReplaceTone }>`
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ $tone }) => toneIconStyles[$tone]}
`;

const Value = styled.strong<{ $tone: SmartReplaceTone }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.04em;
  ${({ $tone }) => toneTextStyles[$tone]}
`;

const Helper = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const SparklineWrap = styled.div`
  align-self: end;
  min-inline-size: 0;
`;
