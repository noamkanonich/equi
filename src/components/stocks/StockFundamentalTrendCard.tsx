"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import styled, { type DefaultTheme } from "styled-components";
import type {
  FundamentalTrendMetric,
  FundamentalTrendMetricKind,
  FundamentalTrendStatus,
} from "@/data/stocks/stock-analysis.types";
import { createChartTooltipRenderer } from "@/components/charts/ChartTooltip";

type StockFundamentalTrendCardProps = {
  metric: FundamentalTrendMetric;
};

export const StockFundamentalTrendCard = ({ metric }: StockFundamentalTrendCardProps) => {
  const t = useTranslations("stockAnalysis");
  const prefersReducedMotion = useReducedMotion();

  const chartData = metric.data.map((point) => ({
    year: point.year,
    value: point.value,
  }));

  const unitLabel = t(`fundamentals.units.${metric.unitKey}`);
  const metricLabel = t(`fundamentals.metrics.${metric.kind}`);

  const tooltipRenderer = createChartTooltipRenderer(({ payload, label }) => {
    const entry = payload?.[0];
    if (!entry) return null;
    return [
      {
        label: String(label ?? ""),
        value: `${entry.value} ${unitLabel}`,
      },
    ];
  });

  return (
    <Card $metricKind={metric.kind}>
      <CardHeader>
        <MetricTitle>{metricLabel}</MetricTitle>
        <StatusBadge $status={metric.status}>
          {t(`fundamentals.status.${metric.status}`)}
        </StatusBadge>
      </CardHeader>

      <UnitLabel>{unitLabel}</UnitLabel>

      <ChartArea>
        {metric.chartType === "bar" ? (
          <BarChartWrapper
            data={chartData}
            prefersReducedMotion={!!prefersReducedMotion}
            tooltipRenderer={tooltipRenderer}
          />
        ) : (
          <LineChartWrapper
            data={chartData}
            gradientId={`fundamental-trend-${metric.kind}`}
            prefersReducedMotion={!!prefersReducedMotion}
            tooltipRenderer={tooltipRenderer}
          />
        )}
      </ChartArea>

      <InsightText>{t(metric.insightKey)}</InsightText>
    </Card>
  );
};

type ChartDataPoint = { year: string; value: number };
type TooltipRenderer = ReturnType<typeof createChartTooltipRenderer>;

const BarChartWrapper = ({
  data,
  prefersReducedMotion,
  tooltipRenderer,
}: {
  data: ChartDataPoint[];
  prefersReducedMotion: boolean;
  tooltipRenderer: TooltipRenderer;
}) => (
  <ResponsiveContainer width="100%" height={176}>
    <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
      <XAxis
        dataKey="year"
        tick={{ fontSize: 10 }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip content={tooltipRenderer} />
      <Bar
        dataKey="value"
        fill="var(--chart-color)"
        radius={[4, 4, 0, 0]}
        isAnimationActive={!prefersReducedMotion}
      />
    </BarChart>
  </ResponsiveContainer>
);

const LineChartWrapper = ({
  data,
  gradientId,
  prefersReducedMotion,
  tooltipRenderer,
}: {
  data: ChartDataPoint[];
  gradientId: string;
  prefersReducedMotion: boolean;
  tooltipRenderer: TooltipRenderer;
}) => (
  <ResponsiveContainer width="100%" height={176}>
    <AreaChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-color)" stopOpacity={0.24} />
          <stop offset="72%" stopColor="var(--chart-color)" stopOpacity={0.08} />
          <stop offset="100%" stopColor="var(--chart-color)" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey="year"
        tick={{ fontSize: 10 }}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip content={tooltipRenderer} />
      <Area
        type="monotone"
        dataKey="value"
        stroke="var(--chart-color)"
        strokeWidth={2.5}
        fill={`url(#${gradientId})`}
        dot={false}
        isAnimationActive={!prefersReducedMotion}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const metricChartColor = ({
  $metricKind,
  theme,
}: {
  $metricKind: FundamentalTrendMetricKind;
  theme: DefaultTheme;
}) => {
  if ($metricKind === "revenue") return theme.colors.chart.blue;
  if ($metricKind === "grossProfit") return theme.colors.chart.green;
  if ($metricKind === "operatingIncome") return theme.colors.chart.purple;
  if ($metricKind === "epsDiluted") return theme.colors.chart.cyan;
  if ($metricKind === "freeCashFlow") return theme.colors.chart.amber;
  return theme.colors.status.positive;
};

const Card = styled.div<{ $metricKind: FundamentalTrendMetricKind }>`
  --chart-color: ${metricChartColor};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MetricTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const StatusBadge = styled.span<{ $status: FundamentalTrendStatus }>`
  padding: 0.125rem ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  white-space: nowrap;
  color: ${({ $status, theme }) =>
    $status === "improving"
      ? theme.colors.status.positive
      : $status === "declining"
        ? theme.colors.status.negative
        : theme.colors.status.warning};
  background: ${({ $status, theme }) =>
    $status === "improving"
      ? theme.colors.status.positiveSoft
      : $status === "declining"
        ? theme.colors.status.negativeSoft
        : theme.colors.status.warningSoft};
`;

const UnitLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ChartArea = styled.div`
  margin-block: ${({ theme }) => theme.spacing.sm};
`;

const InsightText = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  padding-block-start: ${({ theme }) => theme.spacing.xs};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;
