"use client";

import { ArrowUpRight, Crosshair } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import styled from "styled-components";
import { StockLogo } from "@/components/ui/StockLogo";
import type { WatchlistSidebarStock } from "@/data/watchlist/watchlist.types";
import { Link } from "@/i18n/routing";
import { formatPercent } from "@/utils/formatting/formatPercent";

type WatchlistClosestBuyZoneCardProps = {
  stocks: WatchlistSidebarStock[];
  locale: string;
};

export const WatchlistClosestBuyZoneCard = ({
  stocks,
  locale,
}: WatchlistClosestBuyZoneCardProps) => {
  const t = useTranslations("watchlist");
  const tInteractions = useTranslations("interactions");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <Card>
      <TitleRow>
        <Crosshair size={16} strokeWidth={1.8} aria-hidden />
        <Title>{t("sidebar.closestToBuyZone")}</Title>
      </TitleRow>
      <List>
        {stocks.map((stock, index) => (
          <ListItem key={stock.symbol}>
            <Rank>{new Intl.NumberFormat(locale).format(index + 1)}</Rank>
            <StockIdentity href={`/stocks/${stock.symbol}`} dir="ltr">
              <StockLogo
                symbol={stock.symbol}
                companyName={stock.symbol}
                logoUrl={stock.logoUrl}
              />
              <Symbol>{stock.symbol}</Symbol>
            </StockIdentity>
            <Distance>{formatPercent(stock.value, { locale })}</Distance>
          </ListItem>
        ))}
      </List>
      <CardLink type="button" onClick={() => setIsOpen(true)}>
        {t("actions.viewAll")}
        <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
      </CardLink>
    </Card>

    <PlaceholderModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={tInteractions("features.buyZoneTitle")}
      description={tInteractions("features.buyZoneDescription")}
    />
    </>
  );
};

const Card = styled.article`
  block-size: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.status.negative};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const List = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const ListItem = styled.li`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Rank = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const StockIdentity = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
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

const Symbol = styled.strong`
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Distance = styled.span`
  color: ${({ theme }) => theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const CardLink = styled.button`
  margin-block-start: ${({ theme }) => theme.spacing.md};
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: transparent;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
