"use client";

import {
  ArrowLeftRight,
  CalendarDays,
  DollarSign,
  PieChart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { LucideIcon } from "lucide-react";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { Badge } from "@/components/ui/Badge";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { StockNoteModal } from "@/components/stocks/StockNoteModal";
import { RowActionsMenu, type RowActionItem } from "@/components/ui/RowActionsMenu";
import { StockLogo } from "@/components/ui/StockLogo";
import { Link, useRouter } from "@/i18n/routing";
import type { AlertItem, AlertStatus, AlertType } from "@/data/alerts/alerts.types";
import { useAppData } from "@/providers/useAppData";
import { getStockHref } from "@/utils/navigation/getStockHref";
import { getAlertViewHref } from "@/data/alerts/mappers";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { formatDate } from "@/utils/formatting/formatDate";
import {
  getAlertPriorityTone,
  getAlertTypeMeta,
  type AlertTone,
} from "@/utils/alerts/getAlertTypeMeta";
import { softTransition } from "@/utils/motion/transitions";

type AlertRowProps = {
  alert: AlertItem;
  index: number;
  locale: string;
  onStatusChange: (alertId: string, status: AlertStatus) => void;
};

const typeIcons: Record<AlertType, LucideIcon> = {
  price: DollarSign,
  earnings: CalendarDays,
  portfolio: PieChart,
  buyZone: TrendingUp,
  score: Sparkles,
  smartReplace: ArrowLeftRight,
  analyst: TrendingUp,
};

const mapToneToBadge = (
  tone: AlertTone,
): "neutral" | "positive" | "negative" | "warning" => {
  if (tone === "brand") return "neutral";
  return tone;
};

export const AlertRow = ({ alert, index, locale, onStatusChange }: AlertRowProps) => {
  const t = useTranslations("alerts");
  const tInteractions = useTranslations("interactions");
  const router = useRouter();
  const { addUserAlert, addStockGeneralNote, getStockGeneralNotes } = useAppData();
  const prefersReducedMotion = useReducedMotion();
  const [isSetAlertOpen, setIsSetAlertOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const normalizedSymbol = alert.symbol?.trim().toUpperCase();
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
  const typeMeta = getAlertTypeMeta(alert.type);
  const priorityTone = getAlertPriorityTone(alert.priority);
  const TypeIcon = typeIcons[alert.type];
  const viewHref = getAlertViewHref(alert);

  const rowActions = useMemo((): RowActionItem[] => {
    const actions: RowActionItem[] = [];

    if (viewHref) {
      actions.push({
        key: "view",
        label: tInteractions("rowActions.viewDetails"),
        onClick: () => router.push(viewHref),
      });
    } else if (alert.symbol) {
      actions.push({
        key: "view",
        label: tInteractions("rowActions.viewDetails"),
        onClick: () => router.push(getStockHref(alert.symbol!)),
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

    if (alert.status !== "snoozed" && alert.status !== "dismissed") {
      actions.push({
        key: "snooze",
        label: tInteractions("rowActions.snooze"),
        onClick: () => onStatusChange(alert.id, "snoozed"),
      });
    }

    if (alert.status !== "dismissed") {
      actions.push({
        key: "dismiss",
        label: tInteractions("rowActions.dismiss"),
        onClick: () => onStatusChange(alert.id, "dismissed"),
        destructive: true,
      });
    }

    return actions;
  }, [alert, onStatusChange, router, tInteractions, viewHref]);

  const timestamp = t(alert.timestampKey, alert.timestampParams ?? {});

  const renderPrimaryValue = () => {
    const { primaryValue } = alert;
    if (primaryValue.kind === "money") {
      return (
        <DisplayMoney
          amount={primaryValue.amount}
          currency={primaryValue.currency}
          locale={locale}
          layout="inline"
        />
      );
    }
    if (primaryValue.kind === "percent") {
      return (
        <PrimaryValue dir="ltr">
          {formatPercent(primaryValue.value, {
            decimals: 1,
            locale,
            showSign: false,
          })}
        </PrimaryValue>
      );
    }
    if (primaryValue.kind === "date") {
      return (
        <PrimaryValue dir="ltr">
          {formatDate(primaryValue.value, { locale })}
        </PrimaryValue>
      );
    }
    if (primaryValue.kind === "points") {
      return (
        <PrimaryValue dir="ltr">
          +{primaryValue.value} {t("list.points")}
        </PrimaryValue>
      );
    }
    if (primaryValue.kind === "text") {
      return <PrimaryValue>{t(primaryValue.valueKey)}</PrimaryValue>;
    }
    return null;
  };

  const renderSecondaryValue = () => {
    if (!alert.secondaryValue) return null;
    const { secondaryValue } = alert;
    if (secondaryValue.kind === "percent") {
      return (
        <SecondaryValue
          $positive={secondaryValue.value >= 0}
          dir="ltr"
        >
          {formatPercent(secondaryValue.value, { decimals: 2, locale })}
        </SecondaryValue>
      );
    }
    if (secondaryValue.kind === "textKey") {
      return <SecondaryValue>{t(secondaryValue.valueKey)}</SecondaryValue>;
    }
    return <SecondaryValue>{secondaryValue.value}</SecondaryValue>;
  };

  return (
    <>
    <Row
      $highlighted={Boolean(alert.isHighlighted)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion ? { duration: 0 } : softTransition(0.34, index * 0.045)
      }
    >
      <StatusDot $tone={typeMeta.tone} aria-hidden />
      <EntityCell>
        {alert.symbol ? (
          <StockLogo
            symbol={alert.symbol}
            companyName={alert.companyName ?? alert.symbol}
            logoUrl={alert.logoUrl}
            size="md"
            aria-hidden
          />
        ) : (
          <Avatar $tone={typeMeta.tone} aria-hidden>
            <TypeIcon size={18} strokeWidth={1.9} />
          </Avatar>
        )}
      </EntityCell>
      <ContentCell>
        <TitleRow>
          <Title>{t(alert.titleKey)}</Title>
          <Badge $tone={mapToneToBadge(priorityTone)}>
            {t(`priority.${alert.priority}`)}
          </Badge>
        </TitleRow>
        <Description>{t(alert.descriptionKey)}</Description>
        <Timestamp>{timestamp}</Timestamp>
      </ContentCell>
      <ValueCell>
        {renderPrimaryValue()}
        {renderSecondaryValue()}
      </ValueCell>
      <ActionsCell>
        {viewHref ? (
          <ViewLink href={viewHref}>{t("list.view")}</ViewLink>
        ) : alert.symbol ? (
          <ViewLink href={getStockHref(alert.symbol)}>{t("list.view")}</ViewLink>
        ) : (
          <ViewButton type="button" disabled aria-disabled>
            {t("list.view")}
          </ViewButton>
        )}
        <RowActionsMenu actions={rowActions} ariaLabel={t("list.more")} />
      </ActionsCell>
    </Row>

    <SetAlertModal
      isOpen={isSetAlertOpen}
      onClose={() => setIsSetAlertOpen(false)}
      symbol={alert.symbol}
      onSaved={(form) => {
        if (alert.symbol) {
          addUserAlert({ symbol: alert.symbol, form });
        }
      }}
    />

    <StockNoteModal
      isOpen={isNoteOpen}
      onClose={() => setIsNoteOpen(false)}
      symbol={alert.symbol}
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

const toneDotStyles = {
  positive: css`
    background: ${({ theme }) => theme.colors.status.positive};
  `,
  negative: css`
    background: ${({ theme }) => theme.colors.status.negative};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.status.warning};
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.status.neutral};
  `,
  brand: css`
    background: ${({ theme }) => theme.colors.brand.primary};
  `,
};

const toneAvatarStyles = {
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
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
};

const Row = styled(motion.article)<{ $highlighted: boolean }>`
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) minmax(5rem, auto) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  ${({ $highlighted, theme }) =>
    $highlighted
      ? css`
          border: 1px solid
            color-mix(in srgb, ${theme.colors.brand.primary} 35%, transparent);
          border-radius: ${theme.radius.lg};
          box-shadow: 0 0 0 3px ${theme.colors.brand.primarySoft};
          margin-inline: ${theme.spacing.xs};
        `
      : css`
          &:hover {
            background: ${theme.colors.background.elevated};
          }
        `}

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: auto auto 1fr;
    grid-template-areas:
      "dot logo content"
      "dot logo values"
      "dot logo actions";
    gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const StatusDot = styled.span<{ $tone: AlertTone }>`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
  ${({ $tone }) => toneDotStyles[$tone]}
`;

const EntityCell = styled.div`
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: logo;
  }
`;

const Avatar = styled.div<{ $tone: AlertTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: 50%;
  ${({ $tone }) => toneAvatarStyles[$tone]}
`;

const ContentCell = styled.div`
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: content;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Description = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const Timestamp = styled.span`
  display: block;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ValueCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
  text-align: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: values;
    align-items: flex-start;
    text-align: start;
  }
`;

const PrimaryValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const SecondaryValue = styled.span<{ $positive?: boolean }>`
  color: ${({ theme, $positive }) =>
    $positive === undefined
      ? theme.colors.text.secondary
      : $positive
        ? theme.colors.status.positive
        : theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-area: actions;
  }
`;

const viewButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.strong};
    background: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const ViewLink = styled(Link)`
  ${viewButtonStyles}
`;

const ViewButton = styled.button`
  ${viewButtonStyles}
  cursor: not-allowed;
  opacity: 0.5;
`;
