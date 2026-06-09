"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AvailableReportItem } from "@/data/reports/reports.types";

type ReportDownloadCardProps = {
  report: AvailableReportItem;
  onDownload: (reportId: string) => void;
};

export const ReportDownloadCard = ({
  report,
  onDownload,
}: ReportDownloadCardProps) => {
  const t = useTranslations("reports.available");
  const FileIcon = report.fileType === "csv" ? FileSpreadsheet : FileText;

  return (
    <Card>
      <IconWrap $fileType={report.fileType} aria-hidden>
        <FileIcon size={20} strokeWidth={1.8} />
      </IconWrap>
      <Copy>
        <Name>{t(report.nameKey)}</Name>
        <Badge $tone={report.fileType === "csv" ? "positive" : "negative"}>
          {report.fileType.toUpperCase()}
        </Badge>
      </Copy>
      <Button
        $variant="secondary"
        $size="sm"
        onClick={() => onDownload(report.id)}
        aria-label={t("download")}
      >
        <Download size={14} strokeWidth={1.9} aria-hidden />
        {t("download")}
      </Button>
    </Card>
  );
};

const Card = styled.article`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
`;

const IconWrap = styled.span<{ $fileType: "pdf" | "csv" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme, $fileType }) =>
    $fileType === "csv" ? theme.colors.status.positive : theme.colors.status.negative};
  background: ${({ theme, $fileType }) =>
    $fileType === "csv"
      ? theme.colors.status.positiveSoft
      : theme.colors.status.negativeSoft};
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  min-inline-size: 0;
`;

const Name = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
