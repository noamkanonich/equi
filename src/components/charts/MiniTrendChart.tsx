"use client";

import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { createChartTooltipRenderer } from "@/components/charts/ChartTooltip";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import {
  CHART_ANIMATION_EASING,
  CHART_LINE_ANIMATION_DURATION,
} from "@/utils/charts/chartAnimation";
import { useIsClient } from "@/utils/client/useIsClient";

type MiniTrendChartProps = {
  data: number[];
  tone?: "positive" | "negative" | "neutral";
  height?: number;
  formatValue?: (value: number) => string;
};

export const MiniTrendChart = ({
  data,
  tone = "positive",
  height = 42,
  formatValue,
}: MiniTrendChartProps) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const chartData = data.map((value, index) => ({ index, value }));
  const strokeColor =
    tone === "negative"
      ? theme.colors.status.negative
      : tone === "neutral"
        ? theme.colors.status.neutral
        : theme.colors.status.positive;

  const tooltipRenderer = useMemo(
    () =>
      createChartTooltipRenderer((props) => {
        const entry = props.payload?.[0];
        if (!props.active || entry?.value === undefined || entry?.value === null) {
          return null;
        }

        const value = Number(entry.value);
        const rows: ChartTooltipRow[] = [
          {
            label: "",
            value: formatValue ? formatValue(value) : String(value),
          },
        ];

        return rows;
      }),
    [formatValue],
  );

  if (chartData.length === 0 || !isClient) {
    return <EmptyChart $height={height} aria-hidden />;
  }

  return (
    <Wrapper $height={height} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Tooltip
            content={tooltipRenderer}
            allowEscapeViewBox={{ x: true, y: true }}
            cursor={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 3,
              fill: strokeColor,
              stroke: theme.colors.background.card,
              strokeWidth: 2,
            }}
            isAnimationActive={!prefersReducedMotion}
            animationDuration={CHART_LINE_ANIMATION_DURATION}
            animationEasing={CHART_ANIMATION_EASING}
          />
        </LineChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $height: number }>`
  inline-size: 100%;
  block-size: ${({ $height }) => $height}px;
  min-inline-size: 5.5rem;
`;

const EmptyChart = styled.div<{ $height: number }>`
  inline-size: 100%;
  block-size: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;
