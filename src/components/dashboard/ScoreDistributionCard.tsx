"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import {
  mapScoreDistributionToTotal,
} from "@/data/dashboard/mappers";
import type { DashboardScoreDistributionSegment } from "@/data/dashboard/dashboard.types";
import { CHART_ANIMATION_BEGIN } from "@/utils/charts/chartAnimation";

type ScoreDistributionCardProps = {
  segments: DashboardScoreDistributionSegment[];
};

export const ScoreDistributionCard = ({
  segments,
}: ScoreDistributionCardProps) => {
  const t = useTranslations("dashboard");
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const total = mapScoreDistributionToTotal(segments);

  const colors = useMemo(
    () => [
      theme.colors.status.positive,
      theme.colors.chart.green,
      theme.colors.status.warning,
      theme.colors.status.negative,
    ],
    [theme],
  );

  const getFill = useCallback(
    (index: number) => colors[index % colors.length],
    [colors],
  );

  const getTooltipRows = useCallback(
    (segment: DashboardScoreDistributionSegment): ChartTooltipRow[] => [
      {
        label: t(`scoreDistribution.labels.${segment.key}`, {
          min: segment.minScore,
          max: segment.maxScore,
        }),
        value: String(segment.value),
        percent: t("charts.tooltip.percentLabel", {
          percent: total > 0
            ? `${Math.round((segment.value / total) * 100)}%`
            : "0%",
        }),
      },
    ],
    [t, total],
  );

  return (
    <Card>
      <Title>{t("cards.scoreDistribution")}</Title>
      <Content>
        <ChartWrap>
          <AnimatedDonutChart
            data={segments}
            getFill={getFill}
            getTooltipRows={getTooltipRows}
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
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
              <Total>{total}</Total>
              <TotalLabel>{t("scoreDistribution.total")}</TotalLabel>
            </CenterLabel>
          </AnimatedDonutChart>
        </ChartWrap>
        <Legend>
          {segments.map((segment, index) => (
            <LegendRow key={segment.key}>
              <LegendDot $color={colors[index % colors.length]} />
              <LegendLabel>
                {t(`scoreDistribution.labels.${segment.key}`, {
                  min: segment.minScore,
                  max: segment.maxScore,
                })}
              </LegendLabel>
              <LegendValue>{segment.value}</LegendValue>
            </LegendRow>
          ))}
        </Legend>
      </Content>
    </Card>
  );
};

const Card = styled.section`
  ${chartCardHover}
  block-size: 100%;
  min-block-size: 13.25rem;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChartWrap = styled.div`
  inline-size: min(100%, 10rem);
  block-size: 9rem;
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

const Total = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const TotalLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Legend = styled.div`
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendDot = styled.span<{ $color: string }>`
  inline-size: 0.6rem;
  block-size: 0.6rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const LegendValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;
