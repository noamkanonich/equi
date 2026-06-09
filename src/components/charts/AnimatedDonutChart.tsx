"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { createChartTooltipRenderer } from "@/components/charts/ChartTooltip";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import {
  CHART_ANIMATION_BEGIN,
  CHART_ANIMATION_DURATION,
  CHART_ANIMATION_EASING,
} from "@/utils/charts/chartAnimation";
import { useIsClient } from "@/utils/client/useIsClient";

const ACTIVE_RADIUS_OFFSET = 4;
const INACTIVE_SLICE_OPACITY = 0.45;

export type DonutChartSegment = {
  key: string;
  value: number;
};

type AnimatedDonutChartProps<T extends DonutChartSegment> = {
  data: T[];
  getFill: (index: number, segment: T) => string;
  getTooltipRows: (segment: T, index: number) => ChartTooltipRow[];
  innerRadius?: string | number;
  outerRadius?: string | number;
  paddingAngle?: number;
  cornerRadius?: number;
  activeRadiusOffset?: number;
  children?: React.ReactNode;
};

export const AnimatedDonutChart = <T extends DonutChartSegment>({
  data,
  getFill,
  getTooltipRows,
  innerRadius = "62%",
  outerRadius = "88%",
  paddingAngle = 3,
  cornerRadius,
  activeRadiusOffset = ACTIVE_RADIUS_OFFSET,
  children,
}: AnimatedDonutChartProps<T>) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const handleMouseEnter = useCallback(
    (_: unknown, index: number) => {
      setActiveIndex(index);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const tooltipRenderer = useMemo(
    () =>
      createChartTooltipRenderer((props) => {
        if (!props.active || !props.payload?.[0]?.payload) {
          return null;
        }

        const segment = props.payload[0].payload as T;
        const index = data.findIndex((item) => item.key === segment.key);
        if (index < 0) {
          return null;
        }

        return getTooltipRows(segment, index);
      }),
    [data, getTooltipRows],
  );

  const renderShape = useCallback(
    (props: PieSectorShapeProps) => {
      const {
        cx,
        cy,
        innerRadius: innerR,
        outerRadius: outerR,
        startAngle,
        endAngle,
        fill,
        index,
        isActive,
      } = props;

      const isHighlighted =
        isActive || (activeIndex !== undefined && activeIndex === index);

      const resolvedOuterRadius =
        isHighlighted && typeof outerR === "number"
          ? outerR + activeRadiusOffset
          : outerR;

      const fillOpacity =
        activeIndex === undefined || activeIndex === index
          ? 1
          : INACTIVE_SLICE_OPACITY;

      return (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerR}
          outerRadius={resolvedOuterRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          fillOpacity={fillOpacity}
          cornerRadius={cornerRadius}
        />
      );
    },
    [activeIndex, activeRadiusOffset, cornerRadius],
  );

  if (!isClient || data.length === 0) {
    return (
      <ChartShell>
        <ChartFallback aria-hidden />
        {children}
      </ChartShell>
    );
  }

  return (
    <ChartShell>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="key"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            cornerRadius={cornerRadius}
            stroke={theme.colors.background.card}
            strokeWidth={3}
            isAnimationActive={!prefersReducedMotion}
            animationBegin={CHART_ANIMATION_BEGIN}
            animationDuration={CHART_ANIMATION_DURATION}
            animationEasing={CHART_ANIMATION_EASING}
            shape={renderShape}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
          >
            {data.map((segment, index) => (
              <Cell key={segment.key} fill={getFill(index, segment)} />
            ))}
          </Pie>
          <Tooltip
            content={tooltipRenderer}
            allowEscapeViewBox={{ x: true, y: true }}
            cursor={false}
          />
        </PieChart>
      </ResponsiveContainer>
      {children}
    </ChartShell>
  );
};

const ChartShell = styled.div`
  position: relative;
  inline-size: 100%;
  block-size: 100%;
`;

const ChartFallback = styled.div`
  inline-size: 100%;
  block-size: 100%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.soft};
`;
