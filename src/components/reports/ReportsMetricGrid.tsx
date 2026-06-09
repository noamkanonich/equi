"use client";

import styled from "styled-components";
import type { ReportMetricCard as ReportMetricCardData } from "@/data/reports/reports.types";
import { ReportMetricCard } from "./ReportMetricCard";

type ReportsMetricGridProps = {
  metrics: ReportMetricCardData[];
  locale: string;
};

export const ReportsMetricGrid = ({ metrics, locale }: ReportsMetricGridProps) => (
  <Grid>
    {metrics.map((metric, index) => (
      <ReportMetricCard key={metric.kind} metric={metric} locale={locale} cardIndex={index} />
    ))}
  </Grid>
);

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
