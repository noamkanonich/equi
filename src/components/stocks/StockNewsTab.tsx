"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockLatestNewsCard } from "./StockLatestNewsCard";

type StockNewsTabProps = {
  stock: StockAnalysisData;
};

export const StockNewsTab = ({ stock }: StockNewsTabProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <TabPanel
      as={motion.div}
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={fadeUpVariants}
      transition={getCardRevealTransition(0, prefersReducedMotion)}
    >
      <StockLatestNewsCard news={stock.latestNews} />
    </TabPanel>
  );
};

const TabPanel = styled.div`
  max-inline-size: 48rem;
`;
