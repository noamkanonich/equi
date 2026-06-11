"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { PageContent } from "@/components/layout/PageContent";
import { StaleDataNotice } from "@/components/ui/states/StaleDataNotice";
import { newsPageMockData } from "@/data/news/news.mock";
import type { NewsFilterKey, NewsItem, NewsSortKey } from "@/data/news/news.types";
import { useRouter } from "@/i18n/routing";
import { useAppData } from "@/providers/useAppData";
import { deriveDataSourceSummary } from "@/utils/financial-data/deriveDataSourceSummary";
import { derivePageFreshnessStatus } from "@/utils/financial-data/derivePageFreshnessStatus";
import { filterNewsItems } from "@/utils/news/filterNewsItems";
import { getFeaturedNewsItem } from "@/utils/news/getFeaturedNewsItem";
import { getNewsPageSymbols } from "@/utils/news/getNewsPageSymbols";
import { getPortfolioRelatedNews } from "@/utils/news/getPortfolioRelatedNews";
import {
  buildMarketPulseFromNews,
  buildUpcomingNewsEventsFromBundles,
} from "@/utils/news/buildNewsSidebarData";
import { sortNewsItems } from "@/utils/news/sortNewsItems";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { NewsArticleModal } from "./NewsArticleModal";
import { NewsContentGrid } from "./NewsContentGrid";
import { NewsFilters } from "./NewsFilters";
import { NewsHeader } from "./NewsHeader";

type NewsPageProps = {
  title: string;
  subtitle: string;
};

