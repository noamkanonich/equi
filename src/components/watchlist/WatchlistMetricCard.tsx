"use client";

import {
  Bell,
  Binoculars,
  CalendarDays,
  Gauge,
  Target,
} from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { LucideIcon } from "lucide-react";
import { MiniSparklineChart } from "@/components/charts/MiniSparklineChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type {
  WatchlistMetric,
  WatchlistMetricKind,
} from "@/data/watchlist/watchlist.types";

type WatchlistMetricCardProps = {
  metric: WatchlistMetric;
  locale: string;
  cardIndex?: number;
};

const metricIcons: Record<WatchlistMetricKind, LucideIcon> = {
  watchedStocks: Binoculars,
  averageOpportunityScore: Gauge,
  inBuyZone: Target,
  upcomingEarnings: CalendarDays,
  alertsTriggered: Bell,
};

export const WatchlistMetricCard = ({
  metric,
  locale,
  cardIndex = 0,
}: WatchlistMetricCardProps) => {
  const t = useTranslations("watchlist");
  const Icon = metricIcons[metric.kind];
  const helper = metric.helperValue
    ? `${metric.helperValue} ${t(metric.helperKey)}`
    : t(metric.helperKey);

  return (
    <Card>
      <TopLine>
        <IconWrap $tone={metric.tone}>
          <Icon size={18} strokeWidth={1.8} aria-hidden />
        </IconWrap>
        <Label>{t(`metrics.${metric.kind}`)}</Label>
      </TopLine>
      <Body>
        <Value>
          <AnimatedNumber
            value={metric.value}
            formatter={(value) =>
              new Intl.NumberFormat(locale).format(Math.round(value))
            }
            delay={cardIndex * 80}
          />
        </Value>
        <Helper $tone={metric.tone}>{helper}</Helper>
      </Body>
      <ChartWrap>
        <MiniSparklineChart
          data={metric.trend}
          variant={metric.tone}
          height={42}
          ariaLabel={t(`metrics.${metric.kind}`)}
        />
      </ChartWrap>
    </Card>
  );
};

const toneColorStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
};

const Card = styled.article`
  block-size: 100%;
  min-block-size: 9rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  overflow: hidden;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-0.125rem);
    border-color: ${({ theme }) => theme.colors.border.strong};
    box-shadow: ${({ theme }) => theme.colors.shadow.card};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-block-size: 8.25rem;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const TopLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span<{ $tone: WatchlistMetric["tone"] }>`
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${({ $tone }) => toneColorStyles[$tone]}
`;

const Label = styled.span`
  min-inline-size: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Value = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  letter-spacing: -0.04em;
`;

const Helper = styled.span<{ $tone: WatchlistMetric["tone"] }>`
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "negative"
        ? theme.colors.status.negative
        : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
`;

const ChartWrap = styled.div`
  min-inline-size: 0;
`;
