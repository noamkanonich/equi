"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type {
  NextMovesAiSummary,
  PortfolioHealthSummary,
  RiskFactor,
  UpcomingPortfolioEvent,
} from "@/data/next-moves/next-moves.types";
import { getCardRevealTransition, fadeUpVariants } from "@/utils/motion/transitions";
import { NextMovesAiSummaryCard } from "./NextMovesAiSummaryCard";
import { PortfolioHealthCard } from "./PortfolioHealthCard";
import { TopRiskFactorsCard } from "./TopRiskFactorsCard";
import { UpcomingEventsCard } from "./UpcomingEventsCard";

type NextMovesSidebarProps = {
  portfolioHealth: PortfolioHealthSummary;
  riskFactors: RiskFactor[];
  upcomingEvents: UpcomingPortfolioEvent[];
  aiSummary: NextMovesAiSummary;
  locale: string;
  startIndex: number;
};

export const NextMovesSidebar = ({
  portfolioHealth,
  riskFactors,
  upcomingEvents,
  aiSummary,
  locale,
  startIndex,
}: NextMovesSidebarProps) => {
  const prefersReducedMotion = useReducedMotion();

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <Sidebar>
      <MotionSection {...reveal(startIndex)}>
        <PortfolioHealthCard summary={portfolioHealth} />
      </MotionSection>
      <MotionSection {...reveal(startIndex + 1)}>
        <TopRiskFactorsCard riskFactors={riskFactors} />
      </MotionSection>
      <MotionSection {...reveal(startIndex + 2)}>
        <UpcomingEventsCard events={upcomingEvents} locale={locale} />
      </MotionSection>
      <MotionSection {...reveal(startIndex + 3)}>
        <NextMovesAiSummaryCard summary={aiSummary} />
      </MotionSection>
    </Sidebar>
  );
};

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;
