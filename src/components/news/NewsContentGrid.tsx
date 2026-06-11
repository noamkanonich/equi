"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { NoResultsState } from "@/components/ui/states/NoResultsState";
import { SkeletonCard } from "@/components/ui/states/SkeletonCard";
import type {
  MarketPulseItem,
  NewsItem,
  PortfolioNewsItem,
  UpcomingNewsEvent,
} from "@/data/news/news.types";
import { softTransition } from "@/utils/motion/transitions";
import { FeaturedNewsCard } from "./FeaturedNewsCard";
import { NewsList } from "./NewsList";
import { NewsSidebar } from "./NewsSidebar";

type NewsContentGridProps = {
  featuredItem: NewsItem | null;
  listItems: NewsItem[];
  marketPulse: MarketPulseItem[];
  portfolioNews: PortfolioNewsItem[];
  upcomingEvents: UpcomingNewsEvent[];
  locale: string;
  newsById: Record<string, NewsItem>;
  isLoading: boolean;
  onOpenArticle: (item: NewsItem) => void;
  onViewAllPortfolioNews: () => void;
  onOpenPortfolioNewsItem: (newsItemId: string) => void;
  onOpenStock: (symbol: string) => void;
  onClearFilters: () => void;
};

export const NewsContentGrid = ({
  featuredItem,
  listItems,
  marketPulse,
  portfolioNews,
  upcomingEvents,
  locale,
  newsById,
  isLoading,
  onOpenArticle,
  onViewAllPortfolioNews,
  onOpenPortfolioNewsItem,
  onOpenStock,
  onClearFilters,
}: NewsContentGridProps) => {
  const t = useTranslations("news");
  const prefersReducedMotion = useReducedMotion();

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <LoadingPanel key="loading">
          <SkeletonCard $bodyLines={5} $showFooter />
          <SkeletonCard $bodyLines={3} />
          <SkeletonCard $bodyLines={3} />
        </LoadingPanel>
      );
    }

    if (!featuredItem && listItems.length === 0) {
      return (
        <EmptyPanel
          key="empty"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : softTransition(0.24)}
        >
          <NoResultsState
            title={t("noResults.title")}
            description={t("noResults.description")}
            clearAction={{
              label: t("noResults.clearFilters"),
              onClick: onClearFilters,
              variant: "secondary",
            }}
          />
        </EmptyPanel>
      );
    }

    return (
      <MotionStack
        key={`${featuredItem?.id ?? "none"}-${listItems.map((item) => item.id).join("-")}`}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : softTransition(0.26)}
      >
        {featuredItem ? (
          <FeaturedNewsCard
            item={featuredItem}
            locale={locale}
            onOpen={onOpenArticle}
          />
        ) : null}
        {listItems.length > 0 ? (
          <NewsList items={listItems} locale={locale} onOpen={onOpenArticle} />
        ) : null}
      </MotionStack>
    );
  };

  return (
    <Grid>
      <MainColumn>
        <AnimatePresence mode="wait">{renderMainContent()}</AnimatePresence>
      </MainColumn>
      <NewsSidebar
        marketPulse={marketPulse}
        portfolioNews={portfolioNews}
        upcomingEvents={upcomingEvents}
        locale={locale}
        newsById={newsById}
        onViewAllPortfolioNews={onViewAllPortfolioNews}
        onOpenPortfolioNewsItem={onOpenPortfolioNewsItem}
        onOpenStock={onOpenStock}
      />
    </Grid>
  );
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(20rem, 22.5rem);
  align-items: start;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  min-inline-size: 0;
`;

const MotionStack = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;
`;

const EmptyPanel = styled(motion.div)`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const LoadingPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
