"use client";

import {
  ArrowLeftRight,
  Bell,
  CalendarDays,
  DollarSign,
  PieChart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { AlertMetricKind, AlertSummaryMetric } from "@/data/alerts/alerts.types";

type AlertSummaryCardProps = {
  metric: AlertSummaryMetric;
  locale: string;
  cardIndex?: number;
};

const metricIcons: Record<AlertMetricKind, LucideIcon> = {
  activeAlerts: Bell,
  priceAlerts: DollarSign,
  earningsAlerts: CalendarDays,
  portfolioAlerts: PieChart,
  smartReplace: ArrowLeftRight,
};

export const AlertSummaryCard = ({
  metric,
  locale,
  cardIndex = 0,
}: AlertSummaryCardProps) => {
  const t = useTranslations("alerts");
  const Icon = metricIcons[metric.kind];
  const hasNew = metric.newCount !== null && metric.newCount > 0;

  const helper =
    metric.newCount === null
      ? t("metrics.noNew")
      : t("metrics.new", { count: metric.newCount });

  return (
    <Card>
      <TopRow>
        <Label>{t(`metrics.${metric.kind}`)}</Label>
        <IconWrap $kind={metric.kind}>
          <Icon size={18} strokeWidth={1.9} aria-hidden />
        </IconWrap>
      </TopRow>
      <Value>
        <AnimatedNumber
          value={metric.value}
          formatter={(value) =>
            new Intl.NumberFormat(locale).format(Math.round(value))
          }
          delay={cardIndex * 80}
        />
      </Value>
      <Helper $hasNew={hasNew}>
        {hasNew ? "↑ " : null}
        {helper}
      </Helper>
    </Card>
  );
};

const kindIconStyles = {
  activeAlerts: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
  priceAlerts: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.chart.purple} 12%,
      transparent
    );
  `,
  earningsAlerts: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  portfolioAlerts: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  smartReplace: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.chart.purple} 12%,
      transparent
    );
  `,
};

const Card = styled.article`
  block-size: 100%;
  min-block-size: 7rem;
  display: grid;
  grid-template-rows: auto auto auto;
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

const IconWrap = styled.span<{ $kind: AlertMetricKind }>`
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ $kind }) => kindIconStyles[$kind]}
`;

const Value = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.04em;
`;

const Helper = styled.span<{ $hasNew: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme, $hasNew }) =>
    $hasNew ? theme.colors.status.positive : theme.colors.text.muted};
`;
