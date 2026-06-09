"use client";

import {
  AlertTriangle,
  CalendarDays,
  Eye,
  PieChart,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { useAppData } from "@/providers/useAppData";
import { RowActionsMenu, type RowActionItem } from "@/components/ui/RowActionsMenu";
import { StockLogo } from "@/components/ui/StockLogo";
import { StockNoteModal } from "@/components/stocks/StockNoteModal";
import { Link, useRouter } from "@/i18n/routing";
import type { NextMoveItem } from "@/data/next-moves/next-moves.types";
import {
  getNextMoveStatusTone,
  type NextMoveTone,
} from "@/utils/next-moves/getNextMoveStatusColor";
import { getNextMoveActionHref } from "@/utils/next-moves/mappers";
import { getStockHref } from "@/utils/navigation/getStockHref";
import { softTransition } from "@/utils/motion/transitions";
import { NextMoveMetricChip } from "./NextMoveMetricChip";

type NextMoveCardProps = {
  move: NextMoveItem;
  index: number;
  onDismiss?: (moveId: string) => void;
};

const statusIcons = {
  needsAction: AlertTriangle,
  opportunity: Sparkles,
  risk: ShieldAlert,
  earnings: CalendarDays,
  monitor: Eye,
};

export const NextMoveCard = ({ move, index, onDismiss }: NextMoveCardProps) => {
  const t = useTranslations("nextMoves");
  const tInteractions = useTranslations("interactions");
  const router = useRouter();
  const { addUserAlert, addStockGeneralNote, getStockGeneralNotes } = useAppData();
  const prefersReducedMotion = useReducedMotion();
  const [isSetAlertOpen, setIsSetAlertOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const tone = getNextMoveStatusTone(move.type);
  const StatusIcon = statusIcons[move.type];
  const actionHref = getNextMoveActionHref(move);
  const entityLabel = move.symbol ?? (move.entityKey ? t(move.entityKey) : "");
  const normalizedSymbol = move.symbol?.trim().toUpperCase();
  const latestGeneralNote = normalizedSymbol
    ? getStockGeneralNotes(normalizedSymbol)[0]
    : undefined;
  const initialGeneralNote = latestGeneralNote
    ? {
        title: latestGeneralNote.title,
        note: latestGeneralNote.note,
        category: latestGeneralNote.category,
      }
    : undefined;

  const rowActions = useMemo((): RowActionItem[] => {
    const actions: RowActionItem[] = [];

    if (move.symbol) {
      actions.push({
        key: "view",
        label: tInteractions("rowActions.viewDetails"),
        onClick: () => router.push(getStockHref(move.symbol!)),
      });
    } else if (actionHref) {
      actions.push({
        key: "view",
        label: tInteractions("rowActions.viewDetails"),
        onClick: () => router.push(actionHref),
      });
    }

    actions.push({
      key: "setAlert",
      label: tInteractions("rowActions.setAlert"),
      onClick: () => setIsSetAlertOpen(true),
    });

    actions.push({
      key: "addNote",
      label: tInteractions("rowActions.addNote"),
      onClick: () => setIsNoteOpen(true),
    });

    if (move.status === "active" && onDismiss) {
      actions.push({
        key: "dismiss",
        label: tInteractions("rowActions.dismiss"),
        onClick: () => onDismiss(move.id),
        destructive: true,
      });
    }

    return actions;
  }, [actionHref, move, onDismiss, router, tInteractions]);

  const handlePrimaryAction = () => {
    if (move.action === "setAlert") {
      setIsSetAlertOpen(true);
      return;
    }
    if (actionHref) {
      router.push(actionHref);
    }
  };

  return (
    <>
      <Card
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : softTransition(0.34, index * 0.045)}
        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      >
        <EntityColumn>
          {move.symbol ? (
            <StockLogo
              symbol={move.symbol}
              companyName={move.companyName ?? move.symbol}
              logoUrl={move.logoUrl}
              size="lg"
              aria-hidden
            />
          ) : (
            <Avatar $tone={tone} aria-hidden>
              <PieChart size={20} strokeWidth={1.9} />
            </Avatar>
          )}
          <EntityText>
            <Symbol dir="ltr">{entityLabel}</Symbol>
            {move.companyName ? <Company>{move.companyName}</Company> : null}
          </EntityText>
        </EntityColumn>

        <MainColumn>
          <TitleRow>
            <MoveTitle>{t(move.titleKey)}</MoveTitle>
            <StatusBadge $tone={tone}>
              <StatusIcon size={14} strokeWidth={1.9} aria-hidden />
              {t(`types.${move.type}`)}
            </StatusBadge>
          </TitleRow>
          <Description>{t(move.descriptionKey)}</Description>
          <MetricList>
            {move.metrics.map((metric) => (
              <NextMoveMetricChip
                key={metric.id}
                metric={metric}
                label={t(metric.labelKey)}
                value={metric.valueKey ? t(metric.valueKey) : metric.value}
              />
            ))}
          </MetricList>
        </MainColumn>

        <ActionColumn>
          {actionHref && move.action !== "setAlert" ? (
            <ActionLink href={actionHref}>{t(`actions.${move.action}`)}</ActionLink>
          ) : (
            <ActionButton type="button" onClick={handlePrimaryAction}>
              {t(`actions.${move.action}`)}
            </ActionButton>
          )}
          <RowActionsMenu actions={rowActions} ariaLabel={t("actions.more")} triggerSize="md" />
        </ActionColumn>
      </Card>

      <SetAlertModal
        isOpen={isSetAlertOpen}
        onClose={() => setIsSetAlertOpen(false)}
        symbol={move.symbol}
        onSaved={(form) => {
          if (move.symbol) {
            addUserAlert({ symbol: move.symbol, form });
          }
        }}
      />

      <StockNoteModal
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        symbol={move.symbol}
        initialNote={initialGeneralNote}
        onSaved={({ note }) => {
          if (normalizedSymbol && note) {
            addStockGeneralNote(normalizedSymbol, note);
          }
        }}
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
    color: ${({ theme }) => theme.colors.status.neutral};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
  `,
  brand: css`
    color: ${({ theme }) => theme.colors.chart.purple};
    background: color-mix(in srgb, ${({ theme }) => theme.colors.chart.purple} 12%, transparent);
  `,
};

const Card = styled(motion.article)`
  display: grid;
  grid-template-columns: minmax(10rem, 0.85fr) minmax(0, 1.8fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.strong};
    box-shadow: ${({ theme }) => theme.colors.shadow.card};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const EntityColumn = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Avatar = styled.div<{ $tone: NextMoveTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 3.25rem;
  block-size: 3.25rem;
  border-radius: 50%;
  flex-shrink: 0;
  ${({ $tone }) => toneStyles[$tone]}
`;

const EntityText = styled.div`
  min-inline-size: 0;
`;

const Symbol = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Company = styled.span`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MainColumn = styled.div`
  min-inline-size: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    align-items: flex-start;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const MoveTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const StatusBadge = styled.span<{ $tone: NextMoveTone }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
  ${({ $tone }) => toneStyles[$tone]}
`;

const Description = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const MetricList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-start: ${({ theme }) => theme.spacing.md};
`;

const ActionColumn = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    justify-content: stretch;
  }
`;

const actionControlStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-block-size: 2.45rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.brand.primary};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex: 1;
  }
`;

const ActionLink = styled(Link)`
  ${actionControlStyles}
`;

const ActionButton = styled.button`
  ${actionControlStyles}
`;
