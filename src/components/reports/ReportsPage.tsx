"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AddStockModal } from "@/components/add-stock/AddStockModal";
import { PortfolioHoldingFormModal } from "@/components/portfolio/PortfolioHoldingFormModal";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import { PageContent } from "@/components/layout/PageContent";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import type { ReportBenchmarkKey, ReportPeriodKey, ReportTabKey } from "@/data/reports/reports.types";
import { useLivePortfolioData } from "@/hooks/useLivePortfolioData";
import { useAppData } from "@/providers/useAppData";
import { deriveDataSourceSummary } from "@/utils/financial-data/deriveDataSourceSummary";
import { buildReportsPageData } from "@/utils/reports/buildReportsPageData";
import { logReportsPortfolioHoldingsCount, logReportsPortfolioSource } from "@/utils/app-data/devAppDataLog";
import {
  buildPerformanceSeries,
  getPerformancePointsForBenchmark,
} from "@/utils/reports/buildPerformanceSeries";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { ReportPlaceholderModal } from "./ReportPlaceholderModal";
import { ReportsActivityTab } from "./ReportsActivityTab";
import { ReportsAllocationTab } from "./ReportsAllocationTab";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsHoldingsTab } from "./ReportsHoldingsTab";
import { ReportsOverviewTab } from "./ReportsOverviewTab";
import { ReportsPerformanceTab } from "./ReportsPerformanceTab";
import { ReportsRiskTab } from "./ReportsRiskTab";
import { ReportsTabs } from "./ReportsTabs";
import { ReportsTaxesTab } from "./ReportsTaxesTab";

type ReportsPageProps = {
  title: string;
  subtitle: string;
};

type PlaceholderModalState = "export" | "download" | null;

