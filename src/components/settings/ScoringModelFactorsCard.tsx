"use client";

import { motion, type Variants } from "framer-motion";
import { BarChart3, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { fadeUpVariants } from "@/utils/motion/transitions";
import { scoringFactorMeta } from "@/data/scoring/scoring.mock";
import type { ScoringFactorKey, ScoringFactorWeights } from "@/data/scoring/scoring.types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScoringModelFactorRow } from "./ScoringModelFactorRow";
import { ScoringModelTotalWeightBanner } from "./ScoringModelTotalWeightBanner";
import {
  SCORING_FACTORS_TABLE_COLUMN_GAP,
  SCORING_FACTORS_TABLE_COLUMNS,
} from "./scoringFactorsTableLayout";

type ScoringModelFactorsCardProps = {
  weights: ScoringFactorWeights;
  expandedFactors: Set<ScoringFactorKey>;
  onToggleExpand: (key: ScoringFactorKey) => void;
  onWeightChange: (key: ScoringFactorKey, weight: number) => void;
  onUseRecommended: () => void;
  rowMotionVariants?: Variants;
  prefersReducedMotion?: boolean | null;
};

export const ScoringModelFactorsCard = ({
  weights,
  expandedFactors,
  onToggleExpand,
  onWeightChange,
  onUseRecommended,
  rowMotionVariants,
  prefersReducedMotion = false,
}: ScoringModelFactorsCardProps) => {
  const t = useTranslations("settings.scoringModel");

  return (
    <StyledCard $padding="md">
      <Header>
        <TitleRow>
          <IconWrap aria-hidden>
            <BarChart3 size={18} strokeWidth={1.9} />
          </IconWrap>
          <Copy>
            <Title>{t("title")}</Title>
            <Description>{t("description")}</Description>
          </Copy>
        </TitleRow>
        <UseRecommendedButton type="button" $variant="secondary" $size="sm" onClick={onUseRecommended}>
          <Star size={16} strokeWidth={1.9} aria-hidden />
          {t("useRecommended")}
        </UseRecommendedButton>
      </Header>

      <Table>
        <HeaderRow>
          <HeaderFactor>{t("table.factor")}</HeaderFactor>
          <HeaderDescription>{t("table.description")}</HeaderDescription>
          <HeaderWeight>{t("table.weight")}</HeaderWeight>
          <HeaderImpact>{t("table.impact")}</HeaderImpact>
          <HeaderExpand aria-hidden />
        </HeaderRow>

        <FactorRows
          variants={rowMotionVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="show"
        >
          {scoringFactorMeta.map((factor) => (
            <FactorRowMotion key={factor.key} variants={fadeUpVariants}>
              <ScoringModelFactorRow
                factorKey={factor.key}
                weight={weights[factor.key]}
                impact={factor.impact}
                accent={factor.accent}
                isExpanded={expandedFactors.has(factor.key)}
                onToggleExpand={() => onToggleExpand(factor.key)}
                onWeightChange={(value) => onWeightChange(factor.key, value)}
              />
            </FactorRowMotion>
          ))}
        </FactorRows>
      </Table>

      <ScoringModelTotalWeightBanner weights={weights} />
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-inline-size: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block-end: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.chart.purple};
  background: ${({ theme }) => theme.colors.chart.sparklineFill.purple};
`;

const Copy = styled.div`
  min-inline-size: 0;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Description = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const UseRecommendedButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
`;

const FactorRows = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const FactorRowMotion = styled(motion.div)``;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${SCORING_FACTORS_TABLE_COLUMNS};
  column-gap: ${SCORING_FACTORS_TABLE_COLUMN_GAP};
  align-items: center;
  padding-inline: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const headerCell = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const HeaderFactor = styled(headerCell)``;

const HeaderDescription = styled(headerCell)``;

const HeaderWeight = styled(headerCell)`
  text-align: start;
`;

const HeaderImpact = styled(headerCell)`
  justify-self: center;
  text-align: center;
`;

const HeaderExpand = styled.span`
  justify-self: center;
`;
