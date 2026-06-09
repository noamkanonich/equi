"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { FundamentalTrendMetric } from "@/data/stocks/stock-analysis.types";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockFundamentalTrendCard } from "./StockFundamentalTrendCard";

type StockFundamentalTrendGridProps = {
  metrics: FundamentalTrendMetric[];
};

export const StockFundamentalTrendGrid = ({ metrics }: StockFundamentalTrendGridProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Grid>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.kind}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="show"
          variants={fadeUpVariants}
          transition={getCardRevealTransition(index, prefersReducedMotion)}
        >
          <StockFundamentalTrendCard metric={metric} />
        </motion.div>
      ))}
    </Grid>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(18rem, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;