export const ReportsPage = ({ title, subtitle }: ReportsPageProps) => {
  const locale = useLocale();
  const t = useTranslations("reports");
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState<ReportTabKey>("overview");
  const [period, setPeriod] = useState<ReportPeriodKey>("oneYear");
  const [benchmark, setBenchmark] = useState<ReportBenchmarkKey>("sp500");
  const [placeholderModal, setPlaceholderModal] = useState<PlaceholderModalState>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [portfolioFormStock, setPortfolioFormStock] = useState<AddStockSearchResult | null>(null);

  const handleAddToPortfolio = (stock: AddStockSearchResult) => {
    setIsAddStockOpen(false);
    setPortfolioFormStock(stock);
  };
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { refreshStockDataForSymbols, isUsingDemoPortfolio, isUserDataPending } =
    useAppData();
  const { enrichedHoldings, summary, freshnessStatus, isPortfolioQuotesLoading, userHoldings, bundles } =
    useLivePortfolioData();

  useEffect(() => {
    logReportsPortfolioHoldingsCount(userHoldings.length);
    logReportsPortfolioSource(
      isUserDataPending ? "loading" : userHoldings.length === 0 ? "empty" : "app-data",
    );
  }, [isUserDataPending, userHoldings.length]);

  const hasHoldings = userHoldings.length > 0;
  const dataState = isRefreshing || isUserDataPending ? "loading" : undefined;

  const pageData = useMemo(
    () =>
      buildReportsPageData({
        holdings: enrichedHoldings,
        summary,
        period,
        freshnessStatus,
        hasHoldings,
        isUsingDemoPortfolio,
        bundles,
      }),
    [bundles, enrichedHoldings, freshnessStatus, hasHoldings, isUsingDemoPortfolio, period, summary],
  );

  const performanceSeries = useMemo(() => {
    const points = getPerformancePointsForBenchmark(
      pageData.performanceByBenchmark,
      benchmark,
    );
    return buildPerformanceSeries(points, period);
  }, [benchmark, pageData.performanceByBenchmark, period]);

  const dataSourceSummary = useMemo(
    () => deriveDataSourceSummary(bundles, isPortfolioQuotesLoading || isRefreshing),
    [bundles, isPortfolioQuotesLoading, isRefreshing],
  );

  const showStaleNotice =
    hasHoldings &&
    (freshnessStatus === "mock" || freshnessStatus === "stale");

  const handleRefresh = useCallback(async () => {
    const symbols = userHoldings.map((holding) => holding.symbol);
    if (symbols.length === 0) {
      return;
    }

    setIsRefreshing(true);
    try {
      await refreshStockDataForSymbols(symbols);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshStockDataForSymbols, userHoldings]);

  const handleViewAllReports = useCallback(() => {
    document.getElementById("available-reports")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [prefersReducedMotion]);

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  if (!hasHoldings) {
    if (isUserDataPending) {
      return (
        <PageContent>
          <MotionSection {...reveal(0)}>
            <ReportsHeader
              title={title}
              subtitle={subtitle}
              period={period}
              onPeriodChange={setPeriod}
              freshnessStatus={freshnessStatus}
              isRefreshing={isRefreshing}
              onExport={() => setPlaceholderModal("export")}
              onRefresh={handleRefresh}
            />
          </MotionSection>
          <MotionSection {...reveal(1)}>
            <EmptyState
              title={tStates("loading.title")}
              description={tStates("loading.portfolio")}
            />
          </MotionSection>
        </PageContent>
      );
    }

    return (
      <>
        <PageContent>
          <MotionSection {...reveal(0)}>
            <ReportsHeader
              title={title}
              subtitle={subtitle}
              period={period}
              onPeriodChange={setPeriod}
              freshnessStatus={freshnessStatus}
              isRefreshing={isRefreshing}
              onExport={() => setPlaceholderModal("export")}
              onRefresh={handleRefresh}
            />
          </MotionSection>
          <MotionSection {...reveal(1)}>
            <EmptyState
              title={t("empty.title")}
              description={t("empty.description")}
              primaryAction={{
                label: t("empty.addHolding"),
                onClick: () => setIsAddStockOpen(true),
              }}
            />
          </MotionSection>
        </PageContent>
        <ReportPlaceholderModal
          isOpen={placeholderModal !== null}
          onClose={() => setPlaceholderModal(null)}
          variant={placeholderModal === "download" ? "download" : "export"}
        />
        <AddStockModal
          isOpen={isAddStockOpen}
          onClose={() => setIsAddStockOpen(false)}
          onAddToPortfolio={handleAddToPortfolio}
        />
        <PortfolioHoldingFormModal
          isOpen={portfolioFormStock !== null}
          onClose={() => setPortfolioFormStock(null)}
          mode="add"
          initialStock={portfolioFormStock ?? undefined}
        />
      </>
    );
  }

  return (
    <>
      <PageContent>
        <MotionSection {...reveal(0)}>
          <ReportsHeader
            title={title}
            subtitle={subtitle}
            period={period}
            onPeriodChange={setPeriod}
            freshnessStatus={freshnessStatus}
            isRefreshing={isRefreshing}
            onExport={() => setPlaceholderModal("export")}
            onRefresh={handleRefresh}
          />
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
        <MotionSection {...reveal(1)}>
          <ReportsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </MotionSection>
        <MotionSection {...reveal(2)}>
          {activeTab === "overview" ? (
            <ReportsOverviewTab
              pageData={pageData}
              performanceSeries={performanceSeries}
              benchmark={benchmark}
              onBenchmarkChange={setBenchmark}
              locale={locale}
              monthLabel={t("monthly.currentMonth")}
              dataState={dataState}
              onDownload={() => setPlaceholderModal("download")}
              onViewAllReports={handleViewAllReports}
            />
          ) : activeTab === "performance" ? (
            <ReportsPerformanceTab
              pageData={pageData}
              performanceSeries={performanceSeries}
              benchmark={benchmark}
              onBenchmarkChange={setBenchmark}
              locale={locale}
              monthLabel={t("monthly.currentMonth")}
              dataState={dataState}
            />
          ) : activeTab === "allocation" ? (
            <ReportsAllocationTab
              pageData={pageData}
              locale={locale}
              dataState={dataState}
            />
          ) : activeTab === "holdings" ? (
            <ReportsHoldingsTab
              pageData={pageData}
              enrichedHoldings={enrichedHoldings}
              locale={locale}
              dataState={dataState}
            />
          ) : activeTab === "risk" ? (
            <ReportsRiskTab
              pageData={pageData}
              locale={locale}
              dataState={dataState}
            />
          ) : activeTab === "taxes" ? (
            <ReportsTaxesTab
              pageData={pageData}
              locale={locale}
              dataState={dataState}
            />
          ) : activeTab === "activity" ? (
            <ReportsActivityTab
              pageData={pageData}
              locale={locale}
              dataState={dataState}
            />
          ) : null}
        </MotionSection>
      </PageContent>
      <ReportPlaceholderModal
        isOpen={placeholderModal !== null}
        onClose={() => setPlaceholderModal(null)}
        variant={placeholderModal === "download" ? "download" : "export"}
      />
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onAddToPortfolio={handleAddToPortfolio}
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
