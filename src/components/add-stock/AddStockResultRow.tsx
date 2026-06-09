"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { MiniSparklineChart } from "@/components/charts/MiniSparklineChart";
import { Badge } from "@/components/ui/Badge";
import { MockDataBadge } from "@/components/ui/MockDataBadge";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StockLogo } from "@/components/ui/StockLogo";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import {
  mapAddStockChangeToTone,
  mapAddStockScoreToTone,
} from "@/data/add-stock/mappers";
import { formatPercent } from "@/utils/formatting/formatPercent";

type AddStockResultRowProps = {
  stock: AddStockSearchResult;
  selected: boolean;
  index: number;
  onSelect: (stock: AddStockSearchResult) => void;
};

export const AddStockResultRow = ({
  stock,
  selected,
  index,
  onSelect,
}: AddStockResultRowProps) => {
  const locale = useLocale();
  const t = useTranslations("addStock");
  const prefersReducedMotion = useReducedMotion();
  const changeTone = mapAddStockChangeToTone(stock.dayChangePercent);
  const scoreTone = mapAddStockScoreToTone(stock.score);
  const displaySymbol = stock.displaySymbol ?? stock.symbol;
  const market = stock.market ?? "US";
  const assetType = stock.assetType ?? "stock";
  const hasLivePrice = stock.hasLivePrice !== false;

  return (
    <RowButton
      type="button"
      $selected={selected}
      onClick={() => onSelect(stock)}
      aria-label={t("actions.selectStock", { symbol: displaySymbol })}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.18,
        delay: prefersReducedMotion ? 0 : index * 0.025,
        ease: "easeOut",
      }}
    >
      <Selection $selected={selected} aria-hidden>
        {selected ? <Check size={14} strokeWidth={2.4} /> : null}
      </Selection>
      <CompanyCell>
        <StockLogo
          symbol={displaySymbol}
          companyName={stock.companyName}
          logoUrl={stock.logoUrl}
          size="sm"
        />
        <CompanyText>
          <Symbol dir="ltr">{displaySymbol}</Symbol>
          <CompanyName>{stock.companyName}</CompanyName>
        </CompanyText>
      </CompanyCell>
      <MetaCell>
        <MetaPrimary>
          <Badge $tone={market === "IL" ? "warning" : "neutral"}>{market}</Badge>
          {stock.isMock ? <MockDataBadge /> : null}
          <MetaText>{stock.exchange}</MetaText>
        </MetaPrimary>
        <MetaSecondary>
          {!hasLivePrice && stock.sector && stock.sector !== "—"
            ? stock.sector
            : `${stock.currency} / ${assetType}`}
        </MetaSecondary>
        {market === "IL" ? <MarketLabel>{t("table.taseLabel")}</MarketLabel> : null}
      </MetaCell>
      <PriceCell>
        {hasLivePrice ? (
          <>
            <PriceText dir="ltr">
              <DisplayMoney
                amount={stock.price}
                currency={stock.currency}
                locale={locale}
                layout="inline"
                inheritColor
              />
            </PriceText>
            <ChangeText $tone={changeTone} dir="ltr">
              {formatPercent(stock.dayChangePercent, { locale, showSign: true })}
            </ChangeText>
          </>
        ) : (
          <UnavailableText>{t("table.priceUnavailable")}</UnavailableText>
        )}
      </PriceCell>
      <SparklineCell>
        {hasLivePrice && stock.sparkline.length > 0 ? (
          <MiniSparklineChart
            data={stock.sparkline}
            variant={changeTone === "negative" ? "negative" : "positive"}
            height={40}
            showArea={false}
            ariaLabel={t("search.sparklineLabel", { symbol: stock.symbol })}
          />
        ) : null}
      </SparklineCell>
      <ScoreCell>
        {hasLivePrice ? <ScoreBadge score={stock.score} $tone={scoreTone} /> : null}
      </ScoreCell>
    </RowButton>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
  `,
};

const RowButton = styled(motion.button)<{ $selected: boolean }>`
  display: grid;
  grid-template-columns:
    auto minmax(8rem, 1.35fr) minmax(6rem, 0.8fr) minmax(5.5rem, auto)
    minmax(6.875rem, 0.55fr) 2rem;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  max-inline-size: 100%;
  min-block-size: 4.25rem;
  min-inline-size: 0;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.brand.primarySoft : theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: start;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.brand.primarySoft : theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Selection = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.strong};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.brand.primary : theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.inverse};
`;

const CompanyCell = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const CompanyText = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Symbol = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const CompanyName = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetaCell = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 2 / -1;
  }
`;

const MetaPrimary = styled.span`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const MetaText = styled.span`
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetaSecondary = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const MarketLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const PriceCell = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: flex-end;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 2 / 3;
    align-items: flex-start;
  }
`;

const PriceText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const ChangeText = styled.span<{ $tone: "positive" | "warning" | "negative" }>`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  ${({ $tone }) => toneStyles[$tone]}
`;

const UnavailableText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-align: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    text-align: start;
  }
`;

const SparklineCell = styled.span`
  min-inline-size: 0;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;

const ScoreCell = styled.span`
  display: inline-flex;
  justify-content: flex-end;
  min-inline-size: 2rem;
`;
