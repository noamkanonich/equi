"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { PageContent, PageMainGrid } from "@/components/layout/PageContent";
import { AddStockModal } from "@/components/add-stock/AddStockModal";
import { PortfolioHoldingFormModal } from "@/components/portfolio/PortfolioHoldingFormModal";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import {
  aiWatchlistInsight,
  watchlistSidebarSummary,
  watchlistSummaryMetrics,
} from "@/data/watchlist/watchlist.mock";
import {
  emptyWatchlistAiInsight,
  emptyWatchlistSidebarSummary,
  emptyWatchlistSummaryMetrics,
} from "@/data/watchlist/empty-watchlist-data";
import type { WatchlistFilters } from "@/data/watchlist/watchlist.types";
import { usePageStockBundles } from "@/hooks/usePageStockBundles";
import { useAppData } from "@/providers/useAppData";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import { deriveDataSourceSummary } from "@/utils/financial-data/deriveDataSourceSummary";
import { mergeStockProfileIntoStockItem } from "@/utils/financial-data/mergeStockProfileIntoStockItem";
import { filterWatchlistItems } from "@/utils/watchlist/filterWatchlistItems";
import { WatchlistFilterModal } from "./WatchlistFilterModal";
import { WatchlistHeader } from "./WatchlistHeader";
import { WatchlistMetricsGrid } from "./WatchlistMetricsGrid";
import { WatchlistOpportunityTable } from "./WatchlistOpportunityTable";
import { WatchlistSidebar } from "./WatchlistSidebar";

type WatchlistPageProps = {
  title: string;
  subtitle: string;
};

const defaultWatchlistFilters: WatchlistFilters = {
  statuses: [],
  actions: [],
  minimumOpportunityScore: null,
  favoritesOnly: false,
};

export const WatchlistPage = ({ title, subtitle }: WatchlistPageProps) => {
  const locale = useLocale();
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [portfolioFormStock, setPortfolioFormStock] = useState<AddStockSearchResult | null>(null);
  const [filters, setFilters] = useState<WatchlistFilters>(
    defaultWatchlistFilters,
  );

  const {
    watchlistItems,
    enrichedWatchlistItems,
    stockDataBySymbol,
    isUsingDemoPortfolio,
    isAuthenticatedDataLoading,
  } = useAppData();

  const watchlistMetrics = isUsingDemoPortfolio
    ? watchlistSummaryMetrics
    : emptyWatchlistSummaryMetrics;
  const watchlistInsight = isUsingDemoPortfolio
    ? aiWatchlistInsight
    : emptyWatchlistAiInsight;
  const baseSidebarSummary = isUsingDemoPortfolio
    ? watchlistSidebarSummary
    : emptyWatchlistSidebarSummary;

  const symbols = useMemo(
    () => collectUniqueSymbols(watchlistItems.map((item) => item.symbol)),
    [watchlistItems],
  );

  const { bundles: fetchedBundles, freshnessStatus, isLoading } =
    usePageStockBundles(symbols);

  const bundles = useMemo(
    () => ({ ...stockDataBySymbol, ...fetchedBundles }),
    [fetchedBundles, stockDataBySymbol],
  );

  const enrichedSidebarSummary = useMemo(
    () => ({
      ...baseSidebarSummary,
      bestOpportunities: baseSidebarSummary.bestOpportunities.map((item) => {
        const profile = mergeStockProfileIntoStockItem(
          {
            symbol: item.symbol,
            companyName: item.symbol,
            logoUrl: item.logoUrl,
          },
          bundles[item.symbol],
        );
        return {
          ...item,
          logoUrl: profile.logoUrl ?? item.logoUrl,
        };
      }),
      closestToBuyZone: baseSidebarSummary.closestToBuyZone.map((item) => {
        const profile = mergeStockProfileIntoStockItem(
          {
            symbol: item.symbol,
            companyName: item.symbol,
            logoUrl: item.logoUrl,
          },
          bundles[item.symbol],
        );
        return {
          ...item,
          logoUrl: profile.logoUrl ?? item.logoUrl,
        };
      }),
      upcomingEarnings: baseSidebarSummary.upcomingEarnings.map((item) => {
        const profile = mergeStockProfileIntoStockItem(
          {
            symbol: item.symbol,
            companyName: item.symbol,
            logoUrl: item.logoUrl,
          },
          bundles[item.symbol],
        );
        return {
          ...item,
          logoUrl: profile.logoUrl ?? item.logoUrl,
        };
      }),
      couldReplaceHolding: {
        ...baseSidebarSummary.couldReplaceHolding,
        candidateLogoUrl:
          mergeStockProfileIntoStockItem(
            {
              symbol: baseSidebarSummary.couldReplaceHolding.candidateSymbol,
              companyName:
                baseSidebarSummary.couldReplaceHolding.candidateSymbol,
              logoUrl:
                baseSidebarSummary.couldReplaceHolding.candidateLogoUrl,
            },
            bundles[baseSidebarSummary.couldReplaceHolding.candidateSymbol],
          ).logoUrl ??
          baseSidebarSummary.couldReplaceHolding.candidateLogoUrl,
      },
    }),
    [baseSidebarSummary, bundles],
  );

  const filteredWatchlistItems = filterWatchlistItems(
    enrichedWatchlistItems,
    filters,
  );

  const activeFilterCount =
    filters.statuses.length +
    filters.actions.length +
    (filters.minimumOpportunityScore === null ? 0 : 1) +
    (filters.favoritesOnly ? 1 : 0);

  const dataSourceSummary = useMemo(
    () => deriveDataSourceSummary(fetchedBundles, isLoading),
    [fetchedBundles, isLoading],
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
    <>
      <PageContent>
        <MotionSection {...reveal(0)}>
          <WatchlistHeader
            title={title}
            subtitle={subtitle}
            onAddStockClick={() => setIsAddStockOpen(true)}
            onFilterClick={() => setIsFilterOpen(true)}
            activeFilterCount={activeFilterCount}
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

        <WatchlistMetricsGrid
          metrics={watchlistMetrics}
          locale={locale}
          startIndex={1}
        />

        <PageMainGrid>
          <MotionSection {...reveal(7)}>
            <WatchlistOpportunityTable
              items={filteredWatchlistItems}
              totalItems={enrichedWatchlistItems.length}
              locale={locale}
              dataState={
                isAuthenticatedDataLoading || isLoading ? "loading" : undefined
              }
              onAddStockClick={() => setIsAddStockOpen(true)}
              onClearFilters={() => setFilters(defaultWatchlistFilters)}
            />
          </MotionSection>
          <MotionSection {...reveal(8)}>
            <WatchlistSidebar
              insight={watchlistInsight}
              summary={enrichedSidebarSummary}
              locale={locale}
            />
          </MotionSection>
        </PageMainGrid>
      </PageContent>

      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        defaultDestination="watchlist"
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
      <WatchlistFilterModal
        isOpen={isFilterOpen}
        filters={filters}
        onClose={() => setIsFilterOpen(false)}
        onApply={setFilters}
        onClear={() => setFilters(defaultWatchlistFilters)}
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
