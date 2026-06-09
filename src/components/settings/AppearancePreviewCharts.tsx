"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styled, { useTheme } from "styled-components";
import { useIsClient } from "@/utils/client/useIsClient";

const portfolioChartData = [
  { time: "9:30 AM", value: 126.4 },
  { time: "11:30 AM", value: 127.8 },
  { time: "1:30 PM", value: 126.9 },
  { time: "3:30 PM", value: 128.4 },
];

const animationChartData = [
  { index: 0, value: 126.2 },
  { index: 1, value: 127.1 },
  { index: 2, value: 126.5 },
  { index: 3, value: 127.6 },
  { index: 4, value: 127.2 },
  { index: 5, value: 128.1 },
  { index: 6, value: 127.8 },
  { index: 7, value: 128.4 },
];

type AppearancePreviewPortfolioChartProps = {
  ariaLabel: string;
  height?: number;
  animate?: boolean;
};

export const AppearancePreviewPortfolioChart = ({
  ariaLabel,
  height = 132,
  animate = true,
}: AppearancePreviewPortfolioChartProps) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const gradientId = useId().replace(/:/g, "");

  if (!isClient) {
    return <ChartPlaceholder $height={height} aria-hidden />;
  }

  return (
    <ChartShell $height={height} role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={portfolioChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.colors.chart.blue} stopOpacity={0.2} />
              <stop offset="100%" stopColor={theme.colors.chart.blue} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke={theme.colors.border.subtle}
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.colors.text.muted, fontSize: 10 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.colors.text.muted, fontSize: 10 }}
            ticks={[124, 128, 132]}
            tickFormatter={(value) => `${value}K`}
            width={36}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={theme.colors.chart.blue}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={(props) => {
              const { cx, cy, index } = props;
              if (index !== portfolioChartData.length - 1 || cx == null || cy == null) {
                return <g key={`dot-${index}`} />;
              }

              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={theme.colors.chart.blue}
                  stroke={theme.colors.background.card}
                  strokeWidth={2}
                />
              );
            }}
            activeDot={false}
            isAnimationActive={animate}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
};

type AppearancePreviewAnimationChartProps = {
  ariaLabel: string;
  height?: number;
  animate?: boolean;
};

export const AppearancePreviewAnimationChart = ({
  ariaLabel,
  height = 88,
  animate = true,
}: AppearancePreviewAnimationChartProps) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const gradientId = useId().replace(/:/g, "");

  if (!isClient) {
    return <ChartPlaceholder $height={height} aria-hidden />;
  }

  return (
    <AnimatedChartShell $height={height} $animate={animate} role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={animationChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.colors.chart.blue} stopOpacity={0.16} />
              <stop offset="100%" stopColor={theme.colors.chart.blue} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin - 0.5", "dataMax + 0.5"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={theme.colors.chart.blue}
            strokeWidth={2.5}
            strokeDasharray="6 4"
            fill={`url(#${gradientId})`}
            dot={(props) => {
              const { cx, cy, index } = props;
              if (index !== animationChartData.length - 1 || cx == null || cy == null) {
                return <g key={`dot-${index}`} />;
              }

              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill={theme.colors.chart.blue}
                  stroke={theme.colors.background.card}
                  strokeWidth={2}
                />
              );
            }}
            activeDot={false}
            isAnimationActive={animate}
          />
        </AreaChart>
      </ResponsiveContainer>
    </AnimatedChartShell>
  );
};

const ChartShell = styled.div<{ $height: number }>`
  inline-size: 100%;
  block-size: ${({ $height }) => $height}px;
  min-inline-size: 0;
`;

const AnimatedChartShell = styled(ChartShell)<{ $animate: boolean }>`
  ${({ $animate }) =>
    $animate
      ? `
    animation: previewChartPulse 2.4s ease-in-out infinite;
  `
      : ""}

  @keyframes previewChartPulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.82;
    }
  }
`;

const ChartPlaceholder = styled.div<{ $height: number }>`
  inline-size: 100%;
  block-size: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;
