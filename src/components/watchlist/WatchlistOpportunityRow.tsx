"use client";

import { Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styled, { css } from "styled-components";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { StockLogo } from "@/components/ui/StockLogo";
import {
  mapDistanceToTone,
  mapWatchlistScoreToTone,
  mapWatchlistStatusToTone,
} from "@/data/watchlist/mappers";
import type { WatchlistItem } from "@/data/watchlist/watchlist.types";
import { Link, useRouter } from "@/i18n/routing";
import { useAppData } from "@/providers/useAppData";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { SetAlertModal } from "@/components/alerts/SetAlertModal";
import { WatchlistExpandedDetails } from "./WatchlistExpandedDetails";
import { WatchlistRowActions } from "./WatchlistRowActions";

type WatchlistOpportunityRowProps = {
  item: WatchlistItem;
  locale: string;
  isExpanded: boolean;
  onToggle: () => void;
};

export const WatchlistOpportunityRow = ({
  item,
  locale,
  isExpanded,
  onToggle,
}: WatchlistOpportunityRowProps) => {
  const t = useTranslations("watchlist");
  const router = useRouter();
  const { updateWatchlistItem, addUserAlert } = useAppData();
  const prefersReducedMotion = useReducedMotion();
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [isSetAlertOpen, setIsSetAlertOpen] = useState(false);
  const isFavorite = item.isFavorite;
  const distanceTone = mapDistanceToTone(item.distanceToBuyZonePercent);
  const stockHref = `/stocks/${item.symbol}`;
  const hasLivePrice = item.market !== "IL";

  const handleActionClick = () => {
    if (item.action === "reviewStock") {
      router.push(stockHref);
      return;
    }

    if (item.action === "compare") {
      router.push("/smart-replace");
      return;
    }

    if (item.action === "setAlert") {
      setIsSetAlertOpen(true);
    }
  };

  return (
    <>
      <Row
        $expanded={isExpanded}
        initial={false}
        whileHover={prefersReducedMotion ? undefined : { y: -1 }}
        transition={{ duration: 0.18 }}
      >
        <Cell $center>
          <FavoriteButton
            type="button"
            $active={isFavorite}
            aria-label={t("table.favorite")}
            aria-pressed={isFavorite}
            onClick={() =>
              updateWatchlistItem(item.id, { isFavorite: !isFavorite })
            }
          >
            <Star size={15} strokeWidth={1.8} aria-hidden />
          </FavoriteButton>
        </Cell>
        <Cell>
          <SymbolLink href={stockHref} dir="ltr">
            <StockLogo
              symbol={item.symbol}
              companyName={item.companyName}
              logoUrl={item.logoUrl}
            />
            <Symbol>{item.symbol}</Symbol>
          </SymbolLink>
        </Cell>
        <Cell>
          <CompanyLink href={stockHref}>{item.companyName}</CompanyLink>
        </Cell>
        <Cell $numeric>
          {hasLivePrice ? (
            <PriceStack>
              <DisplayMoney
                amount={item.currentPrice}
                currency={item.currency}
                locale={locale}
              />
              <Change $tone={item.dayChangePercent >= 0 ? "positive" : "negative"}>
                {formatPercent(item.dayChangePercent, { locale })}
              </Change>
            </PriceStack>
          ) : (
            <UnavailableText>{t("table.priceUnavailable")}</UnavailableText>
          )}
        </Cell>
        <Cell $numeric>
          {hasLivePrice ? (
            <Zone dir="ltr">
              <DisplayMoney
                amount={item.buyZone.low}
                currency={item.buyZone.currency}
                locale={locale}
                layout="inline"
              />
              <Dash aria-hidden>-</Dash>
              <DisplayMoney
                amount={item.buyZone.high}
                currency={item.buyZone.currency}
                locale={locale}
                layout="inline"
              />
            </Zone>
          ) : (
            <UnavailableText>{t("table.priceUnavailable")}</UnavailableText>
          )}
        </Cell>
        <Cell $numeric>
          {hasLivePrice ? (
            <>
              <Distance $tone={distanceTone}>
                {formatPercent(item.distanceToBuyZonePercent, { locale })}
              </Distance>
              <DistanceLabel>
                {item.distanceToBuyZonePercent >= 0
                  ? t("common.above")
                  : t("common.below")}
              </DistanceLabel>
            </>
          ) : (
            <UnavailableText>{t("table.priceUnavailable")}</UnavailableText>
          )}
        </Cell>
        <Cell $center>
          <ScorePill $tone={mapWatchlistScoreToTone(item.qualityScore)}>
            {item.qualityScore}
          </ScorePill>
        </Cell>
        <Cell $center>
          <ScorePill $tone={mapWatchlistScoreToTone(item.opportunityScore)}>
            {item.opportunityScore}
          </ScorePill>
        </Cell>
        <Cell $center>
          <StatusBadge $tone={mapWatchlistStatusToTone(item.status)}>
            {t(`status.${item.status}`)}
          </StatusBadge>
        </Cell>
        <Cell>
          <Trigger>{t(item.trigger.summaryKey)}</Trigger>
        </Cell>
        <Cell $center>
          <WatchlistRowActions
            item={item}
            isExpanded={isExpanded}
            isAlertSet={isAlertSet}
            onActionClick={handleActionClick}
            onToggle={onToggle}
            onAlertSaved={() => setIsAlertSet(true)}
          />
        </Cell>
      </Row>

      <AnimatePresence initial={false}>
        {isExpanded ? (
          <ExpandedRow>
            <ExpandedCell colSpan={11}>
              <ExpandedMotion
                initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <WatchlistExpandedDetails item={item} />
              </ExpandedMotion>
            </ExpandedCell>
          </ExpandedRow>
        ) : null}
      </AnimatePresence>

      <SetAlertModal
        isOpen={isSetAlertOpen}
        onClose={() => setIsSetAlertOpen(false)}
        symbol={item.symbol}
        onSaved={(form) => {
          addUserAlert({ symbol: item.symbol, form });
          setIsAlertSet(true);
        }}
      />
    </>
  );
};

const alignmentStyles = css<{ $numeric?: boolean; $center?: boolean }>`
  text-align: ${({ $numeric, $center }) =>
    $center ? "center" : $numeric ? "end" : "start"};
`;

const Row = styled(motion.tr)<{ $expanded: boolean }>`
  background: ${({ theme, $expanded }) =>
    $expanded ? theme.colors.background.soft : theme.colors.background.card};
  box-shadow: ${({ theme, $expanded }) =>
    $expanded ? theme.colors.shadow.soft : "none"};
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }
`;

const Cell = styled.td<{ $numeric?: boolean; $center?: boolean }>`
  ${alignmentStyles}
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.tableText.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.tableText.lineHeight};
  vertical-align: middle;
`;

const SymbolLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 3px;
  }
