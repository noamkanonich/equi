"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { CircularScore } from "@/components/ui/CircularScore";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { ScoringFactorWeights } from "@/data/scoring/scoring.types";
import { validateScoringWeights } from "@/utils/settings/validateScoringWeights";

type ScoringModelTotalWeightBannerProps = {
  weights: ScoringFactorWeights;
};

export const ScoringModelTotalWeightBanner = ({
  weights,
}: ScoringModelTotalWeightBannerProps) => {
  const t = useTranslations("settings.scoringModel.totalWeight");
  const prefersReducedMotion = useReducedMotion();
  const { total, isValid } = validateScoringWeights(weights);

  return (
    <Banner
      $valid={isValid}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
      <Start>
        <ScoreWrap>
          <CircularScore score={total} size="sm" showBase={false} ariaLabel={t("title")} />
        </ScoreWrap>
        <TotalCopy>
          <TotalTitle>{t("title")}</TotalTitle>
          <TotalPercent $valid={isValid}>
            <AnimatedNumber
              value={total}
              decimals={0}
              formatter={(value) => `${Math.round(value)}%`}
            />
          </TotalPercent>
          <StatusLabel $valid={isValid}>
            {isValid ? t("valid") : t("invalid")}
          </StatusLabel>
        </TotalCopy>
      </Start>
      <Hint>
        <Info size={16} strokeWidth={1.9} aria-hidden />
        <span>{t("hint")}</span>
      </Hint>
    </Banner>
  );
};

const Banner = styled(motion.div)<{ $valid: boolean }>`
  display: flex;
  transition: background 0.2s ease, border-color 0.2s ease;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $valid, theme }) =>
    $valid ? theme.colors.brand.primarySoft : theme.colors.status.warningSoft};
  border: 1px solid
    ${({ theme, $valid }) =>
      $valid
        ? `color-mix(in srgb, ${theme.colors.brand.primary} 15%, transparent)`
        : `color-mix(in srgb, ${theme.colors.status.warning} 15%, transparent)`};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Start = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ScoreWrap = styled.div`
  flex-shrink: 0;
`;

const TotalCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TotalTitle = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const TotalPercent = styled.span<{ $valid: boolean }>`
  color: ${({ theme, $valid }) =>
    $valid ? theme.colors.brand.primary : theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const StatusLabel = styled.span<{ $valid: boolean }>`
  color: ${({ theme, $valid }) =>
    $valid ? theme.colors.status.positive : theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Hint = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  max-inline-size: 28rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};

  svg {
    flex-shrink: 0;
    margin-block-start: 0.125rem;
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;
