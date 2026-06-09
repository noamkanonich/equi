"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
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
  PortfolioPerformancePoint,
  PortfolioPerformanceRange,
} from "@/data/portfolio/portfolio.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataFreshnessStatus, DataState } from "@/data/ui/ui-state.types";
import { useAppStore } from "@/store/app.store";
import {
  CHART_ANIMATION_EASING,
  CHART_LINE_ANIMATION_DURATION,
} from "@/utils/charts/chartAnimation";
import { RECHARTS_MARGIN_DEFAULT } from "@/utils/charts/rechartsMargin";
import { useIsClient } from "@/utils/client/useIsClient";
import { convertCurrency } from "@/utils/currencies/convertCurrency";
import { getDisplayMoney } from "@/utils/currencies/getDisplayMoney";
import { formatMoney } from "@/utils/currencies/formatMoney";
import { formatPercent } from "@/utils/formatting/formatPercent";

const rangeOrder: PortfolioPerformanceRange[] = [
  "oneDay",
  "oneWeek",
  "oneMonth",
  "oneYear",
  "all",
];

const rangePointCount: Record<PortfolioPerformanceRange, number> = {
  oneDay: 8,
  oneWeek: 12,
  oneMonth: 18,
  oneYear: 22,
  all: 23,
};

const DEV_SIMULATE_LOADING = false;

type PortfolioPerformanceCardProps = {
  data: PortfolioPerformancePoint[];
  totalReturnPercent: number;
  locale: string;
  dataState?: DataState;
  freshnessStatus?: DataFreshnessStatus;
};

export const PortfolioPerformanceCard = ({
  data,
  totalReturnPercent,
  locale,
  dataState,
  freshnessStatus = "mock",
}: PortfolioPerformanceCardProps) => {
  const t = useTranslations("portfolio");
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);
  const [selectedRange, setSelectedRange] =
    useState<PortfolioPerformanceRange>("oneMonth");
  const gradientId = "portfolioPagePerformanceGradient";

  const visibleData = useMemo(() => {
    const count = rangePointCount[selectedRange];
    return data.slice(Math.max(0, data.length - count));
  }, [data, selectedRange]);

  const chartData = useMemo(
    () =>
      visibleData.map((point) => ({
        ...point,
        displayValue: convertCurrency({
          amount: point.value,
          fromCurrency: point.currency,
          toCurrency: displayCurrency,
          fxRates,
        }),
      })),
    [displayCurrency, fxRates, visibleData],
  );

  const latestPoint = visibleData[visibleData.length - 1];
  const latestDisplay = latestPoint
    ? getDisplayMoney({
        amount: latestPoint.value,
        originalCurrency: latestPoint.currency,
        displayCurrency,
        locale,
        fxRates,
      })
    : null;

  const tooltipRenderer = useMemo(
    () =>
      createChartTooltipRenderer((props) => {
        const point = props.payload?.[0]?.payload as
          | (PortfolioPerformancePoint & { displayValue: number })
          | undefined;

        if (!props.active || !point) {
          return null;
        }

        const display = getDisplayMoney({
          amount: point.value,
          originalCurrency: point.currency,
          displayCurrency,
          locale,
          fxRates,
        });

        const rows: ChartTooltipRow[] = [
          {
            label: point.label,
            value: display.showSecondary
              ? `${display.primary} (${display.secondary})`
              : display.primary,
          },
        ];

        return rows;
      }),
    [displayCurrency, fxRates, locale],
  );

  const formatAxisTick = (value: number) =>
    formatMoney(value, displayCurrency, {
      locale,
      compact: true,
    });

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
  });

  const isLoading = effectiveState === "loading";

  return (
    <Card>
      <Header>
        <TitleGroup>
          <TitleRow>
            <Title>{t("performance.title")}</Title>
            {!isLoading ? (
              <DataFreshnessBadge status={freshnessStatus} />
            ) : null}
          </TitleRow>
          <ReturnLabel $tone={totalReturnPercent >= 0 ? "positive" : "negative"}>
            {formatPercent(totalReturnPercent, { locale })}{" "}
            {t("metrics.allTime")}
          </ReturnLabel>
        </TitleGroup>
        <Controls>
          <RangeList aria-label={t("performance.rangeLabel")}>
            {rangeOrder.map((range) => (
              <RangeButton
                key={range}
                type="button"
                $active={range === selectedRange}
                onClick={() => setSelectedRange(range)}
              >
                {t(`performance.ranges.${range}`)}
              </RangeButton>
            ))}
          </RangeList>
          <Select aria-label={t("performance.selectorLabel")} defaultValue="value">
            <option value="value">{t("performance.value")}</option>
          </Select>
        </Controls>
      </Header>

      <ChartWrap>
        {isLoading ? (
          <SkeletonChart />
        ) : isClient ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={RECHARTS_MARGIN_DEFAULT}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme.colors.chart.blue}
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.colors.chart.blue}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
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
                width={56}
                domain={["dataMin - 1200", "dataMax + 1200"]}
                tickFormatter={formatAxisTick}
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
              <Area
                type="monotone"
                dataKey="displayValue"
                stroke={theme.colors.chart.blue}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
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
              {chartData.length > 0 ? (
                <ReferenceDot
                  x={chartData[chartData.length - 1].label}
                  y={chartData[chartData.length - 1].displayValue}
                  r={4}
                  fill={theme.colors.brand.primary}
                  stroke={theme.colors.background.card}
                  strokeWidth={2}
                />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ChartFallback aria-hidden />
        )}
      </ChartWrap>
      <Footer>
        {latestDisplay ? (
          <>
            {t("performance.currentValue", { value: latestDisplay.primary })}
            {latestDisplay.showSecondary && latestDisplay.secondary ? (
              <OriginalValue dir="ltr"> ({latestDisplay.secondary})</OriginalValue>
            ) : null}
          </>
        ) : null}
      </Footer>
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  block-size: 100%;
  min-block-size: 24rem;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ReturnLabel = styled.span<{ $tone: "positive" | "negative" }>`
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const RangeList = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
`;

const RangeButton = styled.button<{ $active?: boolean }>`
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.background.card : "transparent"};
  box-shadow: ${({ theme, $active }) =>
    $active ? theme.colors.shadow.soft : "none"};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Select = styled.select`
  min-block-size: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  padding-inline: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.card};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const ChartWrap = styled.div`
  block-size: 17rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    block-size: 14rem;
  }
`;

const ChartFallback = styled.div`
  inline-size: 100%;
  block-size: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const Footer = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const OriginalValue = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;
