"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { AvailableReportItem } from "@/data/reports/reports.types";
import { ReportDownloadCard } from "./ReportDownloadCard";

type AvailableReportsSectionProps = {
  reports: AvailableReportItem[];
  onDownload: (reportId: string) => void;
  onViewAll: () => void;
};

export const AvailableReportsSection = ({
  reports,
  onDownload,
  onViewAll,
}: AvailableReportsSectionProps) => {
  const t = useTranslations("reports.available");

  return (
    <Section id="available-reports">
      <Header>
        <Title>{t("title")}</Title>
        <ViewAllButton type="button" onClick={onViewAll}>
          {t("viewAll")}
        </ViewAllButton>
      </Header>
      <Grid>
        {reports.map((report) => (
          <ReportDownloadCard
            key={report.id}
            report={report}
            onDownload={onDownload}
          />
        ))}
      </Grid>
    </Section>
  );
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  scroll-margin-block-start: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const ViewAllButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
