"use client";

import { useReducedMotion } from "framer-motion";
import { Menu, RefreshCw, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { AuthUserMenu } from "@/components/auth/AuthUserMenu";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import { Button } from "@/components/ui/Button";
import { CurrencySelector } from "@/components/ui/CurrencySelector";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { MarketSessionReminder } from "@/components/ui/MarketSessionReminder";
import { trendingAddStockSearchResults } from "@/data/add-stock/add-stock.mock";
import type { AddStockSearchResult } from "@/data/add-stock/add-stock.types";
import type { RecentSearchDisplayEntry } from "@/data/search/recent-search.types";
import { useRouter } from "@/i18n/routing";
import { useAppStore } from "@/store/app.store";
import { useRecentSearchStore } from "@/store/recent-search.store";
import { getExchangeRates } from "@/utils/currencies/getExchangeRates";
import { fetchStockSearch } from "@/utils/financial-data/fetchStockSearch";
import { getStockHref } from "@/utils/navigation/getStockHref";
import { resolveGlobalSearch } from "@/utils/navigation/resolveGlobalSearch";
import { resolveRecentSearchEntries } from "@/utils/search/resolveRecentSearchEntry";
import { TopSearchMobileSheet } from "./TopSearchMobileSheet";
import { TopSearchResultsPanel } from "./TopSearchResultsPanel";

type TopBarProps = {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
};

const MIN_SEARCH_QUERY_LENGTH = 2;

export const TopBar = ({ onMenuClick, showMenuButton = false }: TopBarProps) => {
  const t = useTranslations("topBar");
  const tStockSearch = useTranslations("stockSearch");
  const tShell = useTranslations("shell");
  const tInteractions = useTranslations("interactions");
  const router = useRouter();
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const setFxRates = useAppStore((state) => state.setFxRates);
  const setIsLoadingFxRates = useAppStore((state) => state.setIsLoadingFxRates);
  const recentSearches = useRecentSearchStore((state) => state.recentSearches);
  const recordRecentSearch = useRecentSearchStore((state) => state.recordRecentSearch);
  const clearRecentSearches = useRecentSearchStore((state) => state.clearRecentSearches);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const headerSearchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AddStockSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNoResultsOpen, setIsNoResultsOpen] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const resolvedRecentSearches = useMemo(
    () => resolveRecentSearchEntries(recentSearches),
    [recentSearches],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < MIN_SEARCH_QUERY_LENGTH) {
      setSearchResults([]);
      setIsSearchLoading(false);
      return;
    }

    let cancelled = false;
    setIsSearchLoading(true);

    void fetchStockSearch(trimmed)
      .then(({ results }) => {
        if (!cancelled) {
          setSearchResults(results);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearchResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsSearchLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.tablet - 1}px)`,
    );

    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, [theme.breakpoints.tablet]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (isMobile) {
        return;
      }

      if (!searchWrapRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isMobile]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const navigateToStock = useCallback(
    (symbol: string, companyName: string) => {
      recordRecentSearch({ symbol, companyName });
      router.push(getStockHref(symbol));
      setSearchQuery("");
      closeSearch();
    },
    [closeSearch, recordRecentSearch, router],
  );

  const handleSelectResult = useCallback(
    (stock: AddStockSearchResult) => {
      navigateToStock(stock.symbol, stock.companyName);
    },
    [navigateToStock],
  );

  const handleSelectRecent = useCallback(
    (entry: RecentSearchDisplayEntry) => {
      navigateToStock(entry.symbol, entry.companyName);
    },
    [navigateToStock],
  );

  const handleSearchSubmit = useCallback(() => {
    const result = resolveGlobalSearch(searchQuery);
    if (result.kind === "route") {
      if (result.labelKey === "stock") {
        const symbol = searchQuery.trim().toUpperCase();
        const matchedStock =
          searchResults.find((stock) => stock.symbol === symbol) ??
          trendingAddStockSearchResults.find((stock) => stock.symbol === symbol);
        navigateToStock(symbol, matchedStock?.companyName ?? symbol);
        return;
      }

      router.push(result.href);
      setSearchQuery("");
      closeSearch();
      return;
    }

    if (searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
      return;
    }

    setIsNoResultsOpen(true);
    closeSearch();
  }, [closeSearch, handleSelectResult, navigateToStock, router, searchQuery, searchResults]);

  const handleSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearchSubmit();
        return;
      }

      if (event.key === "Escape") {
        closeSearch();
      }
    },
    [closeSearch, handleSearchSubmit],
  );

  const handleHeaderSearchFocus = useCallback(() => {
    if (isMobile) {
      headerSearchInputRef.current?.blur();
    }
    setIsSearchOpen(true);
  }, [isMobile]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    setIsLoadingFxRates(true);

    try {
      const response = await getExchangeRates();
      setFxRates(response.rates, response.meta);
      setRefreshMessage(tInteractions("refresh.success"));
    } catch {
      setRefreshMessage(tInteractions("refresh.success"));
    } finally {
      setIsLoadingFxRates(false);
      setIsRefreshing(false);
      window.setTimeout(() => setRefreshMessage(null), 2500);
    }
  }, [isRefreshing, setFxRates, setIsLoadingFxRates, tInteractions]);

  const showDesktopPanel = isSearchOpen && !isMobile;
  const showMobileSheet = isSearchOpen && isMobile;
  const isSearchLoadingOrDebouncing =
    isSearchLoading || (searchQuery.trim().length >= MIN_SEARCH_QUERY_LENGTH && debouncedQuery !== searchQuery);

  return (
    <>
      <Header>
        <TopRow>
          {showMenuButton ? (
            <Button
              $variant="ghost"
              $size="sm"
              onClick={onMenuClick}
              aria-label={tShell("openMenu")}
            >
              <Menu size={20} strokeWidth={1.75} />
            </Button>
          ) : null}

          <SearchWrap ref={searchWrapRef}>
            <SearchIcon size={18} strokeWidth={1.75} aria-hidden />
            <SearchInput
              ref={headerSearchInputRef}
              type="search"
              placeholder={tStockSearch("searchPlaceholder")}
              aria-label={tStockSearch("searchPlaceholder")}
              aria-expanded={isSearchOpen}
              aria-controls="top-search-results"
              value={searchQuery}
              readOnly={isMobile}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={handleHeaderSearchFocus}
              onKeyDown={handleSearchKeyDown}
            />
            {showDesktopPanel ? (
              <TopSearchResultsPanel
                results={searchResults}
                suggestions={trendingAddStockSearchResults}
                recentSearches={resolvedRecentSearches}
                isLoading={isSearchLoadingOrDebouncing}
                query={searchQuery}
                onSelect={handleSelectResult}
                onSelectRecent={handleSelectRecent}
                onClearRecent={clearRecentSearches}
              />
            ) : null}
          </SearchWrap>

          <Actions>
            {refreshMessage ? (
              <RefreshNotice role="status" aria-live="polite">
                {refreshMessage}
              </RefreshNotice>
            ) : null}
            <MarketSessionReminder $variant="compact" />
            <CurrencySelector />
            <LanguageSelector />
            <RefreshButton
              $variant="ghost"
              $size="sm"
              aria-label={t("refresh")}
              aria-busy={isRefreshing}
              disabled={isRefreshing}
              onClick={handleRefresh}
            >
              <RefreshIconWrap
                $spin={isRefreshing && !prefersReducedMotion}
                aria-hidden
              >
                <RefreshCw size={18} strokeWidth={1.75} />
              </RefreshIconWrap>
            </RefreshButton>
            <AuthUserMenu />
          </Actions>
        </TopRow>
      </Header>

      <TopSearchMobileSheet
        isOpen={showMobileSheet}
        query={searchQuery}
        results={searchResults}
        suggestions={trendingAddStockSearchResults}
        recentSearches={resolvedRecentSearches}
        isLoading={isSearchLoadingOrDebouncing}
        onClose={closeSearch}
        onQueryChange={setSearchQuery}
        onSearchKeyDown={handleSearchKeyDown}
        onSelect={handleSelectResult}
        onSelectRecent={handleSelectRecent}
        onClearRecent={clearRecentSearches}
      />

      <PlaceholderModal
        isOpen={isNoResultsOpen}
        onClose={() => setIsNoResultsOpen(false)}
        title={tInteractions("globalSearch.noResultsTitle")}
        description={tInteractions("globalSearch.noResultsDescription")}
      />
    </>
  );
};

const Header = styled.header`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.background.card};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  min-height: ${({ theme }) => theme.layout.topBarHeight};
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  inline-size: 100%;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.app};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  padding-inline: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
  max-inline-size: 28rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    order: 2;
    flex: 1 0 100%;
    max-inline-size: none;
  }
`;

const SearchIcon = styled(Search)`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const SearchInput = styled.input`
  flex: 1;
  min-inline-size: 0;
  border: none;
  background: transparent;
  padding-block: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    outline: none;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  margin-inline-start: auto;
`;

const refreshSpin = css`
  @keyframes topBarRefreshSpin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  animation: topBarRefreshSpin 0.75s linear infinite;
`;

const RefreshButton = styled(Button)`
  &:disabled {
    cursor: wait;
    opacity: 0.85;
  }
`;

const RefreshIconWrap = styled.span<{ $spin: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ $spin }) => ($spin ? refreshSpin : "")}
`;

const RefreshNotice = styled.span`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: none;
  }
`;
