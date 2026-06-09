"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { MiniTrendChart } from "@/components/charts/MiniTrendChart";
import { HoldingRecentDayChanges } from "./HoldingRecentDayChanges";
import { ActionBadge } from "@/components/ui/ActionBadge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StockLogo } from "@/components/ui/StockLogo";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { ErrorState } from "@/components/ui/states/ErrorState";
import { SkeletonTable } from "@/components/ui/states/SkeletonTable";
import { Link, useRouter } from "@/i18n/routing";
import { mapHoldingsToView } from "@/data/dashboard/mappers";
import { resolveDataState } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { mapScoreToBadgeTone } from "@/utils/scoring/mappers";
import type {
  DashboardHolding,
  DashboardTrendTone,
} from "@/data/dashboard/dashboard.types";
import { SOFT_EASE } from "@/utils/motion/transitions";
import { HoldingRowActionsMenu } from "@/components/ui/HoldingRowActionsMenu";
import {
  Cell,
  DataTableCard,
  DataTableHeader,
  DataTableHeaderActions,
  DataTableTitle,
  EllipsisText,
  HeadCell,
  Table,
  TableRow,
  TableScroll,
} from "@/components/ui/DataTableShell";
import { DashboardHoldingsCards } from "./DashboardHoldingsCards";

const DEV_SIMULATE_LOADING = false;
const DEV_SIMULATE_ERROR = false;
const DEV_SIMULATE_EMPTY = false;

type DashboardHoldingsTableProps = {
  holdings: DashboardHolding[];
  locale: string;
  dataState?: DataState;
  onAddStockClick?: () => void;
};

