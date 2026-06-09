"use client";

import styled from "styled-components";
import type { ReportsPageData } from "@/data/reports/reports.types";
import type { DataState } from "@/data/ui/ui-state.types";
import { AllocationBreakdownTable } from "./AllocationBreakdownTable";
import { AllocationReportCard } from "./AllocationReportCard";
import { TopContributorsCard } from "./TopContributorsCard";

type ReportsAllocationTabProps = {
  pageData: ReportsPageData;
  locale: string;
  dataState?: DataState;
};

export const ReportsAllocationTab = ({
  pageData,
  locale,
  dataState,
}: ReportsAllocationTabProps) => (
  <Stack>
    <MainRow>
      <AllocationBreakdownTable
        sectorDetails={pageData.allocationSectorDetails}
        totalValue={pageData.totalValue}
        currency={pageData.currency}
        locale={locale}
        dataState={dataState}
      />
      <AllocationReportCard
        segments={pageData.allocation}
        totalValue={pageData.totalValue}
        currency={pageData.currency}
        locale={locale}
        dataState={dataState}
      />
    </MainRow>

    <TopContributorsCard
      contributors={pageData.contributors}
      currency={pageData.currency}
      locale={locale}
    />
  </Stack>
);

// ─── Styled Components ────────────────────────────────────────────────────────

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MainRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
