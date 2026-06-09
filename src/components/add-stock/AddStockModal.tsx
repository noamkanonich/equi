"use client";

import { useEffect, useMemo, useState, useId } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  addStockSearchResultsMock,
  popularAddStockSymbols,
  trendingAddStockSearchResults,
} from "@/data/add-stock/add-stock.mock";
import type {
  AddStockDestination,
  AddStockSearchResult,
} from "@/data/add-stock/add-stock.types";
import type { StockSearchResponse } from "@/data/financial-data/search.types";
import { PortfolioHoldingFormModal } from "@/components/portfolio/PortfolioHoldingFormModal";
import { useAppData } from "@/providers/useAppData";
import { useAppDataStore } from "@/store/app-data.store";
import { fetchStockSearch } from "@/utils/financial-data/fetchStockSearch";
import { enrichAddStockSearchResult } from "@/utils/financial-data/enrichAddStockSearchResult";
import { AddStockDestinationPanel } from "./AddStockDestinationPanel";
import { AddStockHeader } from "./AddStockHeader";
import { AddStockQuickOverview } from "./AddStockQuickOverview";
import { AddStockSearchStep } from "./AddStockSearchStep";
import { AddStockSuccessState } from "./AddStockSuccessState";

const DEV_SIMULATE_SEARCH_ERROR = false;
const MIN_SEARCH_QUERY_LENGTH = 2;

const getAddStockAssetKey = (stock: Pick<AddStockSearchResult, "assetId" | "symbol">): string =>
  stock.assetId ?? `US:${stock.symbol}`;

type AddStockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: AddStockDestination;
  onAddToPortfolio?: (stock: AddStockSearchResult) => void;
};

