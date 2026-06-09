"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import styled, { css, useTheme } from "styled-components";
import { AnimatedDonutChart } from "@/components/charts/AnimatedDonutChart";
import type { ChartTooltipRow } from "@/components/charts/ChartTooltip";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { scoringFactorKeys } from "@/data/scoring/scoring.mock";
import type { ScoringFactorKey, ScoringFactorWeights } from "@/data/scoring/scoring.types";
import {
  calculateModelHealthScore,
  getModelHealthLabelKey,
} from "@/utils/scoring/calculateModelHealthScore";
import { getFactorChartColor } from "@/utils/scoring/getFactorChartColor";
import { mapScoreToTone } from "@/utils/scoring/mappers";
import { validateScoringWeights } from "@/utils/settings/validateScoringWeights";
import { CHART_ANIMATION_BEGIN } from "@/utils/charts/chartAnimation";

type DonutSegment = {
  key: ScoringFactorKey;
  value: number;
};

type ScoringModelSummaryCardProps = {
  weights: ScoringFactorWeights;
};

export const ScoringModelSummaryCard = ({ weights }: ScoringModelSummaryCardProps) => {
  const t = useTranslations("settings.scoringModel.summary");
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const { isValid: isWeightBalanced } = validateScoringWeights(weights);
  const healthScore = calculateModelHealthScore(weights);
  const healthLabelKey = getModelHealthLabelKey(healthScore);
  const healthTone = mapScoreToTone(healthScore);

  const segments: DonutSegment[] = useMemo(
    () =>
      scoringFactorKeys.map((key) => ({
        key,
        value: weights[key],
      })),
    [weights],
  );

  const getFill = useCallback(
    (_index: number, segment: DonutSegment) => getFactorChartColor(segment.key, theme),
    [theme],
  );

  const getTooltipRows = useCallback(
    (segment: DonutSegment): ChartTooltipRow[] => [
      {
        label: t(`legend.${segment.key}`),
        value: `${segment.value}%`,
      },
    ],
    [t],
  );

  return (
    <StyledCard $padding="md">
      <Header>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
        {!isWeightBalanced ? (
          <BalancingHint>{t("needsBalancing")}</BalancingHint>
        ) : null}
      </Header>

      <ChartSection>
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
                  value={healthScore}
                  decimals={0}
                  formatter={(value) => String(Math.round(value))}
                />
              </ScoreValue>
              <ScoreBase>{t("scoreBase")}</ScoreBase>
              <HealthLabel $tone={healthTone}>{t(`modelHealth.${healthLabelKey}`)}</HealthLabel>
            </CenterLabel>
          </AnimatedDonutChart>
        </ChartWrap>

        <Legend>
          {segments.map((segment) => (
            <LegendRow key={segment.key}>
              <LegendSwatch $color={getFactorChartColor(segment.key, theme)} />
              <LegendLabel>{t(`legend.${segment.key}`)}</LegendLabel>
              <LegendValue>{segment.value}%</LegendValue>
            </LegendRow>
          ))}
        </Legend>
      </ChartSection>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const BalancingHint = styled.p`
  color: ${({ theme }) => theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChartWrap = styled.div`
  position: relative;
  inline-size: 100%;
  block-size: 11rem;
`;

const CenterLabel = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
`;

const ScoreValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ScoreBase = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const healthToneColor = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
  `,
};

const HealthLabel = styled.span<{ $tone: keyof typeof healthToneColor }>`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  ${({ $tone }) => healthToneColor[$tone]}
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LegendRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LegendSwatch = styled.span<{ $color: string }>`
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const LegendValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
