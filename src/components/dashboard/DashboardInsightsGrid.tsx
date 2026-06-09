"use client";

import { motion, useReducedMotion } from "framer-motion";
import styled from "styled-components";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";
import { AiPortfolioInsightCard } from "./AiPortfolioInsightCard";
import { PortfolioPerformanceCard } from "./PortfolioPerformanceCard";
import { TopMoversCard } from "./TopMoversCard";
import { UpcomingEarningsCard } from "./UpcomingEarningsCard";
import type { DashboardData } from "@/data/dashboard/dashboard.types";
import type { DataFreshnessStatus, DataState } from "@/data/ui/ui-state.types";

type DashboardInsightsGridProps = {
  dashboardData: DashboardData;
  locale: string;
  freshnessStatus?: DataFreshnessStatus;
  startIndex?: number;
  dataState?: DataState;
};

export const DashboardInsightsGrid = ({
  dashboardData,
  locale,
  freshnessStatus = "mock",
  startIndex = 0,
  dataState,
}: DashboardInsightsGridProps) => {
  const prefersReducedMotion = useReducedMotion();

  const performanceDataState =
    dataState ??
    (dashboardData.performance.length === 0 ? "empty" : undefined);
  const aiInsightDataState =
    dataState ?? (dashboardData.aiInsight === null ? "empty" : undefined);

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(startIndex + index, prefersReducedMotion),
  });

  return (
    <Grid>
      <PrimaryRow>
        <MotionCell {...reveal(0)}>
          <PortfolioPerformanceCard
            data={dashboardData.performance}
            locale={locale}
            freshnessStatus={freshnessStatus}
            dataState={performanceDataState}
          />
        </MotionCell>
        <MotionCell {...reveal(1)}>
          <AiPortfolioInsightCard
            insight={dashboardData.aiInsight}
            locale={locale}
            dataState={aiInsightDataState}
          />
        </MotionCell>
      </PrimaryRow>
      <SecondaryRow>
        <MotionCell {...reveal(2)}>
          <TopMoversCard holdings={dashboardData.holdings} locale={locale} />
        </MotionCell>
        <MotionCell {...reveal(3)}>
          <UpcomingEarningsCard
            earnings={dashboardData.upcomingEarnings}
            locale={locale}
          />
        </MotionCell>
      </SecondaryRow>
    </Grid>
  );
};

const Grid = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const PrimaryRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(20rem, 1fr);
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const SecondaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
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
`;
