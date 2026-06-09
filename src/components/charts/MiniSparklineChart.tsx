"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { useTheme } from "styled-components";
import type { AppTheme } from "@/lib/theme/theme";
import {
  CHART_ANIMATION_EASING,
  CHART_LINE_ANIMATION_DURATION,
} from "@/utils/charts/chartAnimation";
import { useIsClient } from "@/utils/client/useIsClient";

export type MiniSparklineVariant =
  | "positive"
  | "negative"
  | "neutral"
  | "purple"
  | "amber";

type MiniSparklineChartProps = {
  data: number[];
  variant: MiniSparklineVariant;
  height?: number;
  showArea?: boolean;
  ariaLabel?: string;
};

const getVariantColors = (variant: MiniSparklineVariant, theme: AppTheme) => {
  if (variant === "negative") {
    return {
      stroke: theme.colors.chart.red,
      fill: theme.colors.chart.sparklineFill.negative,
    };
  }

  if (variant === "neutral") {
    return {
      stroke: theme.colors.chart.blue,
      fill: theme.colors.chart.sparklineFill.neutral,
    };
  }

  if (variant === "purple") {
    return {
      stroke: theme.colors.chart.purple,
      fill: theme.colors.chart.sparklineFill.purple,
    };
  }

  if (variant === "amber") {
    return {
      stroke: theme.colors.chart.amber,
      fill: theme.colors.chart.sparklineFill.amber,
    };
  }

  return {
    stroke: theme.colors.chart.green,
    fill: theme.colors.chart.sparklineFill.positive,
  };
};

export const MiniSparklineChart = ({
  data,
  variant,
  height = 56,
  showArea = true,
  ariaLabel,
}: MiniSparklineChartProps) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const chartData = data.map((value, index) => ({ index, value }));
  const { stroke, fill } = getVariantColors(variant, theme);
  const isAnimationActive = !prefersReducedMotion;

  if (chartData.length === 0 || !isClient) {
    return <EmptyChart $height={height} aria-hidden />;
  }

  const animationProps = {
    isAnimationActive,
    animationDuration: CHART_LINE_ANIMATION_DURATION,
    animationEasing: CHART_ANIMATION_EASING,
  };

  const chart = showArea ? (
    <AreaChart data={chartData}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.35} />
        </linearGradient>
      </defs>
      <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
      <Area
        type="monotone"
        dataKey="value"
        stroke={stroke}
        strokeWidth={2.5}
        fill={`url(#${gradientId})`}
        dot={false}
        activeDot={false}
        {...animationProps}
      />
    </AreaChart>
  ) : (
    <LineChart data={chartData}>
      <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
      <Line
        type="monotone"
        dataKey="value"
        stroke={stroke}
        strokeWidth={2.5}
        dot={false}
        activeDot={false}
        {...animationProps}
      />
    </LineChart>
  );

  return (
    <MotionWrapper
      $height={height}
      role="img"
      aria-label={ariaLabel}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {chart}
      </ResponsiveContainer>
    </MotionWrapper>
  );
};

const MotionWrapper = styled(motion.div)<{ $height: number }>`
  inline-size: 100%;
  block-size: ${({ $height }) => $height}px;
  min-inline-size: 6.875rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    block-size: 48px;
  }
`;

const EmptyChart = styled.div<{ $height: number }>`
  inline-size: 100%;
  block-size: ${({ $height }) => $height}px;
  min-inline-size: 6.875rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    block-size: 48px;
  }
`;
