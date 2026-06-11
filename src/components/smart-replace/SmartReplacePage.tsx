"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  PageColumnStack,
  PageContent,
  PageMainGrid,
} from "@/components/layout/PageContent";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import type {
  ReplacementCandidate,
  UpgradeDowngradeSignal,
  WeakPosition,
} from "@/data/smart-replace/smart-replace.types";
import { usePageStockBundles } from "@/hooks/usePageStockBundles";
import { useAppData } from "@/providers/useAppData";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import {
  mergeStockBundleIntoStockItem,
  mergeStockProfileIntoStockItem,
} from "@/utils/financial-data/mergeStockProfileIntoStockItem";
import { mergeStockQuoteIntoHolding } from "@/utils/financial-data/mergeStockQuoteIntoHolding";
import { calculateSwapImpact } from "@/utils/smart-replace/calculateSwapImpact";
import { buildSmartReplacePageData } from "@/utils/smart-replace/buildSmartReplacePageData";
import { SmartReplaceCandidatesTable } from "./SmartReplaceCandidatesTable";
import { SmartReplaceHeader } from "./SmartReplaceHeader";
import { SmartReplaceMainComparison } from "./SmartReplaceMainComparison";
import { SmartReplaceOtherWeakPositionsCard } from "./SmartReplaceOtherWeakPositionsCard";
import { SmartReplaceSidebar } from "./SmartReplaceSidebar";
import { SmartReplaceSignalsCard } from "./SmartReplaceSignalsCard";
import { SmartReplaceSummaryGrid } from "./SmartReplaceSummaryGrid";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const enrichWeakPosition = (
  position: WeakPosition,
  bundles: Record<string, StockProviderDataBundle>,
): WeakPosition => mergeStockProfileIntoStockItem(position, bundles[position.symbol]);

const enrichReplacementCandidate = (
  candidate: ReplacementCandidate,
  bundles: Record<string, StockProviderDataBundle>,
): ReplacementCandidate =>
  mergeStockQuoteIntoHolding(
    mergeStockBundleIntoStockItem(
      { ...candidate, dayChangePercent: 0 },
      bundles[candidate.symbol],
    ),
    bundles[candidate.symbol],
  );

