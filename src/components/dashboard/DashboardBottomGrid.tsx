"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { AssetAllocationCard } from "./AssetAllocationCard";
import { RecentActivityCard } from "./RecentActivityCard";
import { ScoreDistributionCard } from "./ScoreDistributionCard";
import { SectorExposureCard } from "./SectorExposureCard";
import type { DashboardData } from "@/data/dashboard/dashboard.types";

type DashboardBottomGridProps = {
  dashboardData: DashboardData;
  locale: string;
  startIndex?: number;
};

export const DashboardBottomGrid = ({
  dashboardData,
  locale,
  startIndex = 0,
}: DashboardBottomGridProps) => {
  const prefersReducedMotion = useReducedMotion();

  const cards = [
    <AssetAllocationCard
      key="asset-allocation"
      segments={dashboardData.assetAllocation}
      locale={locale}
    />,
    <SectorExposureCard
      key="sector-exposure"
      segments={dashboardData.sectorExposure}
      locale={locale}
    />,
    <RecentActivityCard
      key="recent-activity"
      activities={dashboardData.recentActivities}
      locale={locale}
    />,
    <ScoreDistributionCard
      key="score-distribution"
      segments={dashboardData.scoreDistribution}
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
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
