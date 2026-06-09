"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import type {
  StockAnalysisData,
  StockAnalysisTabKey,
} from "@/data/stocks/stock-analysis.types";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockAiInsightCard } from "./StockAiInsightCard";
import { StockAnalysisSidebar } from "./StockAnalysisSidebar";
import { StockKeyMetricsCard } from "./StockKeyMetricsCard";
import { StockLatestNewsCard } from "./StockLatestNewsCard";
import { StockPriceChartCard } from "./StockPriceChartCard";
import { StockScoreBreakdownGrid } from "./StockScoreBreakdownGrid";

type StockOverviewTabProps = {
  stock: StockAnalysisData;
  locale: string;
  onNavigateToTab?: (tab: StockAnalysisTabKey) => void;
};

export const StockOverviewTab = ({
  stock,
  locale,
  onNavigateToTab,
}: StockOverviewTabProps) => {
  const prefersReducedMotion = useReducedMotion();

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <Grid>
      <MainColumn>
        <MotionSection {...reveal(0)}>
          <StockPriceChartCard stock={stock} locale={locale} />
        </MotionSection>

        <MotionSection {...reveal(1)}>
          <StockScoreBreakdownGrid items={stock.scoreBreakdown ?? []} startIndex={2} />
        </MotionSection>

        <MotionSection {...reveal(6)}>
          <StockAiInsightCard insight={stock.aiInsight} />
        </MotionSection>

        <BottomGrid>
          <MotionSection {...reveal(7)}>
            <StockKeyMetricsCard
              metrics={stock.keyMetrics ?? []}
              locale={locale}
              onViewMore={() => onNavigateToTab?.("fundamentals")}
            />
          </MotionSection>
          <MotionSection {...reveal(8)}>
            <StockLatestNewsCard
              news={stock.latestNews ?? []}
              onViewAll={() => onNavigateToTab?.("news")}
            />
          </MotionSection>
        </BottomGrid>
      </MainColumn>

      <SidebarColumn>
        <StockAnalysisSidebar stock={stock} locale={locale} startIndex={1} />
      </SidebarColumn>
    </Grid>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 360px);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;
`;

const SidebarColumn = styled.div`
  min-inline-size: 0;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;