export const SmartReplacePage = () => {
  const locale = useLocale();
  const t = useTranslations("watchlist");
  const tStates = useTranslations("states");
  const tConfirm = useTranslations("smartReplace.confirm");
  const prefersReducedMotion = useReducedMotion();
  const {
    enrichedPortfolioHoldings,
    enrichedWatchlistItems,
    isUsingDemoPortfolio,
    isUserDataPending,
  } = useAppData();

  const pageData = useMemo(
    () =>
      buildSmartReplacePageData({
        enrichedPortfolioHoldings,
        enrichedWatchlistItems,
        isUsingDemoPortfolio,
      }),
    [enrichedPortfolioHoldings, enrichedWatchlistItems, isUsingDemoPortfolio],
  );

  const [selectedWeakPositionId, setSelectedWeakPositionId] = useState<string | null>(
    null,
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isApplyConfirmOpen, setIsApplyConfirmOpen] = useState(false);

  const resolvedWeakPositionId = useMemo(() => {
    const validIds = new Set([
      ...pageData.weakPositions.map((position) => position.id),
      ...pageData.otherWeakPositions.map((position) => position.id),
    ]);

    if (selectedWeakPositionId && validIds.has(selectedWeakPositionId)) {
      return selectedWeakPositionId;
    }

    return pageData.defaultWeakPositionId;
  }, [
    pageData.defaultWeakPositionId,
    pageData.otherWeakPositions,
    pageData.weakPositions,
    selectedWeakPositionId,
  ]);

  const resolvedCandidateId = useMemo(() => {
    const validIds = new Set(
      pageData.replacementCandidates.map((candidate) => candidate.id),
    );

    if (selectedCandidateId && validIds.has(selectedCandidateId)) {
      return selectedCandidateId;
    }

    return pageData.defaultReplacementCandidateId;
  }, [
    pageData.defaultReplacementCandidateId,
    pageData.replacementCandidates,
    selectedCandidateId,
  ]);

  const symbols = useMemo(
    () =>
      collectUniqueSymbols([
        ...pageData.weakPositions.map((position) => position.symbol),
        ...pageData.otherWeakPositions.map((position) => position.symbol),
        ...pageData.replacementCandidates.map((candidate) => candidate.symbol),
        ...pageData.upgradeDowngradeSignals.map((signal) => signal.symbol),
      ]),
    [pageData],
  );

  const { bundles, freshnessStatus, isLoading } = usePageStockBundles(symbols);

  const weakPositions = useMemo(
    () =>
      isLoading
        ? pageData.weakPositions
        : pageData.weakPositions.map((position) =>
            enrichWeakPosition(position, bundles),
          ),
    [bundles, isLoading, pageData.weakPositions],
  );

  const otherWeakPositions = useMemo(
    () =>
      isLoading
        ? pageData.otherWeakPositions
        : pageData.otherWeakPositions.map((position) =>
            enrichWeakPosition(position, bundles),
          ),
    [bundles, isLoading, pageData.otherWeakPositions],
  );

  const replacementCandidates = useMemo(
    () =>
      isLoading
        ? pageData.replacementCandidates
        : pageData.replacementCandidates.map((candidate) =>
            enrichReplacementCandidate(candidate, bundles),
          ),
    [bundles, isLoading, pageData.replacementCandidates],
  );

  const upgradeDowngradeSignals = useMemo(
    (): UpgradeDowngradeSignal[] =>
      pageData.upgradeDowngradeSignals.map((signal) => {
        const profile = mergeStockProfileIntoStockItem(
          {
            symbol: signal.symbol,
            companyName: signal.companyName,
            logoUrl: null,
          },
          bundles[signal.symbol],
        );

        return {
          ...signal,
          companyName: profile.companyName,
        };
      }),
    [bundles, pageData.upgradeDowngradeSignals],
  );

  const allWeakPositions = useMemo(
    () => [...weakPositions, ...otherWeakPositions],
    [otherWeakPositions, weakPositions],
  );

  const selectedWeakPosition = allWeakPositions.find(
    (position) => position.id === resolvedWeakPositionId,
  );

  const selectedCandidate = replacementCandidates.find(
    (candidate) => candidate.id === resolvedCandidateId,
  );

  const simulation = useMemo(
    () =>
      selectedCandidate
        ? calculateSwapImpact(selectedCandidate)
        : { candidateId: "", metrics: [] },
    [selectedCandidate],
  );

  const showStaleNotice =
    freshnessStatus === "mock" || freshnessStatus === "stale";

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  const handleSimulate = () => {
    setIsPreviewActive(true);
    setAnimationKey((key) => key + 1);
  };

  const handleReset = () => {
    setIsPreviewActive(false);
    setAnimationKey((key) => key + 1);
  };

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setAnimationKey((key) => key + 1);
  };

  if (isUserDataPending) {
    return (
      <PageContent>
        <SmartReplaceHeader />
        <EmptyState
          title={tStates("loading.title")}
          description={tStates("loading.description")}
        />
      </PageContent>
    );
  }

  if (pageData.isEmpty) {
    return (
      <PageContent>
        <SmartReplaceHeader />
        <EmptyState
          title={tStates("empty.title")}
          description={t("replaceHolding.empty")}
        />
      </PageContent>
    );
  }

  if (!selectedWeakPosition || !selectedCandidate) {
    return (
      <PageContent>
        <SmartReplaceHeader />
        <EmptyState
          title={tStates("empty.title")}
          description={t("replaceHolding.empty")}
        />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <MotionSection {...reveal(0)}>
        <SmartReplaceHeader />
        {showStaleNotice ? (
          <NoticeWrap>
            <StaleDataNotice
              title={tStates("stale.title")}
              description={tStates("stale.description")}
            />
          </NoticeWrap>
        ) : null}
      </MotionSection>

      <SmartReplaceSummaryGrid
        metrics={pageData.summaryMetrics}
        locale={locale}
        replayKey={animationKey}
      />

      <PageMainGrid>
        <PageColumnStack>
          <MotionSection {...reveal(5)}>
            <SmartReplaceMainComparison
              weakPosition={selectedWeakPosition}
              replacementCandidate={selectedCandidate}
              impactMetrics={simulation.metrics}
              locale={locale}
              isPreviewActive={isPreviewActive}
              animationKey={animationKey}
              onSimulate={handleSimulate}
              onReset={handleReset}
              onApplySwap={() => setIsApplyConfirmOpen(true)}
            />
          </MotionSection>

          <MotionSection {...reveal(6)}>
            <SmartReplaceCandidatesTable
              candidates={replacementCandidates}
              selectedCandidateId={selectedCandidate.id}
              locale={locale}
              onSelectCandidate={handleSelectCandidate}
            />
          </MotionSection>

          <BottomGrid>
            <MotionSection {...reveal(7)}>
              <SmartReplaceOtherWeakPositionsCard
                positions={otherWeakPositions}
                onReviewPosition={(positionId) => {
                  setSelectedWeakPositionId(positionId);
                  setIsPreviewActive(false);
                  setAnimationKey((key) => key + 1);
                }}
              />
            </MotionSection>
            <MotionSection {...reveal(8)}>
              <SmartReplaceSignalsCard signals={upgradeDowngradeSignals} />
            </MotionSection>
          </BottomGrid>
        </PageColumnStack>

        <MotionSection {...reveal(9)}>
          <SmartReplaceSidebar
            reasons={pageData.recommendationReasons}
            impactMetrics={simulation.metrics}
            aiNote={pageData.aiNote}
            locale={locale}
            isPreviewActive={isPreviewActive}
            replayKey={animationKey}
          />
        </MotionSection>
      </PageMainGrid>

      <ConfirmModal
        isOpen={isApplyConfirmOpen}
        onClose={() => setIsApplyConfirmOpen(false)}
        onConfirm={() => setIsApplyConfirmOpen(false)}
        title={tConfirm("previewOnlyTitle")}
        description={tConfirm("previewOnlyDescription")}
        confirmLabel={tConfirm("close")}
        cancelLabel={tConfirm("cancel")}
        tone="neutral"
      />
    </PageContent>
  );
};

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;

const NoticeWrap = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
`;
