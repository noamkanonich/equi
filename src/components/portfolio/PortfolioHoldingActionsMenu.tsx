"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { RowActionsMenu, type RowActionItem } from "@/components/ui/RowActionsMenu";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";
import { useRouter } from "@/i18n/routing";
import { useAppData } from "@/providers/useAppData";
import { getStockHref } from "@/utils/navigation/getStockHref";
import { PortfolioHoldingFormModal } from "./PortfolioHoldingFormModal";
import { PortfolioHoldingNoteModal } from "./PortfolioHoldingNoteModal";
import { RemoveHoldingConfirmModal } from "./RemoveHoldingConfirmModal";

type PortfolioHoldingActionsMenuProps = {
  holding: EnrichedPortfolioHolding;
  ariaLabel?: string;
};

export const PortfolioHoldingActionsMenu = ({
  holding,
  ariaLabel,
}: PortfolioHoldingActionsMenuProps) => {
  const t = useTranslations("portfolio.actions");
  const router = useRouter();
  const { addUserAlert } = useAppData();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const actions = useMemo(
    (): RowActionItem[] => [
      {
        key: "viewStock",
        label: t("viewStock"),
        onClick: () => router.push(getStockHref(holding.symbol)),
      },
      {
        key: "edit",
        label: t("editHolding"),
        onClick: () => setIsEditOpen(true),
      },
      {
        key: "addNote",
        label: t("addNote"),
        onClick: () => setIsNoteOpen(true),
      },
      {
        key: "setAlert",
        label: t("setAlert"),
        onClick: () => setIsAlertOpen(true),
      },
      {
        key: "remove",
        label: t("removeHolding"),
        onClick: () => setIsRemoveOpen(true),
        destructive: true,
      },
    ],
    [holding.symbol, router, t],
  );

  return (
    <StopPropagationWrap
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <RowActionsMenu actions={actions} ariaLabel={ariaLabel} />
      <PortfolioHoldingFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        mode="edit"
        holding={holding}
      />
      <PortfolioHoldingNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        holding={holding}
      />
      <SetAlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        symbol={holding.symbol}
        onSaved={(form) => addUserAlert({ symbol: holding.symbol, form })}
      />
      <RemoveHoldingConfirmModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        holding={holding}
      />
    </StopPropagationWrap>
  );
};

const StopPropagationWrap = styled.div`
  display: inline-flex;
`;
