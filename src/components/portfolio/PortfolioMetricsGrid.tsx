"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { PortfolioMetric } from "@/data/portfolio/portfolio.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { PortfolioMetricCard } from "./PortfolioMetricCard";

type PortfolioMetricsGridProps = {
  metrics: PortfolioMetric[];
  holdingsCount: number;
  locale: string;
  startIndex?: number;
};

export const PortfolioMetricsGrid = ({
  metrics,
  holdingsCount,
  locale,
  startIndex = 0,
}: PortfolioMetricsGridProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Grid>
      {metrics.map((metric, index) => (
        <MotionCell
          key={metric.kind}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="show"
          variants={fadeUpVariants}
          transition={getCardRevealTransition(
            startIndex + index,
            prefersReducedMotion,
          )}
        >
          <PortfolioMetricCard
            metric={metric}
            holdingsCount={holdingsCount}
            locale={locale}
            cardIndex={index}
          />
        </MotionCell>
      ))}
    </Grid>
  );
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: 1320px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex: 0 0 min(82vw, 20rem);
    scroll-snap-align: start;
  }
`;
