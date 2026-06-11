"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { PageContent } from "@/components/layout/PageContent";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import { getNextMoveTabCounts } from "@/data/next-moves/mappers";
import type { NextMovesTab } from "@/data/next-moves/next-moves.types";
import { usePageStockBundles } from "@/hooks/usePageStockBundles";
import { useAppData } from "@/providers/useAppData";
import { buildNextMovesPageData } from "@/utils/next-moves/buildNextMovesPageData";
import { filterNextMoves } from "@/utils/next-moves/filterNextMoves";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import {
  enrichNextMoveWithBundle,
  enrichUpcomingEventWithBundle,
} from "@/utils/financial-data/enrichNextMoveWithBundle";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { NextMovesContentGrid } from "./NextMovesContentGrid";
import { NextMovesHeader } from "./NextMovesHeader";
import { NextMovesTabs } from "./NextMovesTabs";

export const NextMovesPage = () => {
  const locale = useLocale();
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<NextMovesTab>("allActions");
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);

  const {
    enrichedPortfolioHoldings,
    portfolioSummary,
    stockDataBySymbol,
    dismissedNextMoveIds,
    dismissNextMove,
    isUsingDemoPortfolio,
    isUserDataPending,
  } = useAppData();

  const nextMovesData = useMemo(
    () =>
      buildNextMovesPageData({
        enrichedPortfolioHoldings,
        portfolioSummary,
        stockDataBySymbol,
        dismissedNextMoveIds,
        isUsingDemoPortfolio,
      }),
    [
      dismissedNextMoveIds,
      enrichedPortfolioHoldings,
      isUsingDemoPortfolio,
      portfolioSummary,
      stockDataBySymbol,
    ],
  );

  const symbols = useMemo(
    () =>
      collectUniqueSymbols([
        ...nextMovesData.moves.map((move) => move.symbol),
        ...nextMovesData.upcomingEvents.map((event) => event.symbol),
      ]),
    [nextMovesData.moves, nextMovesData.upcomingEvents],
  );

  const { bundles, freshnessStatus } = usePageStockBundles(symbols);

  const enrichedMoves = useMemo(
    () =>
      nextMovesData.moves.map((move) =>
        enrichNextMoveWithBundle(move, bundles[move.symbol ?? ""]),
      ),
    [bundles, nextMovesData.moves],
  );

  const enrichedNextMovesData = useMemo(
    () => ({
      ...nextMovesData,
      upcomingEvents: nextMovesData.upcomingEvents.map((event) =>
        enrichUpcomingEventWithBundle(event, bundles[event.symbol]),
      ),
    }),
    [bundles, nextMovesData],
  );

  const tabCounts = useMemo(() => getNextMoveTabCounts(enrichedMoves), [enrichedMoves]);

  const filteredMoves = useMemo(() => {
    const priorityFiltered = highPriorityOnly
      ? enrichedMoves.filter((move) => move.priority === "high")
      : enrichedMoves;
    return filterNextMoves(priorityFiltered, activeTab);
  }, [activeTab, enrichedMoves, highPriorityOnly]);

  const handleDismissMove = useCallback(
    (moveId: string) => {
      dismissNextMove(moveId);
    },
    [dismissNextMove],
  );

  const showStaleNotice =
    freshnessStatus === "mock" || freshnessStatus === "stale";

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <PageContent>
      <MotionSection {...reveal(0)}>
        <NextMovesHeader />
        {showStaleNotice ? (
          <NoticeWrap>
            <StaleDataNotice
              title={tStates("stale.title")}
              description={tStates("stale.description")}
            />
          </NoticeWrap>
        ) : null}
      </MotionSection>
      <MotionSection {...reveal(1)}>
        <NextMovesTabs
          activeTab={activeTab}
          counts={tabCounts}
          onTabChange={setActiveTab}
          onFilterClick={() => setHighPriorityOnly((current) => !current)}
          isFilterActive={highPriorityOnly}
        />
      </MotionSection>
      <NextMovesContentGrid
        moves={filteredMoves}
        totalMoves={enrichedMoves.length}
        nextMovesData={enrichedNextMovesData}
        locale={locale}
        dataState={isUserDataPending ? "loading" : undefined}
        showGuidanceEmpty={enrichedPortfolioHoldings.length === 0}
        onDismissMove={handleDismissMove}
        onClearFilters={() => {
          setHighPriorityOnly(false);
          setActiveTab("allActions");
        }}
      />
    </PageContent>
  );
};

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;

const NoticeWrap = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
`;
