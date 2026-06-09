"use client";

import { ArrowLeftRight, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { SOFT_EASE } from "@/utils/motion/transitions";

type SmartReplaceSwapControlProps = {
  isPreviewActive: boolean;
  animationKey: number;
  onSimulate: () => void;
  onReset: () => void;
};

export const SmartReplaceSwapControl = ({
  isPreviewActive,
  animationKey,
  onSimulate,
  onReset,
}: SmartReplaceSwapControlProps) => {
  const t = useTranslations("smartReplace");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const flowStart = locale === "he" ? "45%" : "-45%";
  const flowEnd = locale === "he" ? "-45%" : "45%";

  return (
    <Control>
      <Connector aria-hidden>
        <FlowDot
          key={animationKey}
          initial={prefersReducedMotion ? false : { x: flowStart, opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { x: flowEnd, opacity: isPreviewActive ? [0, 1, 0] : 0.55 }
          }
          transition={{
            duration: prefersReducedMotion ? 0 : 0.9,
            ease: SOFT_EASE,
          }}
        />
      </Connector>
      <SwapButton
        key={`swap-${animationKey}`}
        aria-label={t("main.replaceThisWithThat")}
        animate={{ rotate: isPreviewActive ? 180 : 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: SOFT_EASE }}
      >
        <ArrowLeftRight size={22} strokeWidth={1.9} aria-hidden />
      </SwapButton>
      <ButtonStack>
        <Button $size="sm" onClick={onSimulate}>
          {isPreviewActive ? t("main.previewSwapImpact") : t("main.simulateSwap")}
        </Button>
        {isPreviewActive ? (
          <Button $variant="secondary" $size="sm" onClick={onReset}>
            <RotateCcw size={14} strokeWidth={1.9} aria-hidden />
            {t("main.resetPreview")}
          </Button>
        ) : null}
      </ButtonStack>
    </Control>
  );
};

const Control = styled.div`
  position: relative;
  min-inline-size: 8.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  align-self: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-block-size: 6rem;
    min-inline-size: 100%;
  }
`;

const Connector = styled.div`
  position: absolute;
  inset-inline: -2rem;
  inset-block-start: 38%;
  block-size: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.colors.border.strong},
    transparent
  );
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inset-inline: auto;
    inset-block: -1rem;
    inline-size: 1px;
    block-size: calc(100% + 2rem);
    background: linear-gradient(
      180deg,
      transparent,
      ${({ theme }) => theme.colors.border.strong},
      transparent
    );
  }
`;

const FlowDot = styled(motion.span)`
  position: absolute;
  inset-block-start: -0.1875rem;
  inset-inline-start: 50%;
  inline-size: 0.375rem;
  block-size: 0.375rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.status.positive};
  box-shadow: 0 0 0 0.25rem ${({ theme }) => theme.colors.status.positiveSoft};
`;

const SwapButton = styled(motion.div)`
  position: relative;
  z-index: 1;
  inline-size: 3.75rem;
  block-size: 3.75rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  background:
    radial-gradient(
      circle,
      ${({ theme }) => theme.colors.background.card},
      ${({ theme }) => theme.colors.brand.primarySoft}
    );
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
`;

const ButtonStack = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;
