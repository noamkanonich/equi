"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import { DashboardMetricCard } from "./DashboardMetricCard";
import type { DashboardMetric } from "@/data/dashboard/dashboard.types";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";

type DashboardMetricsProps = {
  metrics: DashboardMetric[];
  locale: string;
  startIndex?: number;
  replayKey?: number;
};

export const DashboardMetrics = ({
  metrics,
  locale,
  startIndex = 0,
  replayKey = 0,
}: DashboardMetricsProps) => {
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
          <DashboardMetricCard
            metric={metric}
            locale={locale}
            cardIndex={startIndex + index}
            replayKey={replayKey}
          />
        </MotionCell>
      ))}
    </Grid>
  );
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 1320px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

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

