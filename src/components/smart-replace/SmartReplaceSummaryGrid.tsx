"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { SmartReplaceSummaryMetric } from "@/data/smart-replace/smart-replace.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
} from "@/utils/motion/transitions";
import { SmartReplaceMetricCard } from "./SmartReplaceMetricCard";

type SmartReplaceSummaryGridProps = {
  metrics: SmartReplaceSummaryMetric[];
  locale: string;
  replayKey: number;
};

export const SmartReplaceSummaryGrid = ({
  metrics,
  locale,
  replayKey,
}: SmartReplaceSummaryGridProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Grid>
      {metrics.map((metric, index) => (
        <MotionCard
          key={metric.kind}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="show"
          variants={fadeUpVariants}
          transition={getCardRevealTransition(index + 1, prefersReducedMotion)}
        >
          <SmartReplaceMetricCard
            metric={metric}
            locale={locale}
            cardIndex={index}
            replayKey={replayKey}
          />
        </MotionCard>
      ))}
    </Grid>
  );
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
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

const MotionCard = styled(motion.div)`
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
