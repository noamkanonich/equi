"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type {
  ReplacementCandidate,
  SwapImpactMetric,
  WeakPosition,
} from "@/data/smart-replace/smart-replace.types";
import { SmartReplaceImpactPreview } from "./SmartReplaceImpactPreview";
import { SmartReplacePositionCard } from "./SmartReplacePositionCard";
import { SmartReplaceSwapControl } from "./SmartReplaceSwapControl";
import { SOFT_EASE } from "@/utils/motion/transitions";

type SmartReplaceMainComparisonProps = {
  weakPosition: WeakPosition;
  replacementCandidate: ReplacementCandidate;
  impactMetrics: SwapImpactMetric[];
  locale: string;
  isPreviewActive: boolean;
  animationKey: number;
  onSimulate: () => void;
  onReset: () => void;
  onApplySwap?: () => void;
};

export const SmartReplaceMainComparison = ({
  weakPosition,
  replacementCandidate,
  impactMetrics,
  locale,
  isPreviewActive,
  animationKey,
  onSimulate,
  onReset,
  onApplySwap,
}: SmartReplaceMainComparisonProps) => {
  const t = useTranslations("smartReplace");
  const prefersReducedMotion = useReducedMotion();
  const layoutTransition = {
    duration: prefersReducedMotion ? 0 : 0.48,
    ease: SOFT_EASE,
  };

  return (
    <Card>
      <SectionHeader>
        <Title>{t("main.positionToReview")}</Title>
        <Meta>{t("main.replaceThisWithThat")}</Meta>
      </SectionHeader>
      <ComparisonGrid>
        <Column
          layout
          $order={isPreviewActive ? 3 : 1}
          transition={layoutTransition}
        >
          <ColumnLabel>{t("main.currentHolding")}</ColumnLabel>
          <SmartReplacePositionCard
            variant="current"
            position={weakPosition}
            locale={locale}
            isPreviewActive={isPreviewActive}
            animationKey={animationKey}
          />
        </Column>
        <ControlSlot layout $order={2} transition={layoutTransition}>
          <SmartReplaceSwapControl
            isPreviewActive={isPreviewActive}
            animationKey={animationKey}
            onSimulate={onSimulate}
            onReset={onReset}
          />
        </ControlSlot>
        <Column
          layout
          $order={isPreviewActive ? 1 : 3}
          transition={layoutTransition}
        >
          <ColumnLabel>
            {isPreviewActive ? t("main.afterSwapPreview") : t("main.bestMatch")}
          </ColumnLabel>
          <SmartReplacePositionCard
            variant="replacement"
            candidate={replacementCandidate}
            locale={locale}
            isPreviewActive={isPreviewActive}
            animationKey={animationKey}
            onApplySwap={onApplySwap}
          />
        </Column>
      </ComparisonGrid>
      <SmartReplaceImpactPreview
        metrics={impactMetrics}
        locale={locale}
        isPreviewActive={isPreviewActive}
        replayKey={animationKey}
      />
    </Card>
  );
};

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ComparisonGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
  }
`;

const Column = styled(motion.div)<{ $order: number }>`
  order: ${({ $order }) => $order};
  flex: 1 1 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ControlSlot = styled(motion.div)<{ $order: number }>`
  order: ${({ $order }) => $order};
  display: flex;
  min-inline-size: 0;
`;

const ColumnLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;
