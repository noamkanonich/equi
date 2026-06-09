"use client";

import styled from "styled-components";
import type { MarketPulseItem, NewsItem, PortfolioNewsItem, UpcomingNewsEvent } from "@/data/news/news.types";
import { MarketPulseCard } from "./MarketPulseCard";
import { PortfolioNewsCard } from "./PortfolioNewsCard";
import { UpcomingEventsCard } from "./UpcomingEventsCard";

type NewsSidebarProps = {
  marketPulse: MarketPulseItem[];
  portfolioNews: PortfolioNewsItem[];
  upcomingEvents: UpcomingNewsEvent[];
  locale: string;
  newsById: Record<string, NewsItem>;
  onViewAllPortfolioNews: () => void;
  onOpenPortfolioNewsItem: (newsItemId: string) => void;
  onOpenStock: (symbol: string) => void;
};

export const NewsSidebar = ({
  marketPulse,
  portfolioNews,
  upcomingEvents,
  locale,
  newsById,
  onViewAllPortfolioNews,
  onOpenPortfolioNewsItem,
  onOpenStock,
}: NewsSidebarProps) => {
  return (
    <Aside>
      <MarketPulseCard items={marketPulse} />
      <PortfolioNewsCard
        items={portfolioNews}
        locale={locale}
        newsById={newsById}
        onViewAll={onViewAllPortfolioNews}
        onOpenItem={onOpenPortfolioNewsItem}
        onOpenStock={onOpenStock}
      />
      <UpcomingEventsCard events={upcomingEvents} locale={locale} />
    </Aside>
  );
};

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;
`;
