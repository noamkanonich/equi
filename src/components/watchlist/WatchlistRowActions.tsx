"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { PortfolioHoldingFormModal } from "@/components/portfolio/PortfolioHoldingFormModal";
import { StockNoteModal } from "@/components/stocks/StockNoteModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { RowActionsMenu, type RowActionItem } from "@/components/ui/RowActionsMenu";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import { mapWatchlistActionToVariant } from "@/data/watchlist/mappers";
import type { WatchlistItem } from "@/data/watchlist/watchlist.types";
import { useAppData } from "@/providers/useAppData";
import { Link, useRouter } from "@/i18n/routing";
import { getStockHref } from "@/utils/navigation/getStockHref";
import { getSuggestedCompetitors } from "@/utils/stocks/getSuggestedCompetitors";

type WatchlistRowActionsProps = {
  item: WatchlistItem;
  isExpanded: boolean;
  isAlertSet: boolean;
  onActionClick: () => void;
  onToggle: () => void;
  onAlertSaved?: () => void;
};

export const WatchlistRowActions = ({
  item,
  isExpanded,
  isAlertSet,
  onActionClick,
  onToggle,
  onAlertSaved,
}: WatchlistRowActionsProps) => {
  const t = useTranslations("watchlist");
  const tInteractions = useTranslations("interactions");
  const tPlaceholders = useTranslations("placeholders");
  const tConfirm = useTranslations("confirm.removeWatchlist");
  const router = useRouter();
  const { addUserAlert, removeWatchlistItem, updateWatchlistItem, getWatchlistItemBase } =
    useAppData();
  const [isSetAlertOpen, setIsSetAlertOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const baseItem = getWatchlistItemBase(item.id);
  const competitors = getSuggestedCompetitors(item.symbol);

  const rowActions = useMemo((): RowActionItem[] => {
    const actions: RowActionItem[] = [
      {
        key: "view",
        label: tInteractions("rowActions.viewDetails"),
        onClick: () => router.push(getStockHref(item.symbol)),
      },
      {
        key: "addToPortfolio",
        label: t("actions.addToPortfolio"),
        onClick: () => setIsPortfolioOpen(true),
      },
      {
        key: "setAlert",
        label: tInteractions("rowActions.setAlert"),
        onClick: () => setIsSetAlertOpen(true),
      },
      {
        key: "addNote",
        label: tInteractions("rowActions.addNote"),
        onClick: () => setIsNoteOpen(true),
      },
      {
        key: "compare",
        label: tInteractions("rowActions.compare"),
        onClick: () => setIsCompareOpen(true),
      },
      {
        key: "remove",
        label: tInteractions("rowActions.remove"),
        onClick: () => setIsRemoveOpen(true),
        destructive: true,
      },
    ];
    return actions;
  }, [item.symbol, router, t, tInteractions]);

  return (
    <>
      <ActionGroup>
        <ActionButton
          type="button"
          $variant={mapWatchlistActionToVariant(item.action)}
          $confirmed={item.action === "setAlert" && isAlertSet}
          onClick={onActionClick}
        >
          {item.action === "setAlert" && isAlertSet
            ? t("actions.alertSet")
            : t(`actions.${item.action}`)}
        </ActionButton>
        <RowActionsMenu actions={rowActions} ariaLabel={t("table.more")} />
        <ExpandButton
          type="button"
          $expanded={isExpanded}
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-label={t("table.expandRow", { symbol: item.symbol })}
        >
          <ChevronDown size={15} strokeWidth={1.9} aria-hidden />
        </ExpandButton>
      </ActionGroup>

      <SetAlertModal
        isOpen={isSetAlertOpen}
        onClose={() => setIsSetAlertOpen(false)}
        symbol={item.symbol}
        onSaved={(form) => {
          addUserAlert({ symbol: item.symbol, form });
          onAlertSaved?.();
        }}
      />

      <StockNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        symbol={item.symbol}
        mode="watchlist"
        initialHoldingNotes={baseItem?.notes ?? ""}
        onSaved={({ holdingNotes }) => {
          if (holdingNotes !== undefined) {
            updateWatchlistItem(item.id, { notes: holdingNotes });
          }
        }}
      />

      <PortfolioHoldingFormModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        mode="add"
        initialSymbol={item.symbol}
      />

      <ConfirmModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        title={tConfirm("title")}
        description={tConfirm("description", { symbol: item.symbol })}
        confirmLabel={tConfirm("confirm")}
        cancelLabel={tConfirm("cancel")}
        tone="danger"
        successTitle={tConfirm("success")}
        onConfirm={() => removeWatchlistItem(item.id)}
      />

      <PlaceholderModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        title={tPlaceholders("compare.title")}
        description={tPlaceholders("compare.description")}
        primaryLabel={tInteractions("placeholder.close")}
        onPrimary={() => router.push("/smart-replace")}
      >
        <CompetitorList>
          {competitors.map((competitor) => (
            <CompetitorLink key={competitor} href={getStockHref(competitor)} dir="ltr">
              {competitor}
            </CompetitorLink>
          ))}
        </CompetitorList>
      </PlaceholderModal>
    </>
  );
};

const ActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button<{
  $variant: "primary" | "secondary";
  $confirmed: boolean;
}>`
  min-block-size: 2.25rem;
  padding-inline: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ theme, $variant, $confirmed }) =>
      $confirmed
        ? theme.colors.status.positive
        : $variant === "primary"
          ? theme.colors.brand.primary
          : theme.colors.border.subtle};
  color: ${({ theme, $variant, $confirmed }) =>
    $confirmed
      ? theme.colors.status.positive
      : $variant === "primary"
        ? theme.colors.text.inverse
        : theme.colors.brand.primary};
  background: ${({ theme, $variant, $confirmed }) =>
    $confirmed
      ? theme.colors.status.positiveSoft
      : $variant === "primary"
        ? theme.colors.brand.primary
        : theme.colors.background.card};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-0.0625rem);
    border-color: ${({ theme, $confirmed }) =>
      $confirmed ? theme.colors.status.positive : theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ExpandButton = styled.button<{ $expanded: boolean }>`
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.muted};
  background: ${({ theme }) => theme.colors.background.card};
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.strong};
    transform: translateY(-0.0625rem);
  }

  svg {
    transform: rotate(${({ $expanded }) => ($expanded ? "180deg" : "0deg")});
    transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const CompetitorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-start: ${({ theme }) => theme.spacing.md};
`;

const CompetitorLink = styled(Link)`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  }
`;
