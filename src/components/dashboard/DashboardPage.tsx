"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { PageContent } from "@/components/layout/PageContent";
import { AddStockModal } from "@/components/add-stock/AddStockModal";
import { PortfolioHoldingFormModal } from "@/components/portfolio/PortfolioHoldingFormModal";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import { dashboardMockData } from "@/data/dashboard/dashboard.mock";
import { useDashboardMetricsReplayKey } from "@/hooks/useDashboardMetricsReplayKey";
import { useLivePortfolioData } from "@/hooks/useLivePortfolioData";
import { useAppData } from "@/providers/useAppData";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { buildLiveDashboardData } from "@/utils/dashboard/buildLiveDashboardData";
import { deriveDataSourceSummary } from "@/utils/financial-data/deriveDataSourceSummary";
import { resolvePortfolioHoldingsDataState } from "@/utils/portfolio/resolvePortfolioHoldingsDataState";
import { logDashboardPortfolioHoldingsCount } from "@/utils/app-data/devAppDataLog";
import { DashboardBottomGrid } from "./DashboardBottomGrid";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardHoldingsTable } from "./DashboardHoldingsTable";
import { DashboardInsightsGrid } from "./DashboardInsightsGrid";
import { DashboardMetrics } from "./DashboardMetrics";

export const DashboardPage = () => {
  const locale = useLocale();
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [portfolioFormStock, setPortfolioFormStock] = useState<AddStockSearchResult | null>(null);

  const { isUsingDemoPortfolio, isAuthenticatedDataLoading } = useAppData();

  const demoExtraSymbols = useMemo(
    () =>
      isUsingDemoPortfolio
        ? [
            ...dashboardMockData.recentActivities.map((activity) => activity.symbol),
            ...dashboardMockData.upcomingEarnings.map((earning) => earning.symbol),
          ]
        : [],
    [isUsingDemoPortfolio],
  );

  const {
    bundles,
    freshnessStatus,
    isLoading,
    isPortfolioQuotesLoading,
    enrichedHoldings,
    summary,
    userHoldings,
  } = useLivePortfolioData({
    extraSymbols: demoExtraSymbols,
  });

  useEffect(() => {
    logDashboardPortfolioHoldingsCount(userHoldings.length);
  }, [userHoldings.length]);

  const metricsReplayKey = useDashboardMetricsReplayKey(userHoldings.length);

  const holdingsDataState = resolvePortfolioHoldingsDataState(
    userHoldings.length,
    isAuthenticatedDataLoading || isPortfolioQuotesLoading,
  );

  const dashboardData = useMemo(
    () =>
      buildLiveDashboardData({
        enrichedHoldings,
        summary,
        bundles,
        isLoading: isAuthenticatedDataLoading || isLoading,
        isUsingDemoPortfolio,
      }),
    [
      bundles,
      enrichedHoldings,
      isAuthenticatedDataLoading,
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

  const insightsDataState = isAuthenticatedDataLoading ? "loading" : undefined;

  const metricsStart = 1;
  const holdingsIndex = metricsStart + dashboardData.metrics.length;
  const insightsStart = holdingsIndex + 1;
  const bottomStart = insightsStart + 4;

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
          <DashboardHeader onAddStockClick={() => setIsAddStockOpen(true)} />
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
        <DashboardMetrics
          metrics={dashboardData.metrics}
          locale={locale}
          startIndex={metricsStart}
          replayKey={metricsReplayKey}
        />
        <MotionSection {...reveal(holdingsIndex)}>
          <DashboardHoldingsTable
            holdings={dashboardData.holdings}
            locale={locale}
            dataState={holdingsDataState}
            onAddStockClick={() => setIsAddStockOpen(true)}
          />
        </MotionSection>
        <DashboardInsightsGrid
          dashboardData={dashboardData}
          locale={locale}
          freshnessStatus={freshnessStatus}
          startIndex={insightsStart}
          dataState={insightsDataState}
        />
        <DashboardBottomGrid
          dashboardData={dashboardData}
          locale={locale}
          startIndex={bottomStart}
        />
      </PageContent>
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onAddToPortfolio={(stock) => {
          setIsAddStockOpen(false);
          setPortfolioFormStock(stock);
        }}
      />
      <PortfolioHoldingFormModal
        isOpen={portfolioFormStock !== null}
        onClose={() => setPortfolioFormStock(null)}
        mode="add"
        initialStock={portfolioFormStock ?? undefined}
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
