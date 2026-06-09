"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import type { MonthlySummaryItem } from "@/data/reports/reports.types";
import { useAppStore } from "@/store/app.store";
import { convertCurrency } from "@/utils/currencies/convertCurrency";
import { formatMoney } from "@/utils/currencies/formatMoney";
import { formatPercent } from "@/utils/formatting/formatPercent";

type MonthlySummaryCardProps = {
  items: MonthlySummaryItem[];
  locale: string;
  monthLabel: string;
};

export const MonthlySummaryCard = ({
  items,
  locale,
  monthLabel,
}: MonthlySummaryCardProps) => {
  const t = useTranslations("reports.monthly");
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);

  const formatValue = (item: MonthlySummaryItem) => {
    if (item.kind === "percent") {
      return formatPercent(item.value, { locale, showSign: true });
    }
    if (item.kind === "count") {
      return String(item.value);
    }
    const amount = convertCurrency({
      amount: item.value,
      fromCurrency: item.currency ?? "USD",
      toCurrency: displayCurrency,
      fxRates,
    });
    return formatMoney(amount, displayCurrency, { locale });
  };

  return (
    <Card>
      <Title>{t("title")}</Title>
      <MonthLabel>{monthLabel}</MonthLabel>
      <List>
        {items.map((item) => (
          <Row key={item.key}>
            <Label>{t(item.key)}</Label>
            <Value $tone={item.tone ?? "neutral"}>{formatValue(item)}</Value>
          </Row>
        ))}
      </List>
    </Card>
  );
};

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

const MonthLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.xs};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-block-end: none;
  }
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const Value = styled.span<{ $tone: "positive" | "negative" | "neutral" }>`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  ${({ theme, $tone }) =>
    $tone === "positive"
      ? css`color: ${theme.colors.status.positive};`
      : $tone === "negative"
        ? css`color: ${theme.colors.status.negative};`
        : css`color: ${theme.colors.text.primary};`}
`;
