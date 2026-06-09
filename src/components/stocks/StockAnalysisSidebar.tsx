"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockActionButtons } from "./StockActionButtons";
import { StockAnalystTargetCard } from "./StockAnalystTargetCard";
import { StockPositionCard } from "./StockPositionCard";
import { StockQuickActionsCard } from "./StockQuickActionsCard";
import { StockThesisNotesCard } from "./StockThesisNotesCard";

type StockAnalysisSidebarProps = {
  stock: StockAnalysisData;
  locale: string;
  startIndex?: number;
};

export const StockAnalysisSidebar = ({
  stock,
  locale,
  startIndex = 0,
}: StockAnalysisSidebarProps) => {
  const prefersReducedMotion = useReducedMotion();

  const cards = [
    <StockActionButtons
      key="actions"
      symbol={stock.symbol}
      currentPrice={stock.currentPrice}
      currency={stock.currency}
    />,
    <StockAnalystTargetCard
      key="analyst"
      analystTarget={stock.analystTarget}
      currency={stock.currency}
      locale={locale}
    />,
    <StockPositionCard key="position" position={stock.userPosition} locale={locale} />,
    <StockQuickActionsCard key="quick-actions" symbol={stock.symbol} />,
    <StockThesisNotesCard
      key="thesis"
      symbol={stock.symbol}
      thesisNotes={stock.thesisNotes}
    />,
  ];

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

const Wrapper = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const MotionCell = styled(motion.div)`
  min-inline-size: 0;
`;
