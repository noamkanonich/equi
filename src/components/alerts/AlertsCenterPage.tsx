"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { PageContent, PageMainGrid } from "@/components/layout/PageContent";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import {
  alertQuickFilters,
  defaultAlertFilters,
} from "@/data/alerts/alerts.mock";
import type {
  AlertQuickFilterKey,
  AlertSortOption,
  AlertStatus,
  AlertTab,
} from "@/data/alerts/alerts.types";
import { getAlertTabCounts } from "@/data/alerts/mappers";
import { usePageStockBundles } from "@/hooks/usePageStockBundles";
import { useAppData } from "@/providers/useAppData";
import { useAlertSettingsStore } from "@/store/alert-settings.store";
import { applyAlertSettingsToAlerts } from "@/utils/alerts/applyAlertSettingsToAlerts";
import {
  buildAlertQuickFilters,
  buildAlertSummaryBreakdown,
  buildAlertSummaryMetrics,
} from "@/utils/alerts/buildAlertDashboardData";
import { filterAlerts } from "@/utils/alerts/filterAlerts";
import { sortAlerts } from "@/utils/alerts/sortAlerts";
import { collectUniqueSymbols } from "@/utils/financial-data/collectUniqueSymbols";
import { deriveDataSourceSummary } from "@/utils/financial-data/deriveDataSourceSummary";
import { enrichAlertWithBundle } from "@/utils/financial-data/enrichAlertWithBundle";
import { buildMergedAlerts } from "@/utils/alerts/buildMergedAlerts";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { AlertsCenterHeader } from "./AlertsCenterHeader";
import { AlertsListPanel } from "./AlertsListPanel";
import { AlertsRightSidebar } from "./AlertsRightSidebar";
import { AlertsSummaryGrid } from "./AlertsSummaryGrid";

type AlertsCenterPageProps = {
  title: string;
  subtitle: string;
};

