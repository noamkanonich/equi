"use client";

import styled from "styled-components";
import type {
  ReportBenchmarkKey,
  ReportPerformanceSeries,
  ReportsPageData,
} from "@/data/reports/reports.types";
import type { DataState } from "@/data/ui/ui-state.types";
import { AllocationReportCard } from "./AllocationReportCard";
import { AvailableReportsSection } from "./AvailableReportsSection";
import { KeyStatisticsCard } from "./KeyStatisticsCard";
import { MonthlySummaryCard } from "./MonthlySummaryCard";
import { PerformanceReportChart } from "./PerformanceReportChart";
import { ReportsMetricGrid } from "./ReportsMetricGrid";
import { TopContributorsCard } from "./TopContributorsCard";

type ReportsOverviewTabProps = {
  pageData: ReportsPageData;
  performanceSeries: ReportPerformanceSeries;
  benchmark: ReportBenchmarkKey;
  onBenchmarkChange: (benchmark: ReportBenchmarkKey) => void;
  locale: string;
  monthLabel: string;
  dataState?: DataState;
  onDownload: (reportId: string) => void;
  onViewAllReports: () => void;
};

export const ReportsOverviewTab = ({
  pageData,
  performanceSeries,
  benchmark,
  onBenchmarkChange,
  locale,
  monthLabel,
  dataState,
  onDownload,
  onViewAllReports,
}: ReportsOverviewTabProps) => (
  <OverviewStack>
    <ReportsMetricGrid metrics={pageData.metrics} locale={locale} />
    <ChartsRow>
      <PerformanceReportChart
        series={performanceSeries}
        benchmark={benchmark}
        onBenchmarkChange={onBenchmarkChange}
        locale={locale}
        dataState={dataState}
        freshnessStatus={pageData.freshnessStatus}
      />
      <AllocationReportCard
        segments={pageData.allocation}
        totalValue={pageData.totalValue}
        currency={pageData.currency}
        locale={locale}
        dataState={dataState}
      />
    </ChartsRow>
    <SecondaryRow>
      <TopContributorsCard
        contributors={pageData.contributors}
        currency={pageData.currency}
        locale={locale}
      />
      <KeyStatisticsCard
        statistics={pageData.keyStatistics}
        freshnessStatus={pageData.freshnessStatus}
      />
      <MonthlySummaryCard
        items={pageData.monthlySummary}
        locale={locale}
        monthLabel={monthLabel}
      />
    </SecondaryRow>
    <AvailableReportsSection
      reports={pageData.availableReports}
      onDownload={onDownload}
      onViewAll={onViewAllReports}
    />
  </OverviewStack>
);

const OverviewStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const SecondaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
