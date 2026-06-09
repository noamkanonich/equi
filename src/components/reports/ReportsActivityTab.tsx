"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { PortfolioRecentActivityCard } from "@/components/portfolio/PortfolioRecentActivityCard";
import type { ReportsPageData } from "@/data/reports/reports.types";
import type { DataState } from "@/data/ui/ui-state.types";

type ReportsActivityTabProps = {
  pageData: ReportsPageData;
  locale: string;
  dataState?: DataState;
};

export const ReportsActivityTab = ({
  pageData,
  locale,
}: ReportsActivityTabProps) => {
  const t = useTranslations("reports.activity");

  return (
    <TabStack>
      <SectionTitle>{t("title")}</SectionTitle>
      <PortfolioRecentActivityCard
        activities={pageData.activities}
        locale={locale}
        showHeader={false}
        translationNamespace="reports.activity"
      />
    </TabStack>
  );
};

const TabStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;
