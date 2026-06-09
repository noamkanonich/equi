"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { EmptyState } from "@/components/ui/states/EmptyState";
import { SkeletonChart } from "@/components/ui/states/SkeletonChart";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import type {
  DashboardPerformancePoint,
  DashboardPerformanceRange,
} from "@/data/dashboard/dashboard.types";
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

const rangeOrder: DashboardPerformanceRange[] = [
  "oneDay",
  "oneWeek",
  "oneMonth",
  "threeMonths",
  "oneYear",
  "all",
];

const rangePointCount: Record<DashboardPerformanceRange, number> = {
  oneDay: 8,
  oneWeek: 12,
  oneMonth: 18,
  threeMonths: 20,
  oneYear: 22,
  all: 23,
};

const DEV_SIMULATE_LOADING = false;

type PortfolioPerformanceCardProps = {
  data: DashboardPerformancePoint[];
  locale: string;
  dataState?: DataState;
  freshnessStatus?: DataFreshnessStatus;
};

export const PortfolioPerformanceCard = ({
  data,
  locale,
  dataState,
  freshnessStatus = "mock",
}: PortfolioPerformanceCardProps) => {
  const t = useTranslations("dashboard");
  const tStates = useTranslations("states");
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);
  const [selectedRange, setSelectedRange] =
    useState<DashboardPerformanceRange>("oneMonth");
  const gradientId = "portfolioPerformanceGradient";

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
          | (DashboardPerformancePoint & { displayValue: number })
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

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: data.length === 0,
  });

  const isLoading = effectiveState === "loading";
  const isEmpty = effectiveState === "empty";
  const showStaleNotice =
    freshnessStatus === "mock" || freshnessStatus === "stale";

  return (
    <Card>
      <Header>
        <TitleRow>
          <Title>{t("cards.performance")}</Title>
          {!isLoading ? (
            <DataFreshnessBadge status={freshnessStatus} />
          ) : null}
        </TitleRow>
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
      </Header>

      {!isLoading && showStaleNotice ? (
        <StaleWrap>
          <StaleDataNotice
            title={tStates("stale.title")}
            description={tStates("stale.description")}
          />
        </StaleWrap>
      ) : null}

      <ChartWrap>
        {isLoading ? (
          <SkeletonChart />
        ) : isEmpty ? (
          <EmptyState
            title={tStates("empty.title")}
            description={t("performance.emptyDescription")}
            $compact
          />
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
                    stopOpacity={0.18}
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
              <YAxis hide domain={["dataMin - 1200", "dataMax + 1200"]} />
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
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ChartFallback aria-hidden />
        )}
      </ChartWrap>
      <Footer>
        {latestDisplay ? (
          <ValuePill>
            <ValueLabel>{t("performance.currentValueLabel")}</ValueLabel>
            <ValueAmount dir="ltr">
              {latestDisplay.primary}
              {latestDisplay.showSecondary && latestDisplay.secondary ? (
                <OriginalValue> ({latestDisplay.secondary})</OriginalValue>
              ) : null}
            </ValueAmount>
          </ValuePill>
        ) : (
          <ValuePill>
            <ValueLabel>{t("performance.currentValueLabel")}</ValueLabel>
            <ValueAmount>—</ValueAmount>
          </ValuePill>
        )}
      </Footer>
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  display: flex;
  flex-direction: column;
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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const StaleWrap = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const RangeList = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
`;

const ChartWrap = styled.div`
  flex: 1;
  min-block-size: 16rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-block-size: 12rem;
  }
`;

const ChartFallback = styled.div`
  inline-size: 100%;
  block-size: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const Footer = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.md};
`;

const ValuePill = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const ValueLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const ValueAmount = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.lg};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const OriginalValue = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;
