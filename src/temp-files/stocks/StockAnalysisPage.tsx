"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import styled from "styled-components";
import { getStockAnalysisBySymbol } from "@/data/stocks/mappers";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { StockAiInsightCard } from "./StockAiInsightCard";
import { StockAnalysisSidebar } from "./StockAnalysisSidebar";
import { StockBreadcrumb } from "./StockBreadcrumb";
import { StockHeaderCard } from "./StockHeaderCard";
import { StockKeyMetricsCard } from "./StockKeyMetricsCard";
import { StockLatestNewsCard } from "./StockLatestNewsCard";
import { StockPriceChartCard } from "./StockPriceChartCard";
import { StockScoreBreakdownGrid } from "./StockScoreBreakdownGrid";

type StockAnalysisPageProps = {
  symbol: string;
  locale: string;
};

export const StockAnalysisPage = ({ symbol, locale }: StockAnalysisPageProps) => {
  const prefersReducedMotion = useReducedMotion();
  const stock = useMemo(() => getStockAnalysisBySymbol(symbol), [symbol]);

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  return (
    <Wrapper>
      <MotionFull {...reveal(0)}>
        <StockBreadcrumb symbol={stock.symbol} />
      </MotionFull>

      <Grid>
        <MainColumn>
          <MotionSection {...reveal(1)}>
            <StockHeaderCard stock={stock} locale={locale} />
          </MotionSection>

          <MotionSection {...reveal(2)}>
            <StockPriceChartCard stock={stock} locale={locale} />
          </MotionSection>

          <MotionSection {...reveal(3)}>
            <StockScoreBreakdownGrid
              items={stock.scoreBreakdown}
              startIndex={4}
            />
          </MotionSection>

          <MotionSection {...reveal(8)}>
            <StockAiInsightCard insight={stock.aiInsight} />
          </MotionSection>

          <BottomGrid>
            <MotionSection {...reveal(9)}>
              <StockKeyMetricsCard metrics={stock.keyMetrics} locale={locale} />
            </MotionSection>
            <MotionSection {...reveal(10)}>
              <StockLatestNewsCard news={stock.latestNews} />
            </MotionSection>
          </BottomGrid>
        </MainColumn>

        <SidebarColumn>
          <StockAnalysisSidebar stock={stock} locale={locale} startIndex={1} />
        </SidebarColumn>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  inline-size: 100%;
  max-inline-size: 92rem;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

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

const MotionFull = styled(motion.div)`
  min-inline-size: 0;
`;

const MotionSection = styled(motion.div)`
  min-inline-size: 0;
`;
