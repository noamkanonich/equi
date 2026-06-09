"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
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
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import type {
  StockAnalysisData,
  StockChartRange,
} from "@/data/stocks/stock-analysis.types";
import { useAppStore } from "@/store/app.store";
import {
  CHART_ANIMATION_EASING,
  CHART_LINE_ANIMATION_DURATION,
} from "@/utils/charts/chartAnimation";
import { useIsClient } from "@/utils/client/useIsClient";
import { convertCurrency } from "@/utils/currencies/convertCurrency";
import { getDisplayMoney } from "@/utils/currencies/getDisplayMoney";

type StockPriceChartCardProps = {
  stock: StockAnalysisData;
  locale: string;
};

const CHART_RANGES: StockChartRange[] = [
  "oneDay",
  "oneWeek",
  "oneMonth",
  "oneYear",
  "max",
];

export const StockPriceChartCard = ({ stock, locale }: StockPriceChartCardProps) => {
  const t = useTranslations("stockAnalysis");
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);
  const [activeRange, setActiveRange] = useState<StockChartRange>("oneDay");
  const gradientId = `stockPriceGradient-${stock.symbol}`;

  const chartData = useMemo(
    () =>
      stock.chartData[activeRange].map((point) => ({
        ...point,
        displayPrice: convertCurrency({
          amount: point.price,
          fromCurrency: stock.currency,
          toCurrency: displayCurrency,
          fxRates,
        }),
      })),
    [activeRange, displayCurrency, fxRates, stock.chartData, stock.currency],
  );

  const previousCloseDisplay = convertCurrency({
    amount: stock.previousClose,
    fromCurrency: stock.currency,
    toCurrency: displayCurrency,
    fxRates,
  });

  const tooltipRenderer = useMemo(
    () =>
      createChartTooltipRenderer((props) => {
        const point = props.payload?.[0]?.payload as
          | { label: string; price: number; displayPrice: number }
          | undefined;

        if (!props.active || !point) {
          return null;
        }

        const display = getDisplayMoney({
          amount: point.price,
          originalCurrency: stock.currency,
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
    [displayCurrency, fxRates, locale, stock.currency],
  );

  return (
    <Card>
      <Header>
        <RangeList aria-label={t("chart.rangeLabel")}>
          {CHART_RANGES.map((range) => (
            <RangeButton
              key={range}
              $active={activeRange === range}
              onClick={() => setActiveRange(range)}
              type="button"
            >
              {t(`chart.ranges.${range}`)}
            </RangeButton>
          ))}
        </RangeList>
        <PrevClose>
          {t("header.previousClose")}{" "}
          <DisplayMoney
            amount={stock.previousClose}
            currency={stock.currency}
            locale={locale}
            layout="inline"
          />
        </PrevClose>
      </Header>

      <ChartWrap>
        {isClient ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme.colors.chart.green}
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.colors.chart.green}
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
                tick={{
                  fill: theme.colors.text.muted,
                  fontSize: theme.typography.size.xs,
                }}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                tickLine={false}
                axisLine={false}
                width={72}
                tick={{
                  fill: theme.colors.text.muted,
                  fontSize: theme.typography.size.xs,
                }}
                tickFormatter={(value: number) =>
                  getDisplayMoney({
                    amount: value,
                    originalCurrency: displayCurrency,
                    displayCurrency,
                    locale,
                    fxRates,
                  }).primary
                }
              />
              <ReferenceLine
                y={previousCloseDisplay}
                stroke={theme.colors.text.muted}
                strokeDasharray="4 4"
                strokeOpacity={0.6}
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
                dataKey="displayPrice"
                stroke={theme.colors.chart.green}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: theme.colors.chart.green,
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
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const RangeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RangeButton = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.brand.primary : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primarySoft : theme.colors.background.card};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
`;

const PrevClose = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const ChartWrap = styled.div`
  block-size: ${({ theme }) => theme.chartHeights.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    block-size: ${({ theme }) => theme.chartHeights.md};
  }
`;

const ChartFallback = styled.div`
  inline-size: 100%;
  block-size: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;
