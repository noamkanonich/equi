"use client";

import styled from "styled-components";
import { SkeletonBlock } from "./skeletonBase";

export type SkeletonChartProps = {
  $height?: string;
};

export const SkeletonChart = ({ $height }: SkeletonChartProps) => {
  return (
    <Wrap aria-hidden $height={$height}>
      <AxisArea>
        <YAxis>
          <SkeletonBlock $width="2rem" $height="0.5rem" />
          <SkeletonBlock $width="2rem" $height="0.5rem" />
          <SkeletonBlock $width="2rem" $height="0.5rem" />
        </YAxis>
        <PlotArea>
          <ChartShape />
        </PlotArea>
      </AxisArea>
      <XAxis>
        <SkeletonBlock $width="2.5rem" $height="0.5rem" />
        <SkeletonBlock $width="2.5rem" $height="0.5rem" />
        <SkeletonBlock $width="2.5rem" $height="0.5rem" />
        <SkeletonBlock $width="2.5rem" $height="0.5rem" />
      </XAxis>
    </Wrap>
  );
};

const Wrap = styled.div<{ $height?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  block-size: ${({ $height, theme }) => $height ?? theme.chartHeights.md};
  min-block-size: ${({ theme }) => theme.chartHeights.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
  min-inline-size: 0;
`;

const AxisArea = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-block-size: 0;
`;

const YAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-block: ${({ theme }) => theme.spacing.xs};
`;

const PlotArea = styled.div`
  flex: 1;
  min-inline-size: 0;
  display: flex;
  align-items: flex-end;
`;

const ChartShape = styled.div`
  inline-size: 100%;
  block-size: 72%;
  border-radius: ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0 0;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background.elevated} 0%,
    ${({ theme }) => theme.colors.background.soft} 100%
  );
  opacity: 0.85;
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.65;
    }

    50% {
      opacity: 0.9;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.75;
  }
`;

const XAxis = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-inline-start: calc(2rem + ${({ theme }) => theme.spacing.sm});
`;
