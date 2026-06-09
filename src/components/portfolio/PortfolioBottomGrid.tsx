"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { PortfolioData } from "@/data/portfolio/portfolio.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { PortfolioAiInsightCard } from "./PortfolioAiInsightCard";
import { PortfolioRecentActivityCard } from "./PortfolioRecentActivityCard";
import { PortfolioTopMoversCard } from "./PortfolioTopMoversCard";
import { PortfolioUpcomingEarningsCard } from "./PortfolioUpcomingEarningsCard";

type PortfolioBottomGridProps = {
  portfolioData: PortfolioData;
  locale: string;
  startIndex?: number;
};

export const PortfolioBottomGrid = ({
  portfolioData,
  locale,
  startIndex = 0,
}: PortfolioBottomGridProps) => {
  const prefersReducedMotion = useReducedMotion();
  const cards = [
    <PortfolioTopMoversCard
      key="top-movers"
      movers={portfolioData.topMovers}
      locale={locale}
    />,
    <PortfolioUpcomingEarningsCard
      key="upcoming-earnings"
      earnings={portfolioData.upcomingEarnings}
      locale={locale}
    />,
    <PortfolioAiInsightCard
      key="ai-insight"
      insight={portfolioData.aiInsight}
      locale={locale}
    />,
    <PortfolioRecentActivityCard
      key="recent-activity"
      activities={portfolioData.recentActivity}
      locale={locale}
    />,
  ];

  return (
    <Grid>
      {cards.map((card, index) => (
        <MotionCell
          key={card.key}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="show"
          variants={fadeUpVariants}
          transition={getCardRevealTransition(
            startIndex + index,
            prefersReducedMotion,
          )}
        >
          {card}
        </MotionCell>
      ))}
    </Grid>
  );
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: 1320px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    -webkit-overflow-scrolling: touch;
  }
`;

const MotionCell = styled(motion.div)`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;

  & > * {
    flex: 1;
    min-block-size: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex: 0 0 min(82vw, 20rem);
    scroll-snap-align: start;
  }
`;
