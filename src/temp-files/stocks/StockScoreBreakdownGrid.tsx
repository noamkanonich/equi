"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { StockScoreBreakdownItem } from "@/data/stocks/stock-analysis.types";
import {
  fadeUpVariants,
  getCardRevealTransition,
  staggerContainerVariants,
} from "@/utils/motion/transitions";
import { StockScoreBreakdownCard } from "./StockScoreBreakdownCard";

type StockScoreBreakdownGridProps = {
  items: StockScoreBreakdownItem[];
  startIndex?: number;
};

export const StockScoreBreakdownGrid = ({
  items,
  startIndex = 0,
}: StockScoreBreakdownGridProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Grid
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={staggerContainerVariants(0.06, 0.02)}
    >
      {items.map((item, index) => (
        <MotionCell
          key={item.category}
          variants={fadeUpVariants}
          transition={getCardRevealTransition(
            startIndex + index,
            prefersReducedMotion,
          )}
        >
          <StockScoreBreakdownCard item={item} />
        </MotionCell>
      ))}
    </Grid>
  );
};

const Grid = styled(motion.section)`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
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
    flex: 0 0 min(72vw, 16rem);
    scroll-snap-align: start;
  }
`;
