"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SkeletonCard } from "@/components/ui/states/SkeletonCard";
import type { NextMovesData, NextMoveItem } from "@/data/next-moves/next-moves.types";
import { resolveDataState, resolveListEmptyVariant } from "@/data/ui/mappers";
import type { DataState, ListEmptyVariant } from "@/data/ui/ui-state.types";
import { softTransition } from "@/utils/motion/transitions";
import { NextMoveCard } from "./NextMoveCard";
import { NextMovesSidebar } from "./NextMovesSidebar";

const DEV_SIMULATE_LOADING = false;

type NextMovesContentGridProps = {
  moves: NextMoveItem[];
  totalMoves: number;
  nextMovesData: NextMovesData;
  locale: string;
  emptyVariant?: ListEmptyVariant;
  showGuidanceEmpty?: boolean;
  dataState?: DataState;
  onDismissMove?: (moveId: string) => void;
  onClearFilters?: () => void;
};

export const NextMovesContentGrid = ({
  moves,
  totalMoves,
  nextMovesData,
  locale,
  emptyVariant: emptyVariantProp,
  showGuidanceEmpty = false,
  dataState,
  onDismissMove,
  onClearFilters,
}: NextMovesContentGridProps) => {
  const t = useTranslations("nextMoves");
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();
  const movesAnimationKey = moves.map((move) => move.id).join("-");

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: totalMoves === 0,
  });

  const emptyVariant =
    emptyVariantProp ?? resolveListEmptyVariant(moves.length, totalMoves);

  const renderMainContent = () => {
    if (effectiveState === "loading") {
      return (
        <LoadingPanel key="loading">
          <SkeletonCard $bodyLines={4} $showFooter />
          <SkeletonCard $bodyLines={3} />
        </LoadingPanel>
      );
    }

    if (moves.length > 0) {
      return (
        <MotionList
          key={movesAnimationKey}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : softTransition(0.26)
          }
        >
          {moves.map((move, index) => (
            <NextMoveCard
              key={move.id}
              move={move}
              index={index}
              onDismiss={onDismissMove}
            />
          ))}
        </MotionList>
      );
    }

    if (emptyVariant === "filtered") {
      return (
        <EmptyPanel
          key="filtered"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : softTransition(0.24)
          }
        >
          <NoResultsState
            title={tStates("noResults.title")}
            description={tStates("noResults.description")}
            clearAction={
              onClearFilters
                ? {
                    label: tStates("noResults.clearFilters"),
                    onClick: onClearFilters,
                    variant: "secondary",
                  }
                : undefined
            }
          />
        </EmptyPanel>
      );
    }

    return (
      <EmptyPanel
        key="empty"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : softTransition(0.24)
        }
      >
        <EmptyState
          title={t(showGuidanceEmpty ? "guidanceEmpty.title" : "empty.title")}
          description={
            showGuidanceEmpty ? t("guidanceEmpty.summary") : t("empty.description")
          }
        />
      </EmptyPanel>
    );
  };

  return (
    <Grid>
      <MainColumn>
        <AnimatePresence mode="wait">{renderMainContent()}</AnimatePresence>
      </MainColumn>
      <NextMovesSidebar
        portfolioHealth={nextMovesData.portfolioHealth}
        riskFactors={nextMovesData.riskFactors}
        upcomingEvents={nextMovesData.upcomingEvents}
        aiSummary={nextMovesData.aiSummary}
        locale={locale}
        startIndex={moves.length + 2}
      />
    </Grid>
  );
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(20rem, 22.5rem);
  align-items: start;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  min-inline-size: 0;
`;

const MotionList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const EmptyPanel = styled(motion.div)`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const LoadingPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
