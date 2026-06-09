"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { createChartTooltipRenderer } from "@/components/charts/ChartTooltip";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import { DataFreshnessBadge } from "@/components/ui/states/DataFreshnessBadge";
import { SkeletonChart } from "@/components/ui/states/SkeletonChart";
import type {
  ReportBenchmarkKey,
  ReportPerformanceSeries,
} from "@/data/reports/reports.types";
import { reportBenchmarks } from "@/data/reports/mappers";
import type { DataFreshnessStatus, DataState } from "@/data/ui/ui-state.types";
import { resolveDataState } from "@/data/ui/mappers";
import {
  CHART_ANIMATION_EASING,
  CHART_LINE_ANIMATION_DURATION,
} from "@/utils/charts/chartAnimation";
import { RECHARTS_MARGIN_DEFAULT } from "@/utils/charts/rechartsMargin";
import { useIsClient } from "@/utils/client/useIsClient";
import { formatPercent } from "@/utils/formatting/formatPercent";

type PerformanceReportChartProps = {
  series: ReportPerformanceSeries;
  benchmark: ReportBenchmarkKey;
  onBenchmarkChange: (benchmark: ReportBenchmarkKey) => void;
  locale: string;
  dataState?: DataState;
  freshnessStatus?: DataFreshnessStatus;
};

export const PerformanceReportChart = ({
  series,
  benchmark,
  onBenchmarkChange,
  locale,
  dataState,
  freshnessStatus = "mock",
}: PerformanceReportChartProps) => {
  const t = useTranslations("reports.performance");
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();

  const tooltipRenderer = useMemo(
    () =>
      createChartTooltipRenderer((props) => {
        const point = props.payload?.[0]?.payload as
          | {
              label: string;
              portfolioPercent: number;
              benchmarkPercent: number;
            }
          | undefined;

        if (!props.active || !point) {
          return null;
        }

        const rows: ChartTooltipRow[] = [
          {
            label: t("portfolio"),
            value: formatPercent(point.portfolioPercent, { locale }),
          },
          {
            label: t(`benchmark.${benchmark}`),
            value: formatPercent(point.benchmarkPercent, { locale }),
          },
        ];

        return rows;
      }),
    [benchmark, locale, t],
  );

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: false,
  });

  const isLoading = effectiveState === "loading";

  return (
    <Card>
      <Header>
        <TitleGroup>
          <TitleRow>
            <Title>{t("title")}</Title>
            {!isLoading ? <DataFreshnessBadge status={freshnessStatus} /> : null}
          </TitleRow>
          <EndLabels>
            <EndLabel $tone="positive">
              {formatPercent(series.portfolioEndPercent, { locale, showSign: true })}
            </EndLabel>
            <EndLabel $tone="neutral">
              {formatPercent(series.benchmarkEndPercent, { locale, showSign: true })}
            </EndLabel>
          </EndLabels>
        </TitleGroup>
        <BenchmarkSelect
          aria-label={t("benchmarkLabel")}
          value={benchmark}
          onChange={(event) =>
            onBenchmarkChange(event.target.value as ReportBenchmarkKey)
          }
        >
          {reportBenchmarks.map((key) => (
            <option key={key} value={key}>
              {t(`benchmark.${key}`)}
            </option>
          ))}
        </BenchmarkSelect>
      </Header>

      <ChartWrap>
        {isLoading ? (
          <SkeletonChart />
        ) : isClient ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series.points} margin={RECHARTS_MARGIN_DEFAULT}>
              <CartesianGrid
                stroke={theme.colors.border.subtle}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
                tick={{
                  fill: theme.colors.text.muted,
                  fontSize: theme.typography.size.xs,
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={48}
                tickFormatter={(value: number) =>
                  formatPercent(value, { locale, showSign: false, decimals: 0 })
                }
                tick={{
                  fill: theme.colors.text.muted,
                  fontSize: theme.typography.size.xs,
                }}
              />
              <Tooltip
                content={tooltipRenderer}
                allowEscapeViewBox={{ x: true, y: true }}
                cursor={{
                  stroke: theme.colors.border.subtle,
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  fontSize: theme.typography.size.xs,
                  color: theme.colors.text.secondary,
                }}
              />
              <Line
                type="monotone"
                dataKey="portfolioPercent"
                name={t("portfolio")}
                stroke={theme.colors.chart.blue}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: theme.colors.chart.blue,
                  stroke: theme.colors.background.card,
                  strokeWidth: 2,
                }}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={CHART_LINE_ANIMATION_DURATION}
                animationEasing={CHART_ANIMATION_EASING}
              />
              <Line
                type="monotone"
                dataKey="benchmarkPercent"
                name={t(`benchmark.${benchmark}`)}
                stroke={theme.colors.text.muted}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={CHART_LINE_ANIMATION_DURATION}
                animationEasing={CHART_ANIMATION_EASING}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartFallback aria-hidden />
        )}
      </ChartWrap>
    </Card>
  );
};

const Card = styled.article`
  ${chartCardHover}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const EndLabels = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EndLabel = styled.span<{ $tone: "positive" | "neutral" }>`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme, $tone }) =>
    $tone === "positive" ? theme.colors.status.positive : theme.colors.text.muted};
`;

const BenchmarkSelect = styled.select`
  min-inline-size: 8rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  cursor: pointer;
`;

const ChartWrap = styled.div`
  block-size: 16rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    block-size: 14rem;
  }
`;

const ChartFallback = styled.div`
  block-size: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.elevated};
`;
