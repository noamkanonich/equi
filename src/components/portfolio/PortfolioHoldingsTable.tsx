"use client";

import { Columns3, Download, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SkeletonTable } from "@/components/ui/states/SkeletonTable";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";
import { mapHoldingsToView } from "@/data/portfolio/mappers";
import { resolveDataState, resolveListEmptyVariant } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { Link } from "@/i18n/routing";
import {
  filterPortfolioHoldings,
  type PortfolioHoldingsFilter,
} from "@/utils/portfolio/filterPortfolioHoldings";
import {
  sortPortfolioHoldings,
  type PortfolioHoldingSort,
} from "@/utils/portfolio/sortPortfolioHoldings";
import {
  DataTableCard,
  DataTableHeader,
  DataTableHeaderActions,
  DataTableTitle,
  HeadCell,
  Table,
  TableScroll,
} from "@/components/ui/DataTableShell";
import { PortfolioHoldingRow } from "./PortfolioHoldingRow";

const DEV_SIMULATE_LOADING = false;
const DEV_SIMULATE_EMPTY = false;

type PortfolioHoldingsTableProps = {
  holdings: EnrichedPortfolioHolding[];
  totalPortfolioValue: number;
  locale: string;
  dataState?: DataState;
  onAddStockClick?: () => void;
};

export const PortfolioHoldingsTable = ({
  holdings,
  totalPortfolioValue,
  locale,
  dataState,
  onAddStockClick,
}: PortfolioHoldingsTableProps) => {
  const t = useTranslations("portfolio");
  const tStates = useTranslations("states");
  const tInteractions = useTranslations("interactions");
  const [holdingsFilter, setHoldingsFilter] = useState<PortfolioHoldingsFilter>("all");
  const [sort, setSort] = useState<PortfolioHoldingSort>("symbolAsc");
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredHoldings = useMemo(() => {
    const filtered = filterPortfolioHoldings(holdings, holdingsFilter);
    return sortPortfolioHoldings(filtered, sort);
  }, [holdings, holdingsFilter, sort]);

  const holdingViews = mapHoldingsToView(filteredHoldings, totalPortfolioValue);

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: DEV_SIMULATE_EMPTY || holdings.length === 0,
  });

  const emptyVariant = resolveListEmptyVariant(
    filteredHoldings.length,
    holdings.length,
  );

  const renderTableBody = () => {
    if (effectiveState === "loading") {
      return (
        <tbody>
          <tr>
            <TableStateCell colSpan={13}>
              <SkeletonTable $rows={5} $columns={6} $showHeader={false} />
            </TableStateCell>
          </tr>
        </tbody>
      );
    }

    if (effectiveState === "empty" || emptyVariant === "none") {
      return (
        <tbody>
          <tr>
            <TableStateCell colSpan={13}>
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
            </TableStateCell>
          </tr>
        </tbody>
      );
    }

    if (emptyVariant === "filtered") {
      return (
        <tbody>
          <tr>
            <TableStateCell colSpan={13}>
              <NoResultsState
                title={tStates("noResults.title")}
                description={tStates("noResults.description")}
                clearAction={{
                  label: tStates("noResults.clearFilters"),
                  onClick: () => setHoldingsFilter("all"),
                  variant: "secondary",
                }}
              />
            </TableStateCell>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {holdingViews.map((holding) => (
          <PortfolioHoldingRow
            key={holding.id}
            holding={holding}
            locale={locale}
          />
        ))}
      </tbody>
    );
  };

  return (
    <>
      <DataTableCard>
        <DataTableHeader>
          <DataTableTitle>{t("holdings.title", { count: holdings.length })}</DataTableTitle>
          <DataTableHeaderActions>
            <Select
              aria-label={t("holdings.filterLabel")}
              value={holdingsFilter}
              onChange={(event) =>
                setHoldingsFilter(event.target.value as PortfolioHoldingsFilter)
              }
            >
              <option value="all">{t("holdings.allHoldings")}</option>
              <option value="winners">{t("holdings.winners")}</option>
              <option value="losers">{t("holdings.losers")}</option>
            </Select>
            <Select
              aria-label={t("holdings.sortLabel")}
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as PortfolioHoldingSort)
              }
            >
              <option value="symbolAsc">{t("holdings.sortSymbolAsc")}</option>
              <option value="symbolDesc">{t("holdings.sortSymbolDesc")}</option>
              <option value="scoreHigh">{t("holdings.sortScoreHigh")}</option>
              <option value="scoreLow">{t("holdings.sortScoreLow")}</option>
            </Select>
            <IconButton
              type="button"
              aria-label={t("holdings.columnsButton")}
              onClick={() => setIsColumnsOpen(true)}
            >
              <Columns3 size={16} strokeWidth={1.8} />
              {t("holdings.columnsButton")}
            </IconButton>
            <SmallIconButton
              type="button"
              aria-label={t("holdings.filterButton")}
              onClick={() =>
                setHoldingsFilter((current) =>
                  current === "all" ? "winners" : current === "winners" ? "losers" : "all",
                )
              }
            >
              <Filter size={16} strokeWidth={1.8} />
            </SmallIconButton>
            <SmallIconButton
              type="button"
              aria-label={t("holdings.downloadButton")}
              onClick={() => setIsExportOpen(true)}
            >
              <Download size={16} strokeWidth={1.8} />
            </SmallIconButton>
          </DataTableHeaderActions>
        </DataTableHeader>

        <TableScroll>
          <Table>
            <thead>
              <tr>
                <HeadCell>{t("holdings.columns.symbol")}</HeadCell>
                <HeadCell>{t("holdings.columns.company")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.shares")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.avgCost")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.currentPrice")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.dayChange")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.marketValue")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.totalReturn")}</HeadCell>
                <HeadCell $numeric>{t("holdings.columns.weight")}</HeadCell>
                <HeadCell $center>{t("holdings.columns.recentDayChanges")}</HeadCell>
                <HeadCell $center>{t("holdings.columns.score")}</HeadCell>
                <HeadCell $center>{t("holdings.columns.action")}</HeadCell>
                <HeadCell aria-label={t("holdings.columns.more")} />
              </tr>
            </thead>
            {renderTableBody()}
          </Table>
        </TableScroll>

        <FooterLink href="/portfolio">{t("actions.viewAllHoldings")}</FooterLink>
      </DataTableCard>

      <PlaceholderModal
        isOpen={isColumnsOpen}
        onClose={() => setIsColumnsOpen(false)}
        title={tInteractions("portfolio.columnsTitle")}
        description={tInteractions("portfolio.columnsDescription")}
      />

      <PlaceholderModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title={tInteractions("portfolio.exportTitle")}
        description={tInteractions("portfolio.exportDescription")}
      />
    </>
  );
};

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SmallIconButton = styled(IconButton)`
  padding: ${({ theme }) => theme.spacing.xs};
`;

const FooterLink = styled(Link)`
  display: block;
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-align: center;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }
`;

const TableStateCell = styled.td`
  padding: ${({ theme }) => theme.spacing.lg};
`;
