"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { StockNoteModal } from "@/components/stocks/StockNoteModal";
import { PortfolioHoldingFormModal } from "@/components/portfolio/PortfolioHoldingFormModal";
import { RemoveHoldingConfirmModal } from "@/components/portfolio/RemoveHoldingConfirmModal";
import { RowActionsMenu, type RowActionItem } from "@/components/ui/RowActionsMenu";
import { useRouter } from "@/i18n/routing";
import { useAppData } from "@/providers/useAppData";
import { getStockHref } from "@/utils/navigation/getStockHref";

type HoldingRowActionsMenuProps = {
  symbol: string;
  holdingId?: string;
  ariaLabel?: string;
};

export const HoldingRowActionsMenu = ({
  symbol,
  holdingId,
  ariaLabel,
}: HoldingRowActionsMenuProps) => {
  const t = useTranslations("interactions");
  const tPortfolio = useTranslations("portfolio.actions");
  const router = useRouter();
  const { addUserAlert, enrichedPortfolioHoldings, updatePortfolioHoldingNotes } =
    useAppData();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSetAlertOpen, setIsSetAlertOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const holding = useMemo(() => {
    if (holdingId) {
      return enrichedPortfolioHoldings.find((item) => item.id === holdingId);
    }
    return enrichedPortfolioHoldings.find(
      (item) => item.symbol === symbol.trim().toUpperCase(),
    );
  }, [enrichedPortfolioHoldings, holdingId, symbol]);

  const actions = useMemo(
    (): RowActionItem[] => [
      {
        key: "view",
        label: t("rowActions.viewDetails"),
        onClick: () => router.push(getStockHref(symbol)),
      },
      {
        key: "edit",
        label: tPortfolio("editHolding"),
        onClick: () => setIsEditOpen(true),
        disabled: !holding,
      },
      {
        key: "setAlert",
        label: t("rowActions.setAlert"),
        onClick: () => setIsSetAlertOpen(true),
      },
      {
        key: "addNote",
        label: t("rowActions.addNote"),
        onClick: () => setIsNoteOpen(true),
      },
      {
        key: "remove",
        label: t("rowActions.remove"),
        onClick: () => setIsRemoveOpen(true),
        destructive: true,
        disabled: !holding,
      },
    ],
    [holding, router, symbol, t, tPortfolio],
  );

  return (
    <StopPropagationWrap
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <RowActionsMenu actions={actions} ariaLabel={ariaLabel} />
      {holding ? (
        <PortfolioHoldingFormModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          mode="edit"
          holding={holding}
        />
      ) : null}
      <SetAlertModal
        isOpen={isSetAlertOpen}
        onClose={() => setIsSetAlertOpen(false)}
        symbol={symbol}
        onSaved={(form) => addUserAlert({ symbol, form })}
      />
      <StockNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        symbol={symbol}
        mode="holding"
        initialHoldingNotes={holding?.notes ?? ""}
        onSaved={({ holdingNotes }) => {
          if (holding && holdingNotes !== undefined) {
            updatePortfolioHoldingNotes(holding.id, holdingNotes);
          }
        }}
      />
      <RemoveHoldingConfirmModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        holding={holding ?? null}
      />
    </StopPropagationWrap>
  );
};

const StopPropagationWrap = styled.div`
  display: inline-flex;
`;
