"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { chartCardHover } from "@/components/charts/chartCardChrome";
import { Link } from "@/i18n/routing";
import type { ContributorReportItem } from "@/data/reports/reports.types";
import { useAppStore } from "@/store/app.store";
import { convertCurrency } from "@/utils/currencies/convertCurrency";
import { formatMoney } from "@/utils/currencies/formatMoney";
import { formatPercent } from "@/utils/formatting/formatPercent";
import type { CurrencyCode } from "@/data/currencies/currency.types";

type TopContributorsCardProps = {
  contributors: ContributorReportItem[];
  currency: CurrencyCode;
  locale: string;
};

export const TopContributorsCard = ({
  contributors,
  currency,
  locale,
}: TopContributorsCardProps) => {
  const t = useTranslations("reports.contributors");
  const displayCurrency = useAppStore((state) => state.displayCurrency);
  const fxRates = useAppStore((state) => state.fxRates);

  return (
    <Card>
      <Title>{t("title")}</Title>
      <List>
        {contributors.map((item) => {
          const amount = convertCurrency({
            amount: item.contributionAmount,
            fromCurrency: currency,
            toCurrency: displayCurrency,
            fxRates,
          });

          const label = item.isCash ? t("cash") : item.symbol;
          const name = item.isCash ? t("cash") : item.companyName;

          return (
            <Row key={item.symbol}>
              <RowStart>
                {item.isCash ? (
                  <Symbol dir="ltr">{label}</Symbol>
                ) : (
                  <SymbolLink href={`/stocks/${item.symbol}`} dir="ltr">
                    {label}
                  </SymbolLink>
                )}
                <Name>{name}</Name>
              </RowStart>
              <BarTrack>
                <BarFill
                  $tone={item.tone}
                  style={{ inlineSize: `${Math.max(item.barPercent, 4)}%` }}
                />
              </BarTrack>
              <RowEnd $tone={item.tone}>
                <Amount>
                  {formatMoney(amount, displayCurrency, { locale })}
                </Amount>
                <Percent>
                  {formatPercent(item.contributionPercent, {
                    locale,
                    showSign: true,
                  })}
                </Percent>
              </RowEnd>
            </Row>
          );
        })}
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

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(4rem, 5rem) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const RowStart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-inline-size: 0;
`;

const Symbol = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const SymbolLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Name = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarTrack = styled.div`
  block-size: 0.375rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.elevated};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: 1 / -1;
  }
`;

const BarFill = styled.span<{ $tone: "positive" | "negative" | "neutral" }>`
  display: block;
  block-size: 100%;
  border-radius: inherit;
  ${({ theme, $tone }) =>
    $tone === "positive"
      ? css`background: ${theme.colors.status.positive};`
      : $tone === "negative"
        ? css`background: ${theme.colors.status.negative};`
        : css`background: ${theme.colors.text.muted};`}
`;

const RowEnd = styled.div<{ $tone: "positive" | "negative" | "neutral" }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  text-align: end;
  ${({ theme, $tone }) =>
    $tone === "positive"
      ? css`color: ${theme.colors.status.positive};`
      : $tone === "negative"
        ? css`color: ${theme.colors.status.negative};`
        : css`color: ${theme.colors.text.secondary};`}
`;

const Amount = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Percent = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
`;
