"use client";

import { Download, FileText, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { DataFreshnessBadge } from "@/components/ui/states/DataFreshnessBadge";
import type { DataFreshnessStatus } from "@/data/ui/ui-state.types";
import { ReportsPeriodFilter } from "./ReportsPeriodFilter";
import type { ReportPeriodKey } from "@/data/reports/reports.types";

type ReportsHeaderProps = {
  title: string;
  subtitle: string;
  period: ReportPeriodKey;
  onPeriodChange: (period: ReportPeriodKey) => void;
  freshnessStatus: DataFreshnessStatus;
  isRefreshing: boolean;
  onExport: () => void;
  onRefresh: () => void;
};

export const ReportsHeader = ({
  title,
  subtitle,
  period,
  onPeriodChange,
  freshnessStatus,
  isRefreshing,
  onExport,
  onRefresh,
}: ReportsHeaderProps) => {
  const t = useTranslations("reports");

  return (
    <Header>
      <TopRow>
        <TitleGroup>
          <IconWrap aria-hidden>
            <FileText size={20} strokeWidth={1.9} />
          </IconWrap>
          <Copy>
            <TitleRow>
              <Title>{title}</Title>
              <DataFreshnessBadge status={freshnessStatus} />
            </TitleRow>
            <Subtitle>{subtitle}</Subtitle>
          </Copy>
        </TitleGroup>
        <Actions>
          <Button $variant="secondary" onClick={onExport}>
            <Download size={16} strokeWidth={1.9} aria-hidden />
            {t("exportReport")}
          </Button>
          <Button onClick={onRefresh} disabled={isRefreshing} aria-busy={isRefreshing}>
            <RefreshCw size={16} strokeWidth={1.9} aria-hidden />
            {t("refresh")}
          </Button>
        </Actions>
      </TopRow>
      <ToolbarRow>
        <ReportsPeriodFilter period={period} onPeriodChange={onPeriodChange} />
      </ToolbarRow>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block-start: ${({ theme }) => theme.spacing.xs};
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;

    button {
      flex: 1;
      min-inline-size: 0;
    }
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
