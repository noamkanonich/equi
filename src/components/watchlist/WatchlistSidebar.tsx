"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type {
  WatchlistInsight,
  WatchlistSidebarSummary,
} from "@/data/watchlist/watchlist.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { WatchlistAiInsightCard } from "./WatchlistAiInsightCard";
import { WatchlistBestOpportunitiesCard } from "./WatchlistBestOpportunitiesCard";
import { WatchlistClosestBuyZoneCard } from "./WatchlistClosestBuyZoneCard";
import { WatchlistReplaceHoldingCard } from "./WatchlistReplaceHoldingCard";
import { WatchlistUpcomingEarningsCard } from "./WatchlistUpcomingEarningsCard";

type WatchlistSidebarProps = {
  insight: WatchlistInsight;
  summary: WatchlistSidebarSummary;
  locale: string;
};

export const WatchlistSidebar = ({
  insight,
  summary,
  locale,
}: WatchlistSidebarProps) => {
  const prefersReducedMotion = useReducedMotion();

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <Aside>
      <motion.div {...reveal(0)}>
        <WatchlistAiInsightCard insight={insight} />
      </motion.div>
      <motion.div {...reveal(1)}>
        <WatchlistBestOpportunitiesCard
          stocks={summary.bestOpportunities}
          locale={locale}
        />
      </motion.div>
      <motion.div {...reveal(2)}>
        <WatchlistClosestBuyZoneCard
          stocks={summary.closestToBuyZone}
          locale={locale}
        />
      </motion.div>
      <motion.div {...reveal(3)}>
        <WatchlistReplaceHoldingCard holding={summary.couldReplaceHolding} />
      </motion.div>
      <motion.div {...reveal(4)}>
        <WatchlistUpcomingEarningsCard earnings={summary.upcomingEarnings} />
      </motion.div>
    </Aside>
  );
};

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;
