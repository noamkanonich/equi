"use client";

import { ChevronDown, Star } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import { useAppData } from "@/providers/useAppData";
import { buildDefaultWatchlistInput } from "@/utils/watchlist/buildDefaultWatchlistInput";
import { PortfolioHoldingFormModal } from "@/components/portfolio/PortfolioHoldingFormModal";

type StockActionButtonsProps = {
  symbol: string;
  currentPrice: number;
  currency: CurrencyCode;
};

export const StockActionButtons = ({
  symbol,
  currentPrice,
  currency,
}: StockActionButtonsProps) => {
  const t = useTranslations("stockAnalysis.actions");
  const tActions = useTranslations("actions");
  const { addWatchlistItem, removeWatchlistItem, isInWatchlist, watchlistItems } =
    useAppData();
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  const normalizedSymbol = symbol.trim().toUpperCase();
  const inWatchlist = isInWatchlist(normalizedSymbol);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      const item = watchlistItems.find(
        (watchlistItem) => watchlistItem.symbol.toUpperCase() === normalizedSymbol,
      );
      if (item) {
        removeWatchlistItem(item.id);
      }
      return;
    }

    addWatchlistItem(
      buildDefaultWatchlistInput(normalizedSymbol, currentPrice, currency),
    );
  };

  return (
    <>
      <Wrapper>
        <Button $variant="secondary" $size="sm" onClick={handleWatchlistToggle}>
          <Star size={16} strokeWidth={1.8} />
          {inWatchlist ? tActions("removeFromWatchlist") : t("addToWatchlist")}
        </Button>
        <Button $variant="primary" $size="sm" onClick={() => setIsPortfolioOpen(true)}>
          {t("addToPortfolio")}
          <ChevronDown size={16} strokeWidth={1.8} />
        </Button>
      </Wrapper>

      <PortfolioHoldingFormModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        mode="add"
        initialSymbol={normalizedSymbol}
      />
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    justify-content: stretch;

    button {
      flex: 1;
      min-inline-size: 0;
    }
  }
`;
