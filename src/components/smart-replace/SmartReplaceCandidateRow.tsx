"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RowActionsMenu, type RowActionItem } from "@/components/ui/RowActionsMenu";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StockLogo } from "@/components/ui/StockLogo";
import type { ReplacementCandidate } from "@/data/smart-replace/smart-replace.types";
import {
  mapCandidateActionToTone,
  mapMatchTypeToTone,
} from "@/data/smart-replace/mappers";
import { useRouter } from "@/i18n/routing";
import { useAppData } from "@/providers/useAppData";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { getReplacementMatchLabel } from "@/utils/smart-replace/getReplacementMatchLabel";
import { getSmartReplaceTranslationKey } from "@/utils/smart-replace/getSmartReplaceTranslationKey";
import { getStockHref } from "@/utils/navigation/getStockHref";
import { mapScoreToTone } from "@/utils/scoring/mappers";

type SmartReplaceCandidateRowProps = {
  candidate: ReplacementCandidate;
  locale: string;
  isSelected: boolean;
  onSelect: (candidateId: string) => void;
};

export const SmartReplaceCandidateRow = ({
  candidate,
  locale,
  isSelected,
  onSelect,
}: SmartReplaceCandidateRowProps) => {
  const t = useTranslations("smartReplace");
  const tInteractions = useTranslations("interactions");
  const router = useRouter();
  const { addUserAlert } = useAppData();
  const [isSetAlertOpen, setIsSetAlertOpen] = useState(false);
  const scoreTone = mapScoreToTone(candidate.score);
  const badgeTone = scoreTone === "neutral" ? "warning" : scoreTone;
  const actionTone = mapCandidateActionToTone(candidate.action);
  const matchTone = mapMatchTypeToTone(candidate.matchType);

  const rowActions = useMemo(
    (): RowActionItem[] => [
      {
        key: "viewStock",
        label: tInteractions("rowActions.viewDetails"),
        onClick: () => router.push(getStockHref(candidate.symbol)),
      },
      {
        key: "setAlert",
        label: tInteractions("rowActions.setAlert"),
        onClick: () => setIsSetAlertOpen(true),
      },
    ],
    [candidate.symbol, router, tInteractions],
  );

  return (
    <>
      <Row
        $selected={isSelected}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        onClick={() => onSelect(candidate.id)}
      >
        <Cell>
          <SymbolWrap>
            <StockLogo
              symbol={candidate.symbol}
              companyName={candidate.companyName}
              logoUrl={candidate.logoUrl}
              size="sm"
            />
            <Symbol dir="ltr">{candidate.symbol}</Symbol>
          </SymbolWrap>
        </Cell>
        <Cell>{candidate.companyName}</Cell>
        <Cell>
          <ToneBadge $tone={matchTone}>
            {t(getSmartReplaceTranslationKey(getReplacementMatchLabel(candidate.matchType)))}
          </ToneBadge>
        </Cell>
        <Cell $center>
          <ScoreBadge score={candidate.score} $tone={badgeTone} />
        </Cell>
        <Cell $numeric dir="ltr">
          <PositiveText>
            {formatPercent(candidate.upsidePercent, { locale, decimals: 1 })}
          </PositiveText>
        </Cell>
        <Cell $numeric dir="ltr">
          {new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(candidate.beta)}
        </Cell>
        <Cell>{t(getSmartReplaceTranslationKey(candidate.keyReasonKey))}</Cell>
        <Cell $center>
          <ActionWrap>
            <ToneBadge $tone={actionTone}>{t(`actions.${candidate.action}`)}</ToneBadge>
            <Button
              $variant={isSelected ? "primary" : "secondary"}
              $size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(candidate.id);
              }}
            >
              {isSelected ? t("actions.selected") : t("actions.compare")}
            </Button>
            <RowActionsMenu
              actions={rowActions}
              ariaLabel={tInteractions("rowActions.menu")}
            />
          </ActionWrap>
        </Cell>
      </Row>

      <SetAlertModal
        isOpen={isSetAlertOpen}
        onClose={() => setIsSetAlertOpen(false)}
        symbol={candidate.symbol}
        onSaved={(form) => addUserAlert({ symbol: candidate.symbol, form })}
      />
    </>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
};

const Row = styled(motion.tr)<{ $selected: boolean }>`
  cursor: pointer;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.background.soft : theme.colors.background.card};
  transition:
    background 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }
`;

const Cell = styled.td<{ $numeric?: boolean; $center?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.tableText.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.tableText.lineHeight};
  text-align: ${({ $numeric, $center }) =>
    $center ? "center" : $numeric ? "end" : "start"};
  white-space: nowrap;
`;

const SymbolWrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const ToneBadge = styled(Badge)<{ $tone: keyof typeof toneStyles }>`
  ${({ $tone }) => toneStyles[$tone]}
`;

const PositiveText = styled.span`
  color: ${({ theme }) => theme.colors.status.positive};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const ActionWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;
