"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { PageContent, PageSplitWideGrid } from "@/components/layout/PageContent";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import { useLivePortfolioData } from "@/hooks/useLivePortfolioData";
import { useAppData } from "@/providers/useAppData";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { buildLivePortfolioData } from "@/utils/portfolio/buildLivePortfolioData";
import { deriveDataSourceSummary } from "@/utils/financial-data/deriveDataSourceSummary";
import { resolvePortfolioHoldingsDataState } from "@/utils/portfolio/resolvePortfolioHoldingsDataState";
import { PortfolioHeader } from "./PortfolioHeader";
import { PortfolioMetricsGrid } from "./PortfolioMetricsGrid";
import { PortfolioPerformanceCard } from "./PortfolioPerformanceCard";
import { PortfolioAllocationCard } from "./PortfolioAllocationCard";
import { PortfolioHoldingsTable } from "./PortfolioHoldingsTable";
import { PortfolioBottomGrid } from "./PortfolioBottomGrid";
import { PortfolioHoldingFormModal } from "./PortfolioHoldingFormModal";

export const PortfolioPage = () => {
  const locale = useLocale();
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();
  const [isAddHoldingOpen, setIsAddHoldingOpen] = useState(false);

  const { isUsingDemoPortfolio, isUserDataPending } = useAppData();

  const { bundles, freshnessStatus, isLoading, isPortfolioQuotesLoading, enrichedHoldings, summary, userHoldings } =
    useLivePortfolioData();

  const holdingsDataState = resolvePortfolioHoldingsDataState(
    userHoldings.length,
    isUserDataPending || isPortfolioQuotesLoading,
  );

  const pageDataState = isUserDataPending ? "loading" : undefined;

  const portfolioData = useMemo(
    () =>
      buildLivePortfolioData({
        enrichedHoldings,
        summary,
        bundles,
        isLoading: isUserDataPending || isLoading,
        isUsingDemoPortfolio,
      }),
    [
      bundles,
      enrichedHoldings,
      isUserDataPending,
      isLoading,
      isUsingDemoPortfolio,
      summary,
    ],
  );

  const dataSourceSummary = useMemo(
    () => deriveDataSourceSummary(bundles, isLoading),
    [bundles, isLoading],
  );

  const showStaleNotice =
    userHoldings.length > 0 &&
    (freshnessStatus === "mock" || freshnessStatus === "stale");

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <>
      <PageContent>
        <MotionSection {...reveal(0)}>
          <PortfolioHeader onAddStockClick={() => setIsAddHoldingOpen(true)} />
          {showStaleNotice ? (
            <NoticeWrap>
              <StaleDataNotice
                title={tStates("stale.title")}
                description={tStates("stale.description")}
                sourceDescription={tStates(`dataSource.${dataSourceSummary.detailKey}`)}
              />
            </NoticeWrap>
          ) : null}
        </MotionSection>

        <PortfolioMetricsGrid
          metrics={portfolioData.metrics}
          holdingsCount={portfolioData.holdings.length}
          locale={locale}
          startIndex={1}
          dataState={pageDataState}
        />

        <PageSplitWideGrid>
          <MotionSection {...reveal(7)}>
            <PortfolioPerformanceCard
              data={portfolioData.performance}
              totalReturnPercent={portfolioData.summary.totalReturnPercent}
              locale={locale}
              freshnessStatus={freshnessStatus}
              dataState={pageDataState}
            />
          </MotionSection>
          <MotionSection {...reveal(8)}>
            <PortfolioAllocationCard
              segments={portfolioData.assetAllocation}
              totalValue={portfolioData.summary.totalValue}
              currency={portfolioData.summary.currency}
              locale={locale}
              dataState={pageDataState}
            />
          </MotionSection>
        </PageSplitWideGrid>

        <MotionSection {...reveal(9)}>
          <PortfolioHoldingsTable
            holdings={portfolioData.holdings}
            totalPortfolioValue={portfolioData.summary.totalValue}
            locale={locale}
            dataState={holdingsDataState}
            onAddStockClick={() => setIsAddHoldingOpen(true)}
          />
        </MotionSection>

        <PortfolioBottomGrid
          portfolioData={portfolioData}
          locale={locale}
          startIndex={10}
          dataState={pageDataState}
        />
      </PageContent>
      <PortfolioHoldingFormModal
        isOpen={isAddHoldingOpen}
        onClose={() => setIsAddHoldingOpen(false)}
        mode="add"
      />
    </>
  );
};

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;

const NoticeWrap = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
`;
