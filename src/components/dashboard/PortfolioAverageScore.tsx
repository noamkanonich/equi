"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import type { DashboardScoreDistributionSegment } from "@/data/dashboard/dashboard.types";
import { CHART_ANIMATION_BEGIN } from "@/utils/charts/chartAnimation";
import { getScoreTierColor } from "@/utils/scoring/getScoreTierColors";

type PortfolioAverageScoreProps = {
  score: number;
  segments: DashboardScoreDistributionSegment[];
  animationDelay?: number;
  replayKey?: number;
};

export const PortfolioAverageScore = ({
  score,
  segments,
  animationDelay = 0,
  replayKey = 0,
}: PortfolioAverageScoreProps) => {
  const t = useTranslations("dashboard");
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const normalizedScore = Math.max(0, Math.min(100, score));

  const getFill = useCallback(
    (_index: number, segment: DashboardScoreDistributionSegment) =>
      getScoreTierColor(segment.key, theme),
    [theme],
  );

  const getTooltipRows = useCallback(
    (segment: DashboardScoreDistributionSegment): ChartTooltipRow[] => [
      {
        label: t(`metrics.scoreLegend.${segment.key}`),
        value: String(segment.value),
      },
    ],
    [t],
  );

  return (
    <Body>
      <ChartWrap>
        <AnimatedDonutChart
          data={segments}
          getFill={getFill}
          getTooltipRows={getTooltipRows}
          innerRadius="68%"
          outerRadius="92%"
          paddingAngle={3}
          cornerRadius={4}
          activeRadiusOffset={3}
        >
          <CenterLabel
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: prefersReducedMotion ? 0 : (CHART_ANIMATION_BEGIN + 200) / 1000,
            }}
          >
            <ScoreValue>
              <AnimatedNumber
                value={normalizedScore}
                decimals={0}
                formatter={(value) => String(Math.round(value))}
                delay={animationDelay}
                replayKey={replayKey}
              />
            </ScoreValue>
            <ScoreBase>{t("metrics.scoreBase")}</ScoreBase>
          </CenterLabel>
        </AnimatedDonutChart>
      </ChartWrap>

      <Legend>
        {segments.map((segment) => (
          <LegendRow key={segment.key}>
            <LegendSwatch $color={getScoreTierColor(segment.key, theme)} />
            <LegendLabel>{t(`metrics.scoreLegend.${segment.key}`)}</LegendLabel>
            <LegendValue>{segment.value}</LegendValue>
          </LegendRow>
        ))}
      </Legend>
    </Body>
  );
};

const Body = styled.div`
  display: grid;
  grid-template-columns: 5.25rem minmax(0, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 4.75rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ChartWrap = styled.div`
  position: relative;
  inline-size: 5.25rem;
  block-size: 5.25rem;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 4.75rem;
    block-size: 4.75rem;
  }
`;

const CenterLabel = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ScoreValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ScoreBase = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendSwatch = styled.span<{ $color: string }>`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const LegendLabel = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LegendValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;
