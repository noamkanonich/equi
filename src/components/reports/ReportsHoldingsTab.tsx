"use client";

import styled from "styled-components";
import { PortfolioHoldingsTable } from "@/components/portfolio/PortfolioHoldingsTable";
import type { EnrichedPortfolioHolding } from "@/data/portfolio/portfolio.types";
import type { ReportsPageData } from "@/data/reports/reports.types";
import type { DataState } from "@/data/ui/ui-state.types";

type ReportsHoldingsTabProps = {
  pageData: ReportsPageData;
  enrichedHoldings: EnrichedPortfolioHolding[];
  locale: string;
  dataState?: DataState;
};

export const ReportsHoldingsTab = ({
  pageData,
  enrichedHoldings,
  locale,
  dataState,
}: ReportsHoldingsTabProps) => (
  <TabStack>
    <PortfolioHoldingsTable
      holdings={enrichedHoldings}
      totalPortfolioValue={pageData.totalValue}
      locale={locale}
      dataState={dataState}
    />
  </TabStack>
);

const TabStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;
