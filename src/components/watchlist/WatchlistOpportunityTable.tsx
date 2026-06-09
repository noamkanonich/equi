"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SkeletonTable } from "@/components/ui/states/SkeletonTable";
import type { WatchlistItem } from "@/data/watchlist/watchlist.types";
import { resolveDataState, resolveListEmptyVariant } from "@/data/ui/mappers";
import type { DataState } from "@/data/ui/ui-state.types";
import { WatchlistOpportunityRow } from "./WatchlistOpportunityRow";

const DEV_SIMULATE_LOADING = false;
const DEV_SIMULATE_EMPTY = false;

type WatchlistOpportunityTableProps = {
  items: WatchlistItem[];
  totalItems: number;
  locale: string;
  dataState?: DataState;
  onAddStockClick?: () => void;
  onClearFilters?: () => void;
};

export const WatchlistOpportunityTable = ({
  items,
  totalItems,
  locale,
  dataState,
  onAddStockClick,
  onClearFilters,
}: WatchlistOpportunityTableProps) => {
  const t = useTranslations("watchlist");
  const tStates = useTranslations("states");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(
    items[0]?.id ?? null,
  );
  const visibleExpandedItemId =
    expandedItemId && items.some((item) => item.id === expandedItemId)
      ? expandedItemId
      : items[0]?.id ?? null;

  const effectiveState = resolveDataState({
    explicitState: dataState,
    isLoading: DEV_SIMULATE_LOADING,
    isEmpty: DEV_SIMULATE_EMPTY || totalItems === 0,
  });

  const emptyVariant = resolveListEmptyVariant(items.length, totalItems);

  const renderBody = () => {
    if (effectiveState === "loading") {
      return (
        <tbody>
          <tr>
            <StateCell colSpan={11}>
              <SkeletonTable $rows={4} $columns={6} $showHeader={false} />
            </StateCell>
          </tr>
        </tbody>
      );
    }

    if (effectiveState === "empty" || emptyVariant === "none") {
      return (
        <tbody>
          <tr>
            <StateCell colSpan={11}>
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
            </StateCell>
          </tr>
        </tbody>
      );
    }

    if (emptyVariant === "filtered") {
      return (
        <tbody>
          <tr>
            <StateCell colSpan={11}>
              <NoResultsState
                title={tStates("noResults.title")}
                description={t("filters.empty")}
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
            </StateCell>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {items.map((item) => (
          <WatchlistOpportunityRow
            key={item.id}
            item={item}
            locale={locale}
            isExpanded={visibleExpandedItemId === item.id}
            onToggle={() =>
              setExpandedItemId(
                visibleExpandedItemId === item.id ? null : item.id,
              )
            }
          />
        ))}
      </tbody>
    );
  };

  return (
    <Card>
      <Header>
        <Title>{t("table.title")}</Title>
        <Meta>
          {items.length === totalItems
            ? t("table.subtitle")
            : t("table.filteredSubtitle", {
                count: items.length,
                total: totalItems,
              })}
        </Meta>
      </Header>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <HeadCell $center>{t("table.favorite")}</HeadCell>
              <HeadCell>{t("table.symbol")}</HeadCell>
              <HeadCell>{t("table.company")}</HeadCell>
              <HeadCell $numeric>{t("table.currentPrice")}</HeadCell>
              <HeadCell $numeric>{t("table.buyZone")}</HeadCell>
              <HeadCell $numeric>{t("table.distanceToBuyZone")}</HeadCell>
              <HeadCell $center>{t("table.qualityScore")}</HeadCell>
              <HeadCell $center>{t("table.opportunityScore")}</HeadCell>
              <HeadCell $center>{t("table.status")}</HeadCell>
              <HeadCell>{t("table.triggerToAct")}</HeadCell>
              <HeadCell $center>{t("table.action")}</HeadCell>
            </tr>
          </thead>
          {renderBody()}
        </Table>
      </TableScroll>
    </Card>
  );
};

const alignmentStyles = css<{ $numeric?: boolean; $center?: boolean }>`
  text-align: ${({ $numeric, $center }) =>
    $center ? "center" : $numeric ? "end" : "start"};
`;

const Card = styled.section`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border.strong} transparent;
`;

const Table = styled.table`
  inline-size: 100%;
  min-inline-size: 70rem;
  border-collapse: collapse;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    min-inline-size: 64rem;
  }
`;

const HeadCell = styled.th<{ $numeric?: boolean; $center?: boolean }>`
  ${alignmentStyles}
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const StateCell = styled.td`
  padding: ${({ theme }) => theme.spacing.lg};
`;
