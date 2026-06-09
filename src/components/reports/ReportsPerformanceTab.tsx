"use client";

import styled from "styled-components";
import type {
  ReportBenchmarkKey,
  ReportPerformanceSeries,
  ReportsPageData,
} from "@/data/reports/reports.types";
import type { DataState } from "@/data/ui/ui-state.types";
import { KeyStatisticsCard } from "./KeyStatisticsCard";
import { MonthlySummaryCard } from "./MonthlySummaryCard";
import { PerformanceBenchmarkComparisonCard } from "./PerformanceBenchmarkComparisonCard";
import { PerformanceReportChart } from "./PerformanceReportChart";
import { ReportsMetricGrid } from "./ReportsMetricGrid";
import { TopContributorsCard } from "./TopContributorsCard";

type ReportsPerformanceTabProps = {
  pageData: ReportsPageData;
  performanceSeries: ReportPerformanceSeries;
  benchmark: ReportBenchmarkKey;
  onBenchmarkChange: (benchmark: ReportBenchmarkKey) => void;
  locale: string;
  monthLabel: string;
  dataState?: DataState;
};

export const ReportsPerformanceTab = ({
  pageData,
  performanceSeries,
  benchmark,
  onBenchmarkChange,
  locale,
  monthLabel,
  dataState,
}: ReportsPerformanceTabProps) => (
  <Stack>
    <ReportsMetricGrid metrics={pageData.metrics} locale={locale} />

    <PerformanceReportChart
      series={performanceSeries}
      benchmark={benchmark}
      onBenchmarkChange={onBenchmarkChange}
      locale={locale}
      dataState={dataState}
      freshnessStatus={pageData.freshnessStatus}
    />

    <ComparisonRow>
      <PerformanceBenchmarkComparisonCard
        benchmarkComparisons={pageData.benchmarkComparisons}
        portfolioEndPercent={pageData.portfolioEndPercent}
        locale={locale}
      />
      <KeyStatisticsCard
        statistics={pageData.keyStatistics}
        freshnessStatus={pageData.freshnessStatus}
      />
    </ComparisonRow>

    <BottomRow>
      <TopContributorsCard
        contributors={pageData.contributors}
        currency={pageData.currency}
        locale={locale}
      />
      <MonthlySummaryCard
        items={pageData.monthlySummary}
        locale={locale}
        monthLabel={monthLabel}
      />
    </BottomRow>
  </Stack>
);

// ─── Styled Components ────────────────────────────────────────────────────────

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const BottomRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