export const NewsPage = ({ title, subtitle }: NewsPageProps) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("news");
  const tStates = useTranslations("states");
  const prefersReducedMotion = useReducedMotion();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<NewsFilterKey>("all");
  const [sortKey, setSortKey] = useState<NewsSortKey>("newest");
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiNewsItems, setApiNewsItems] = useState<NewsItem[] | null>(null);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  const {
    portfolioHoldings,
    watchlistItems,
    stockDataBySymbol,
    stockDataLoadingBySymbol,
    isUsingDemoPortfolio,
  } = useAppData();

  const portfolioSymbols = useMemo(
    () => portfolioHoldings.map((holding) => holding.symbol),
    [portfolioHoldings],
  );

  const watchlistSymbols = useMemo(
    () => watchlistItems.map((item) => item.symbol),
    [watchlistItems],
  );

  const newsSymbols = useMemo(
    () => getNewsPageSymbols(portfolioSymbols, watchlistSymbols),
    [portfolioSymbols, watchlistSymbols],
  );

  // News only — quote/profile for portfolio symbols come from AppDataProvider on startup
  const fetchNewsFromApi = useCallback(
    async (symbols: string[], useDemoPortfolio: boolean) => {
      if (symbols.length === 0 && useDemoPortfolio) {
        setApiNewsItems(newsPageMockData.items);
        setIsNewsLoading(false);
        return;
      }

      setIsNewsLoading(true);
      try {
        const url =
          symbols.length > 0
            ? `/api/news?scope=portfolio&symbols=${encodeURIComponent(symbols.join(","))}`
            : "/api/news?scope=market";

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`News fetch failed: ${response.status}`);
        }

        const data = (await response.json()) as { items: NewsItem[] };
        setApiNewsItems(data.items);
      } catch {
        setApiNewsItems(useDemoPortfolio ? newsPageMockData.items : []);
      } finally {
        setIsNewsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNewsFromApi(newsSymbols, isUsingDemoPortfolio);
  }, [newsSymbols, fetchNewsFromApi, isUsingDemoPortfolio]);

  const filterContext = useMemo(
    () => ({
      portfolioSymbols: portfolioSymbols.map((symbol) => symbol.toUpperCase()),
      watchlistSymbols: watchlistSymbols.map((symbol) => symbol.toUpperCase()),
    }),
    [portfolioSymbols, watchlistSymbols],
  );

  const bundles = useMemo(() => {
    const result: typeof stockDataBySymbol = {};
    for (const symbol of portfolioSymbols) {
      const bundle = stockDataBySymbol[symbol];
      if (bundle) {
        result[symbol] = bundle;
      }
    }
    return result;
  }, [portfolioSymbols, stockDataBySymbol]);

  const isLoading = isNewsLoading;

  const isQuoteLoading = portfolioSymbols.some(
    (symbol) => stockDataLoadingBySymbol[symbol],
  );

  const freshnessStatus = useMemo(
    () => derivePageFreshnessStatus(bundles, isQuoteLoading || isNewsLoading),
    [bundles, isNewsLoading, isQuoteLoading],
  );

  const dataSourceSummary = useMemo(
    () => deriveDataSourceSummary(bundles, isQuoteLoading || isNewsLoading),
    [bundles, isNewsLoading, isQuoteLoading],
  );

  const allNewsItems = useMemo(
    () => apiNewsItems ?? (isUsingDemoPortfolio ? newsPageMockData.items : []),
    [apiNewsItems, isUsingDemoPortfolio],
  );

  const newsById = useMemo(() => {
    const map: Record<string, NewsItem> = {};
    for (const item of allNewsItems) {
      map[item.id] = item;
    }
    return map;
  }, [allNewsItems]);

  const filteredItems = useMemo(() => {
    const filtered = filterNewsItems(
      allNewsItems,
      {
        filterKey: activeFilter,
        sortKey,
        searchQuery,
      },
      filterContext,
    );
    return sortNewsItems(filtered, sortKey, filterContext);
  }, [activeFilter, allNewsItems, filterContext, searchQuery, sortKey]);

  const featuredItem = useMemo(
    () => getFeaturedNewsItem(filteredItems),
    [filteredItems],
  );

  const listItems = useMemo(() => {
    if (!featuredItem) {
      return filteredItems.slice(0, 6);
    }
    return filteredItems.filter((item) => item.id !== featuredItem.id).slice(0, 6);
  }, [featuredItem, filteredItems]);

  const portfolioNews = useMemo(() => {
    return getPortfolioRelatedNews(allNewsItems, filterContext, 3);
  }, [allNewsItems, filterContext]);

  const marketPulse = useMemo(() => {
    if (isUsingDemoPortfolio) {
      return newsPageMockData.marketPulse;
    }
    return buildMarketPulseFromNews(allNewsItems);
  }, [allNewsItems, isUsingDemoPortfolio]);

  const upcomingEvents = useMemo(() => {
    if (isUsingDemoPortfolio) {
      return newsPageMockData.upcomingEvents;
    }
    return buildUpcomingNewsEventsFromBundles(portfolioSymbols, stockDataBySymbol);
  }, [isUsingDemoPortfolio, portfolioSymbols, stockDataBySymbol]);

  const handleOpenArticle = useCallback((item: NewsItem) => {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedArticle(item);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchNewsFromApi(newsSymbols, isUsingDemoPortfolio);
    } finally {
      setIsRefreshing(false);
    }
  }, [newsSymbols, fetchNewsFromApi, isUsingDemoPortfolio]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveFilter("all");
    setSortKey("newest");
  }, []);

  const handleViewAllPortfolioNews = useCallback(() => {
    setActiveFilter("portfolio");
  }, []);

  const handleOpenPortfolioNewsItem = useCallback(
    (newsItemId: string) => {
      const item = newsById[newsItemId];
      if (item) {
        handleOpenArticle(item);
      }
    },
    [handleOpenArticle, newsById],
  );

  const handleOpenStock = useCallback(
    (symbol: string) => {
      router.push(`/stocks/${symbol}`);
    },
    [router],
  );

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <PageContent>
      <MotionSection {...reveal(0)}>
        <NewsHeader
          title={title}
          subtitle={subtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          freshnessStatus={freshnessStatus}
        />
      </MotionSection>

      {freshnessStatus === "mock" || freshnessStatus === "stale" ? (
        <NoticeWrap {...reveal(1)}>
          <StaleDataNotice
            title={tStates("stale.title")}
            description={tStates("stale.description")}
            sourceDescription={tStates(`dataSource.${dataSourceSummary.detailKey}`)}
            refreshAction={{
              label: t("refresh"),
              onClick: () => {
                void handleRefresh();
              },
              variant: "secondary",
            }}
          />
        </NoticeWrap>
      ) : null}

      <MotionSection {...reveal(2)}>
        <NewsFilters
          activeFilter={activeFilter}
          sortKey={sortKey}
          onFilterChange={setActiveFilter}
          onSortChange={setSortKey}
        />
      </MotionSection>

      <MotionSection {...reveal(3)}>
        <NewsContentGrid
          featuredItem={featuredItem}
          listItems={listItems}
          marketPulse={marketPulse}
          portfolioNews={portfolioNews}
          upcomingEvents={upcomingEvents}
          locale={locale}
          newsById={newsById}
          isLoading={isLoading}
          onOpenArticle={handleOpenArticle}
          onViewAllPortfolioNews={handleViewAllPortfolioNews}
          onOpenPortfolioNewsItem={handleOpenPortfolioNewsItem}
          onOpenStock={handleOpenStock}
          onClearFilters={handleClearFilters}
        />
      </MotionSection>

      <NewsArticleModal
        item={selectedArticle}
        locale={locale}
        isOpen={selectedArticle !== null}
        onClose={() => setSelectedArticle(null)}
      />
    </PageContent>
  );
};

const MotionSection = styled(motion.section)`
  min-inline-size: 0;
`;

const NoticeWrap = styled(MotionSection)`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
`;
