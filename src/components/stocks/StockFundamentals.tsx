"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { DataFreshnessBadge } from "@/components/ui/states/DataFreshnessBadge";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { SkeletonChart } from "@/components/ui/states/SkeletonChart";
import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataFreshnessStatus, DataState } from "@/data/ui/ui-state.types";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockFundamentalAiReadCard } from "./StockFundamentalAiReadCard";
import { StockFundamentalTrendGrid } from "./StockFundamentalTrendGrid";
import { StockValuationSnapshotCard } from "./StockValuationSnapshotCard";

const DEV_SIMULATE_LOADING = false;

type StockFundamentalsProps = {
  stock: StockAnalysisData;
  locale: string;
  dataState?: DataState;
  freshnessStatus?: DataFreshnessStatus;
};

export const StockFundamentals = ({
  stock,
  dataState,
  freshnessStatus = "mock",
}: StockFundamentalsProps) => {
  const t = useTranslations("stockAnalysis");
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  const fundamentals = stock.fundamentals;

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty:
      !fundamentals ||
      fundamentals.trendMetrics.length === 0 ||
      fundamentals.valuationSnapshot.length === 0,
  });

  if (effectiveState === "loading") {
    return (
      <Wrapper>
        <SkeletonChart $height="12rem" />
        <SkeletonChart $height="10rem" />
      </Wrapper>
    );
  }

  if (effectiveState === "empty") {
    return (
      <EmptyCard>
        <EmptyState
          title={t("fundamentals.emptyState")}
          description={tStates("empty.description")}
          $compact
        />
      </EmptyCard>
    );
  }

  return (
    <Wrapper>
      <BadgeRow>
        <DataFreshnessBadge status={freshnessStatus} />
      </BadgeRow>
      <motion.div {...reveal(0)}>
        <StockFundamentalAiReadCard aiRead={fundamentals.aiFundamentalRead} />
      </motion.div>

      <motion.div {...reveal(1)}>
        <StockFundamentalTrendGrid metrics={fundamentals.trendMetrics} />
      </motion.div>

      <motion.div {...reveal(2)}>
        <StockValuationSnapshotCard metrics={fundamentals.valuationSnapshot} />
      </motion.div>

      <motion.div {...reveal(3)}>
        <SourceNote>{t("fundamentals.sourceNote")}</SourceNote>
      </motion.div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const BadgeRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const SourceNote = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