export const DashboardHoldingsTable = ({
  holdings,
  locale,
  dataState,
  onAddStockClick,
}: DashboardHoldingsTableProps) => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tStates = useTranslations("states");
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<DashboardHoldingsViewMode>("table");
  const [localError, setLocalError] = useState(false);
  const holdingViews = mapHoldingsToView(holdings);

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isError: DEV_SIMULATE_ERROR || localError,
    isEmpty: DEV_SIMULATE_EMPTY || holdings.length === 0,
  });

  const renderContent = () => {
    if (effectiveState === "loading") {
      return <SkeletonTable $rows={5} $columns={8} />;
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

    if (effectiveState === "empty") {
      return (
        <EmptyState
          title={tStates("empty.title")}
          description={tStates("empty.description")}
          primaryAction={
            onAddStockClick
              ? {
                  label: tStates("empty.addStock"),
                  onClick: onAddStockClick,
                }
              : undefined
          }
        />
      );
    }

    if (viewMode === "table") {
      return (
        <TableScroll>
          <Table $minInlineSize="86rem">
            <thead>
              <tr>
                <HeadCell>{t("holdings.columns.symbol")}</HeadCell>
                <HeadCell>{t("holdings.columns.company")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.shares")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.avgCost")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.currentPrice")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.dayChange")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.marketValue")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.gainLoss")}</HeadCell>
                <HeadCell $center>{t("holdings.columns.score")}</HeadCell>
                <HeadCell $center>{t("holdings.columns.action")}</HeadCell>
                <HeadCell $center>{t("holdings.columns.recentDayChanges")}</HeadCell>
                <HeadCell $center>{t("holdings.columns.trend")}</HeadCell>
                <HeadCell aria-label={t("holdings.columns.more")} />
              </tr>
            </thead>
            <tbody>
              {holdingViews.map((holding) => (
                <TableRow
                  key={holding.symbol}
                  $clickable
                  onClick={() => router.push(`/stocks/${holding.symbol}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/stocks/${holding.symbol}`);
                    }
                  }}
                  tabIndex={0}
                  role="link"
                  aria-label={holding.symbol}
                >
                  <Cell>
                    <SymbolWrap dir="ltr">
                      <StockLogo
                        symbol={holding.symbol}
                        companyName={holding.companyName}
                        logoUrl={holding.logoUrl}
                      />
                      <Symbol>{holding.symbol}</Symbol>
                    </SymbolWrap>
                  </Cell>
                  <Cell>
                    <Company>{holding.companyName}</Company>
                  </Cell>
                  <Cell $numeric>{holding.shares}</Cell>
                  <Cell $numeric>
                    <DisplayMoney
                      amount={holding.avgCost}
                      currency={holding.currency}
                      locale={locale}
                    />
                  </Cell>
                  <Cell $numeric>
                    <DisplayMoney
                      amount={holding.currentPrice}
                      currency={holding.currency}
                      locale={locale}
                    />
                  </Cell>
                  <ToneCell $numeric $tone={holding.tone}>
                    {formatPercent(holding.dayChangePercent, { locale })}
                  </ToneCell>
                  <Cell $numeric>
                    <DisplayMoney
                      amount={holding.marketValue}
                      currency={holding.currency}
                      locale={locale}
                    />
                  </Cell>
                  <ToneCell
                    $numeric
                    $tone={holding.gainLossPercent >= 0 ? "positive" : "negative"}
                  >
                    {formatPercent(holding.gainLossPercent, { locale })}
                  </ToneCell>
                  <Cell $center>
                    <ScoreBadge
                      score={holding.score}
                      $tone={mapScoreToBadgeTone(holding.score)}
                    />
                  </Cell>
                  <Cell $center>
                    <ActionBadge action={holding.suggestedAction}>
                      {tCommon(holding.suggestedAction)}
                    </ActionBadge>
                  </Cell>
                  <Cell $center>
                    <RecentChangesSlot>
                      <HoldingRecentDayChanges
                        changes={holding.recentDayChanges}
                        locale={locale}
                        compact
                      />
                    </RecentChangesSlot>
                  </Cell>
                  <Cell $center>
                    <TrendSlot>
                      <MiniTrendChart
                        data={holding.trend}
                        tone={holding.tone}
                        height={30}
                      />
                    </TrendSlot>
                  </Cell>
                  <Cell $center>
                    <HoldingRowActionsMenu
                      symbol={holding.symbol}
                      holdingId={holding.id}
                      ariaLabel={t("holdings.columns.more")}
                    />
                  </Cell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      );
    }

    return <DashboardHoldingsCards holdingViews={holdingViews} locale={locale} />;
  };

  return (
    <DataTableCard>
      <DataTableHeader>
        <DataTableTitle>{t("holdings.title")}</DataTableTitle>
        <DataTableHeaderActions>
          <SegmentGroup aria-label={t("holdings.viewMode")}>
            <SegmentButton
              type="button"
              $active={viewMode === "table"}
              aria-pressed={viewMode === "table"}
              onClick={() => setViewMode("table")}
            >
              {t("holdings.table")}
            </SegmentButton>
            <SegmentButton
              type="button"
              $active={viewMode === "cards"}
              aria-pressed={viewMode === "cards"}
              onClick={() => setViewMode("cards")}
            >
              {t("holdings.cards")}
            </SegmentButton>
          </SegmentGroup>
          <ViewAllLink href="/portfolio">{t("actions.viewAll")}</ViewAllLink>
        </DataTableHeaderActions>
      </DataTableHeader>

      <ContentFrame>
        <AnimatePresence mode="wait" initial={false}>
          <ViewPanel
            key={`${viewMode}-${effectiveState}`}
            initial={prefersReducedMotion ? false : "hidden"}
            animate="show"
            exit={prefersReducedMotion ? undefined : "exit"}
            variants={viewPanelVariants}
          >
            {renderContent()}
          </ViewPanel>
        </AnimatePresence>
      </ContentFrame>
    </DataTableCard>
  );
};

type DashboardHoldingsViewMode = "table" | "cards";

const viewPanelVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: SOFT_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.16,
      ease: SOFT_EASE,
    },
  },
};

const SegmentGroup = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
`;

const SegmentButton = styled.button<{ $active?: boolean }>`
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.background.card : "transparent"};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  box-shadow: ${({ theme, $active }) =>
    $active ? theme.colors.shadow.soft : "none"};
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-block-size: 2rem;
  padding-inline: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.background.card};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const ContentFrame = styled.div`
  min-block-size: 1px;
`;

const ViewPanel = styled(motion.div)`
  min-inline-size: 0;
`;

const ToneCell = styled(Cell)<{ $tone: DashboardTrendTone }>`
  color: ${({ theme, $tone }) =>
    $tone === "negative"
      ? theme.colors.status.negative
      : $tone === "positive"
        ? theme.colors.status.positive
        : theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const SymbolWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Company = styled(EllipsisText)`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RecentChangesSlot = styled.div`
  min-inline-size: 15rem;
`;

const TrendSlot = styled.div`
  inline-size: 5.25rem;
`;

