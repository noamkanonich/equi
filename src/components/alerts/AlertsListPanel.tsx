"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { ErrorState } from "@/components/ui/states/ErrorState";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SkeletonCard } from "@/components/ui/states/SkeletonCard";
import type {
  AlertItem,
  AlertSortOption,
  AlertStatus,
  AlertTab,
} from "@/data/alerts/alerts.types";
import { resolveDataState, resolveListEmptyVariant } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { AlertRow } from "./AlertRow";
import { AlertsTabs } from "./AlertsTabs";

const DEV_SIMULATE_LOADING = false;
const DEV_SIMULATE_ERROR = false;

type AlertsListPanelProps = {
  alerts: AlertItem[];
  totalAlerts: number;
  tabCounts: Record<AlertTab, number>;
  activeTab: AlertTab;
  sort: AlertSortOption;
  locale: string;
  dataState?: DataState;
  onTabChange: (tab: AlertTab) => void;
  onSortChange: (sort: AlertSortOption) => void;
  onAlertStatusChange: (alertId: string, status: AlertStatus) => void;
  onClearFilters?: () => void;
};

export const AlertsListPanel = ({
  alerts,
  totalAlerts,
  tabCounts,
  activeTab,
  sort,
  locale,
  dataState,
  onTabChange,
  onSortChange,
  onAlertStatusChange,
  onClearFilters,
}: AlertsListPanelProps) => {
  const t = useTranslations("alerts");
  const tStates = useTranslations("states");
  const [localError, setLocalError] = useState(false);

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isError: DEV_SIMULATE_ERROR || localError,
    isEmpty: totalAlerts === 0,
  });

  const emptyVariant = resolveListEmptyVariant(alerts.length, totalAlerts);

  const renderListContent = () => {
    if (effectiveState === "loading") {
      return (
        <LoadingWrap>
          <SkeletonCard $bodyLines={3} />
          <SkeletonCard $bodyLines={3} />
        </LoadingWrap>
      );
    }

    if (effectiveState === "error") {
      return (
        <ErrorState
          title={tStates("error.title")}
          description={tStates("error.description")}
          retryAction={{
            label: tStates("error.retry"),
            onClick: () => setLocalError(false),
          }}
        />
      );
    }

    if (effectiveState === "empty" || emptyVariant === "none") {
      return (
        <EmptyState
          title={t("list.emptyTitle")}
          description={t("list.emptyDescription")}
        />
      );
    }

    if (emptyVariant === "filtered") {
      return (
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
      );
    }

    return alerts.map((alert, index) => (
      <AlertRow
        key={alert.id}
        alert={alert}
        index={index}
        locale={locale}
        onStatusChange={onAlertStatusChange}
      />
    ));
  };

  return (
    <Panel>
      <AlertsTabs
        activeTab={activeTab}
        counts={tabCounts}
        sort={sort}
        onTabChange={onTabChange}
        onSortChange={onSortChange}
      />
      <List aria-label={t("list.label")}>
        <ListContent>{renderListContent()}</ListContent>
      </List>
    </Panel>
  );
};

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
`;

const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
`;