export const AddStockModal = ({
  isOpen,
  onClose,
  defaultDestination = "watchlist",
  onAddToPortfolio,
}: AddStockModalProps) => {
  const t = useTranslations("addStock");
  const { addWatchlistItem, isInWatchlist, stockDataBySymbol } = useAppData();
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const [isMobile, setIsMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedAssetKey, setSelectedAssetKey] = useState<string | null>(null);
  const [destination, setDestination] = useState<AddStockDestination>(defaultDestination);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successVariant, setSuccessVariant] = useState<"added" | "alreadyInWatchlist">("added");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasSearchError, setHasSearchError] = useState(false);
  const [apiSearchResults, setApiSearchResults] = useState<AddStockSearchResult[]>([]);
  const [searchMeta, setSearchMeta] = useState<StockSearchResponse["meta"]>({
    source: "mock",
    isFallback: true,
    fetchedAt: new Date().toISOString(),
  });
  const [isSearchFetching, setIsSearchFetching] = useState(false);
  const [portfolioFormStock, setPortfolioFormStock] = useState<AddStockSearchResult | null>(
    null,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
      if (DEV_SIMULATE_SEARCH_ERROR && query.trim().toLowerCase() === "error") {
        setHasSearchError(true);
      } else {
        setHasSearchError(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmed = debouncedQuery.trim();
    if (trimmed.length < MIN_SEARCH_QUERY_LENGTH) {
      const resetSearchState = window.setTimeout(() => {
        setApiSearchResults([]);
        setIsSearchFetching(false);
      }, 0);

      return () => window.clearTimeout(resetSearchState);
    }

    let cancelled = false;
    const startSearch = window.setTimeout(() => {
      setIsSearchFetching(true);

      void fetchStockSearch(trimmed)
        .then(({ results, meta }) => {
          if (!cancelled) {
            setApiSearchResults(results);
            setSearchMeta(meta);
            setHasSearchError(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setHasSearchError(true);
            setApiSearchResults([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setIsSearchFetching(false);
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(startSearch);
    };
  }, [debouncedQuery, isOpen]);

  const isSearching =
    (query.trim().length > 0 && debouncedQuery !== query) || isSearchFetching;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.tablet - 1}px)`,
    );

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, [theme.breakpoints.tablet]);

  const filteredSearchResults = useMemo(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length === 0) {
      return trendingAddStockSearchResults;
    }
    if (trimmed.length < MIN_SEARCH_QUERY_LENGTH) {
      return [];
    }
    return apiSearchResults;
  }, [apiSearchResults, debouncedQuery]);

  const searchResults = useMemo(
    () =>
      filteredSearchResults.map((stock) =>
        enrichAddStockSearchResult(stock, stockDataBySymbol[stock.symbol]),
      ),
    [filteredSearchResults, stockDataBySymbol],
  );

  const selectedStock = useMemo(() => {
    const base =
      searchResults.find((stock) => getAddStockAssetKey(stock) === selectedAssetKey) ??
      addStockSearchResultsMock.find(
        (stock) => getAddStockAssetKey(stock) === selectedAssetKey,
      ) ??
      null;

    if (!base) {
      return null;
    }

    return enrichAddStockSearchResult(base, stockDataBySymbol[base.symbol]);
  }, [searchResults, selectedAssetKey, stockDataBySymbol]);

  const handlePopularSelect = (symbol: string) => {
    setQuery(symbol);
    setSelectedAssetKey(`US:${symbol}`);
    setIsSuccess(false);
  };

  const handleSelectStock = (stock: AddStockSearchResult) => {
    setSelectedAssetKey(getAddStockAssetKey(stock));
    setIsSuccess(false);
    void useAppDataStore.getState().ensureStockDataForSymbols([stock.symbol], {
      sections: ["quote", "profile"],
    });
  };

  const resetFlow = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedAssetKey(null);
    setDestination(defaultDestination);
    setIsSuccess(false);
    setSuccessVariant("added");
    setHasSearchError(false);
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedStock) return;

    const assetId = getAddStockAssetKey(selectedStock);
    const market = selectedStock.market ?? "US";
    const provider = selectedStock.provider ?? (market === "IL" ? "tase" : "fmp");
    const providerSymbol = selectedStock.providerSymbol ?? selectedStock.symbol;
    const hasLivePrice = selectedStock.hasLivePrice !== false;

    if (destination === "portfolio") {
      const stockForForm = selectedStock;
      handleClose();
      if (onAddToPortfolio) {
        onAddToPortfolio(stockForForm);
      } else {
        setPortfolioFormStock(stockForForm);
      }
      return;
    } else {
      const normalizedSymbol = selectedStock.symbol.trim().toUpperCase();
      if (isInWatchlist(normalizedSymbol)) {
        setSuccessVariant("alreadyInWatchlist");
        setIsSuccess(true);
        return;
      }

      const referencePrice = hasLivePrice && selectedStock.price > 0 ? selectedStock.price : 0;
      addWatchlistItem({
        symbol: selectedStock.symbol,
        assetId,
        market,
        exchange: selectedStock.exchange,
        currency: selectedStock.currency,
        provider,
        providerSymbol,
        buyZone: {
          low: hasLivePrice ? Number((referencePrice * 0.88).toFixed(2)) : 0,
          high: hasLivePrice ? Number((referencePrice * 0.96).toFixed(2)) : 0,
          currency: selectedStock.currency,
        },
        status: hasLivePrice ? "watchClosely" : "needsMoreData",
      });
      setSuccessVariant("added");
    }

    setIsSuccess(true);
  };

  const primaryAction =
    destination === "portfolio"
      ? t("actions.addToPortfolio")
      : t("actions.addToWatchlist");

  const content = isSuccess && selectedStock ? (
    <AddStockSuccessState
      stock={selectedStock}
      destination={destination}
      variant={successVariant}
      onClose={handleClose}
    />
  ) : (
    <Content key={`${defaultDestination}-${isOpen}`}>
      {isMobile ? <MobileSubtitle>{t("subtitle")}</MobileSubtitle> : null}
      <WorkflowGrid>
        <MainColumn>
          <AddStockSearchStep
            query={query}
            popularSymbols={popularAddStockSymbols}
            results={searchResults}
            selectedSymbol={selectedAssetKey}
            isSearching={isSearching}
            hasSearchError={hasSearchError}
            isFallback={searchMeta.isFallback}
            onQueryChange={setQuery}
            onPopularSelect={handlePopularSelect}
            onSelectStock={handleSelectStock}
            onRetrySearch={() => setHasSearchError(false)}
          />
        </MainColumn>
        <SideColumn>
          <AddStockDestinationPanel
            destination={destination}
            onChange={setDestination}
          />
          <AddStockQuickOverview stock={selectedStock} />
        </SideColumn>
      </WorkflowGrid>
      <Footer>
        <Button $variant="secondary" onClick={handleClose}>
          {t("actions.cancel")}
        </Button>
        <Button onClick={handleConfirm} disabled={!selectedStock}>
          {primaryAction}
        </Button>
      </Footer>
    </Content>
  );

  if (isMobile) {
    return (
      <>
        <BottomSheet
          isOpen={isOpen}
          onClose={handleClose}
          title={t("title")}
          closeLabel={t("actions.close")}
        >
          {content}
        </BottomSheet>
        <PortfolioHoldingFormModal
          isOpen={portfolioFormStock !== null}
          onClose={() => setPortfolioFormStock(null)}
          mode="add"
          initialStock={portfolioFormStock ?? undefined}
        />
      </>
    );
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        labelledBy={titleId}
        describedBy={descriptionId}
      >
        <AddStockHeader
          titleId={titleId}
          descriptionId={descriptionId}
          onClose={handleClose}
        />
        {content}
      </Modal>
      <PortfolioHoldingFormModal
        isOpen={portfolioFormStock !== null}
        onClose={() => setPortfolioFormStock(null)}
        mode="add"
        initialStock={portfolioFormStock ?? undefined}
      />
    </>
  );
};

const Content = styled.div`
  display: flex;
  min-block-size: 0;
  flex: 1;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.app};
`;

const MobileSubtitle = styled.p`
  margin: 0;
  padding-block-end: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(20rem, 0.85fr);
  gap: ${({ theme }) => theme.spacing.md};
  min-block-size: 0;
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: visible;
  }
`;

const MainColumn = styled.div`
  min-inline-size: 0;
  min-block-size: 0;
`;

const SideColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    position: sticky;
    inset-block-end: 0;
    z-index: 1;
    margin-inline: calc(-1 * ${({ theme }) => theme.spacing.lg});
    margin-block-start: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    padding-block-end: calc(
      ${({ theme }) => theme.spacing.md} + env(safe-area-inset-bottom, 0px)
    );

    & > button {
      flex: 1;
      min-block-size: 2.75rem;
    }
  }
`;
