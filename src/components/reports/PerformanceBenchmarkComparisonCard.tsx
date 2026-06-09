"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import type {
  PerformanceBenchmarkComparisonItem,
  ReportBenchmarkKey,
} from "@/data/reports/reports.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

type PerformanceBenchmarkComparisonCardProps = {
  benchmarkComparisons: PerformanceBenchmarkComparisonItem[];
  portfolioEndPercent: number;
  locale: string;
};

const BENCHMARK_LABEL_KEYS: Record<ReportBenchmarkKey, string> = {
  sp500: "benchmark.sp500",
  nasdaq: "benchmark.nasdaq",
  msciWorld: "benchmark.msciWorld",
};

export const PerformanceBenchmarkComparisonCard = ({
  benchmarkComparisons,
  portfolioEndPercent,
  locale,
}: PerformanceBenchmarkComparisonCardProps) => {
  const t = useTranslations("reports.performance");

  return (
    <Card>
      <Title>{t("benchmarkComparison.title")}</Title>
      <Table>
        <TableHead>
          <tr>
            <Th>{t("benchmarkComparison.benchmarkCol")}</Th>
            <Th $align="end">{t("benchmarkComparison.returnCol")}</Th>
            <Th $align="end">{t("benchmarkComparison.vsPortfolioCol")}</Th>
          </tr>
        </TableHead>
        <tbody>
          <PortfolioRow>
            <Td>
              <RowLabel $isPortfolio>{t("benchmarkComparison.portfolioLabel")}</RowLabel>
            </Td>
            <Td $align="end">
              <ReturnValue $tone="positive">
                {formatPercent(portfolioEndPercent, { locale, showSign: true })}
              </ReturnValue>
            </Td>
            <Td $align="end">
              <NeutralDash>—</NeutralDash>
            </Td>
          </PortfolioRow>
          {benchmarkComparisons.map((item) => (
            <BenchmarkRow key={item.key}>
              <Td>
                <RowLabel>{t(BENCHMARK_LABEL_KEYS[item.key])}</RowLabel>
              </Td>
              <Td $align="end">
                <ReturnValue $tone="neutral">
                  {formatPercent(item.returnPercent, { locale, showSign: true })}
                </ReturnValue>
              </Td>
              <Td $align="end">
                <DeltaChip $tone={item.tone}>
                  {item.deltaVsPortfolio > 0
                    ? t("benchmarkComparison.aheadBy", {
                        delta: formatPercent(item.deltaVsPortfolio, {
                          locale,
                          showSign: false,
                        }),
                      })
                    : item.deltaVsPortfolio < 0
                      ? t("benchmarkComparison.behindBy", {
                          delta: formatPercent(Math.abs(item.deltaVsPortfolio), {
                            locale,
                            showSign: false,
                          }),
                        })
                      : t("benchmarkComparison.matched")}
                </DeltaChip>
              </Td>
            </BenchmarkRow>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

// ─── Styled Components ───────────────────────────────────────────────────────

const Card = styled.section`
  ${chartCardHover}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
  min-inline-size: 0;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const Table = styled.table`
  inline-size: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const Th = styled.th<{ $align?: "start" | "end" }>`
  padding-block-end: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  text-align: ${({ $align }) => $align ?? "start"};

  &:not(:first-child) {
    padding-inline-start: ${({ theme }) => theme.spacing.sm};
  }
`;

const Td = styled.td<{ $align?: "start" | "end" }>`
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  text-align: ${({ $align }) => $align ?? "start"};

  &:not(:first-child) {
    padding-inline-start: ${({ theme }) => theme.spacing.sm};
  }
`;

const PortfolioRow = styled.tr`
  background: ${({ theme }) => theme.colors.background.elevated};

  td {
    border-block-end: 2px solid ${({ theme }) => theme.colors.border.strong};
  }
`;

const BenchmarkRow = styled.tr`
  &:last-child td {
    border-block-end: none;
  }
`;

const RowLabel = styled.span<{ $isPortfolio?: boolean }>`
  display: block;
  color: ${({ theme, $isPortfolio }) =>
    $isPortfolio ? theme.colors.text.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme, $isPortfolio }) =>
    $isPortfolio ? theme.typography.weight.semibold : theme.typography.weight.regular};
`;

const ReturnValue = styled.span<{ $tone: "positive" | "neutral" }>`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme, $tone }) =>
    $tone === "positive" ? theme.colors.status.positive : theme.colors.text.primary};
`;

const NeutralDash = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const DeltaChip = styled.span<{ $tone: "positive" | "negative" | "neutral" }>`
  display: inline-block;
  padding: 2px ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;

  ${({ theme, $tone }) =>
    $tone === "positive"
      ? css`
          background: ${theme.colors.status.positiveSoft};
          color: ${theme.colors.status.positive};
        `
      : $tone === "negative"
        ? css`
            background: ${theme.colors.status.negativeSoft};
            color: ${theme.colors.status.negative};
          `
        : css`
            background: ${theme.colors.background.elevated};
            color: ${theme.colors.text.secondary};
          `}
`;
