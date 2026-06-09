"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import type { TaxLotItem, TaxSummaryItem, ReportsPageData } from "@/data/reports/reports.types";
import type { DataState } from "@/data/ui/ui-state.types";
import { formatDate } from "@/utils/formatting/formatDate";

type ReportsTaxesTabProps = {
  pageData: ReportsPageData;
  locale: string;
  dataState?: DataState;
};

type ToneProps = { $tone: "positive" | "negative" | "neutral" };

export const ReportsTaxesTab = ({ pageData, locale }: ReportsTaxesTabProps) => {
  const t = useTranslations("reports.taxes");

  return (
    <TabStack>
      <SummaryCard $padding="lg">
        <CardTitle>{t("summaryTitle")}</CardTitle>
        <SummaryGrid>
          {pageData.taxSummary.map((item: TaxSummaryItem) => (
            <SummaryItem key={item.key}>
              <SummaryLabel>{t(`summary.${item.key}`)}</SummaryLabel>
              <SummaryValue $tone={item.tone ?? "neutral"}>
                {item.kind === "money" && item.currency ? (
                  <DisplayMoney
                    amount={item.value}
                    currency={item.currency}
                    locale={locale}
                  />
                ) : item.kind === "percent" ? (
                  `${item.value}%`
                ) : (
                  String(item.value)
                )}
              </SummaryValue>
            </SummaryItem>
          ))}
        </SummaryGrid>
      </SummaryCard>

      <LotsCard $padding="lg">
        <CardTitle>{t("lotsTitle")}</CardTitle>
        <TableWrap>
          <LotsTable>
            <thead>
              <tr>
                <Th>{t("cols.holding")}</Th>
                <Th $align="end">{t("cols.shares")}</Th>
                <Th $align="end">{t("cols.costBasis")}</Th>
                <Th $align="end">{t("cols.currentValue")}</Th>
                <Th $align="end">{t("cols.gainLoss")}</Th>
                <Th $align="center">{t("cols.term")}</Th>
                <Th $align="end">{t("cols.acquired")}</Th>
              </tr>
            </thead>
            <tbody>
              {pageData.taxLots.map((lot: TaxLotItem) => (
                <LotRow key={`${lot.symbol}-${lot.acquiredDate}`}>
                  <Td>
                    <HoldingName>
                      <Symbol>{lot.symbol}</Symbol>
                      <CompanyName>{lot.companyName}</CompanyName>
                    </HoldingName>
                  </Td>
                  <Td $align="end">{lot.shares}</Td>
                  <Td $align="end">
                    <DisplayMoney amount={lot.costBasis} currency={lot.currency} locale={locale} />
                  </Td>
                  <Td $align="end">
                    <DisplayMoney amount={lot.currentValue} currency={lot.currency} locale={locale} />
                  </Td>
                  <Td $align="end">
                    <GainLoss $tone={lot.tone}>
                      <DisplayMoney
                        amount={lot.gainLoss}
                        currency={lot.currency}
                        locale={locale}
                      />
                      <GainPercent>
                        ({lot.gainLoss >= 0 ? "+" : ""}
                        {lot.gainLossPercent.toFixed(1)}%)
                      </GainPercent>
                    </GainLoss>
                  </Td>
                  <Td $align="center">
                    <TermBadge $long={lot.holdingPeriod === "long"}>
                      {t(`term.${lot.holdingPeriod}`)}
                    </TermBadge>
                  </Td>
                  <Td $align="end">{formatDate(lot.acquiredDate, { locale })}</Td>
                </LotRow>
              ))}
            </tbody>
          </LotsTable>
        </TableWrap>
      </LotsCard>

      <DisclaimerCard $padding="lg">
        <DisclaimerText>{t("disclaimer")}</DisclaimerText>
      </DisclaimerCard>
    </TabStack>
  );
};

const TabStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SummaryCard = styled(Card)``;
const LotsCard = styled(Card)``;
const DisclaimerCard = styled(Card)``;

const CardTitle = styled.h2`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const SummaryGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const SummaryLabel = styled.dt`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
`;

const SummaryValue = styled.dd<ToneProps>`
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "negative"
        ? theme.colors.status.negative
        : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const LotsTable = styled.table`
  inline-size: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const Th = styled.th<{ $align?: "start" | "end" | "center" }>`
  padding-block: ${({ theme }) => theme.spacing.sm};
  padding-inline: ${({ theme }) => theme.spacing.sm};
  text-align: ${({ $align }) => $align ?? "start"};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  white-space: nowrap;
`;

const LotRow = styled.tr`
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  &:last-child {
    border-block-end: none;
  }
`;

const Td = styled.td<{ $align?: "start" | "end" | "center" }>`
  padding-block: ${({ theme }) => theme.spacing.sm};
  padding-inline: ${({ theme }) => theme.spacing.sm};
  text-align: ${({ $align }) => $align ?? "start"};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
`;

const HoldingName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Symbol = styled.span`
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const CompanyName = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const GainLoss = styled.span<ToneProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "negative"
        ? theme.colors.status.negative
        : theme.colors.text.primary};
`;

const GainPercent = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  opacity: 0.8;
`;

const TermBadge = styled.span<{ $long: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-block: 2px;
  padding-inline: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  background: ${({ theme, $long }) =>
    $long ? theme.colors.status.positiveSoft : theme.colors.status.warningSoft};
  color: ${({ theme, $long }) =>
    $long ? theme.colors.status.positive : theme.colors.status.warning};
`;

const DisclaimerText = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