export const AlertsCenterPage = ({ title, subtitle }: AlertsCenterPageProps) => {
  const locale = useLocale();
  const t = useTranslations("alerts");
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();
  const alertSettings = useAlertSettingsStore((state) => state.alertSettings);

  const [activeTab, setActiveTab] = useState<AlertTab>(defaultAlertFilters.tab);
  const [sort, setSort] = useState<AlertSortOption>(defaultAlertFilters.sort);
  const [searchQuery, setSearchQuery] = useState(defaultAlertFilters.searchQuery);
  const [activeQuickFilter, setActiveQuickFilter] = useState<AlertQuickFilterKey | null>(
    defaultAlertFilters.quickFilterKey,
  );

  const {
    userCreatedAlerts,
    alertStatusOverrides,
    setAlertStatus,
    snoozedAlertsCount,
    isUsingDemoPortfolio,
    isUserDataPending,
  } = useAppData();

  const baseAlertItems = useMemo(
    () =>
      buildMergedAlerts({
        userCreatedAlerts,
        alertStatusOverrides,
        includeDemoAlerts: isUsingDemoPortfolio,
      }),
    [alertStatusOverrides, isUsingDemoPortfolio, userCreatedAlerts],
  );

  const settingsFilteredBaseAlertItems = useMemo(
    () => applyAlertSettingsToAlerts(baseAlertItems, alertSettings),
    [alertSettings, baseAlertItems],
  );

  const symbols = useMemo(
    () =>
      collectUniqueSymbols([
        ...settingsFilteredBaseAlertItems.map((alert) => alert.symbol),
      ]),
    [settingsFilteredBaseAlertItems],
  );

  const { bundles, freshnessStatus, isLoading } = usePageStockBundles(symbols);

  const alertItems = useMemo(() => {
    return settingsFilteredBaseAlertItems.map((alert) => {
      const enriched = isLoading
        ? alert
        : enrichAlertWithBundle(
            alert,
            alert.symbol ? bundles[alert.symbol] : undefined,
          );

      return enriched;
    });
  }, [bundles, isLoading, settingsFilteredBaseAlertItems]);

  const searchKeys = useMemo(() => {
    const keys: Record<string, string> = {};
    alertItems.forEach((alert) => {
      keys[alert.titleKey] = t(alert.titleKey);
      keys[alert.descriptionKey] = t(alert.descriptionKey);
    });
    return keys;
  }, [alertItems, t]);

  const tabCounts = useMemo(() => getAlertTabCounts(alertItems), [alertItems]);
  const summaryMetrics = useMemo(
    () => buildAlertSummaryMetrics(alertItems),
    [alertItems],
  );
  const summaryBreakdown = useMemo(
    () => buildAlertSummaryBreakdown(alertItems),
    [alertItems],
  );
  const quickFilters = useMemo(
    () => buildAlertQuickFilters(alertItems, alertQuickFilters),
    [alertItems],
  );

  const filteredAlerts = useMemo(() => {
    const filtered = filterAlerts(
      alertItems,
      {
        searchQuery,
        quickFilterKey: activeQuickFilter,
        tab: activeTab,
        sort,
      },
      quickFilters,
      searchKeys,
    );
    return sortAlerts(filtered, sort);
  }, [activeQuickFilter, activeTab, alertItems, quickFilters, searchKeys, searchQuery, sort]);

  const handleAlertStatusChange = useCallback(
    (alertId: string, status: AlertStatus) => {
      setAlertStatus(alertId, status);
    },
    [setAlertStatus],
  );

  const handleHeaderFilterClick = () => {
    setActiveQuickFilter((current) =>
      current === "highPriority" ? null : "highPriority",
    );
    if (activeTab === "dismissed") {
      setActiveTab("allAlerts");
    }
  };

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  const handleTabChange = (tab: AlertTab) => {
    setActiveTab(tab);
    setActiveQuickFilter(null);
  };

  const handleFilterClick = (key: AlertQuickFilterKey) => {
    setActiveQuickFilter((current) => (current === key ? null : key));
    if (activeTab === "dismissed") {
      setActiveTab("allAlerts");
    }
  };

  const handleClearFilters = () => {
    setActiveQuickFilter(null);
    setSearchQuery("");
  };

  const handleViewSnoozed = () => {
    setActiveTab("snoozed");
    setActiveQuickFilter(null);
  };

  const snoozedSummary = useMemo(
    () => ({ count: snoozedAlertsCount }),
    [snoozedAlertsCount],
  );

  const dataSourceSummary = useMemo(
    () => deriveDataSourceSummary(bundles, isLoading),
    [bundles, isLoading],
  );

  const showStaleNotice =
    freshnessStatus === "mock" || freshnessStatus === "stale";

  return (
    <PageContent>
      <MotionSection {...reveal(0)}>
        <AlertsCenterHeader
          title={title}
          subtitle={subtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleHeaderFilterClick}
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

      <AlertsSummaryGrid
        metrics={summaryMetrics}
        locale={locale}
        startIndex={1}
      />

      <PageMainGrid>
        <MotionSection {...reveal(7)}>
          <AlertsListPanel
            alerts={filteredAlerts}
            totalAlerts={alertItems.length}
            tabCounts={tabCounts}
            activeTab={activeTab}
            sort={sort}
            locale={locale}
            dataState={isUserDataPending ? "loading" : undefined}
            onTabChange={handleTabChange}
            onSortChange={setSort}
            onAlertStatusChange={handleAlertStatusChange}
            onClearFilters={handleClearFilters}
          />
        </MotionSection>
        <MotionSection {...reveal(8)}>
          <AlertsRightSidebar
            breakdown={summaryBreakdown}
            quickFilters={quickFilters}
            snoozedSummary={snoozedSummary}
            activeFilterKey={activeQuickFilter}
            locale={locale}
            onFilterClick={handleFilterClick}
            onClearFilters={handleClearFilters}
            onViewSnoozed={handleViewSnoozed}
          />
        </MotionSection>
      </PageMainGrid>
    </PageContent>
  );
};

const MotionSection = styled(motion.section)`
  min-inline-size: 0;
`;

const NoticeWrap = styled.div`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
`;