`;

const Symbol = styled.strong`
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const CompanyLink = styled(Link)`
  display: inline-flex;
  max-inline-size: 10rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: color 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 3px;
  }
`;

const PriceStack = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Change = styled.span<{ $tone: "positive" | "negative" }>`
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Zone = styled.span`
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const Dash = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Distance = styled.span<{ $tone: "positive" | "warning" | "negative" }>`
  display: block;
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "warning"
        ? theme.colors.status.warning
        : theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const DistanceLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const UnavailableText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const ScorePill = styled.span<{ $tone: "positive" | "warning" | "negative" }>`
  min-inline-size: 3.25rem;
  min-block-size: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "warning"
        ? theme.colors.status.warning
        : theme.colors.status.negative};
  background: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positiveSoft
      : $tone === "warning"
        ? theme.colors.status.warningSoft
        : theme.colors.status.negativeSoft};
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const StatusBadge = styled.span<{
  $tone: "positive" | "warning" | "negative" | "neutral";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 5rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "warning"
        ? theme.colors.status.warning
        : $tone === "negative"
          ? theme.colors.status.negative
          : theme.colors.status.neutral};
  background: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positiveSoft
      : $tone === "warning"
        ? theme.colors.status.warningSoft
        : $tone === "negative"
          ? theme.colors.status.negativeSoft
          : theme.colors.status.neutralSoft};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
`;

const Trigger = styled.span`
  display: inline-block;
  max-inline-size: 11rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const FavoriteButton = styled.button<{ $active: boolean }>`
  inline-size: 2.25rem;
  block-size: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.text.muted};
  background: transparent;
  transition:
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ExpandedRow = styled(motion.tr)``;

const ExpandedCell = styled.td`
  padding: 0;
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const ExpandedMotion = styled(motion.div)`
  overflow: hidden;
`;
