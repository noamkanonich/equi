"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { mapHoldingsToTopMovers } from "@/data/dashboard/mappers";
import type { DashboardHolding } from "@/data/dashboard/dashboard.types";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { StockLogo } from "@/components/ui/StockLogo";
import { formatPercent } from "@/utils/formatting/formatPercent";

type TopMoversCardProps = {
  holdings: DashboardHolding[];
  locale: string;
};

export const TopMoversCard = ({ holdings, locale }: TopMoversCardProps) => {
  const t = useTranslations("dashboard");
  const movers = mapHoldingsToTopMovers(holdings);

  return (
    <Card>
      <Title>{t("cards.topMovers")}</Title>
      <List>
        {movers.map((mover) => (
          <Row key={mover.symbol}>
            <StockLogo
              symbol={mover.symbol}
              companyName={mover.companyName}
              logoUrl={mover.logoUrl}
            />
            <Symbol dir="ltr">{mover.symbol}</Symbol>
            <Company>{mover.companyName}</Company>
            <Price>
              <DisplayMoney
                amount={mover.currentPrice}
                currency={mover.currency}
                locale={locale}
                layout="inline"
              />
            </Price>
            <Change $tone={mover.tone}>
              {formatPercent(mover.dayChangePercent, { locale })}
            </Change>
          </Row>
        ))}
      </List>
    </Card>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
  `,
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-block-end: 0;
  }
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Company = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Price = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;
`;

const Change = styled.strong<{ $tone: "positive" | "negative" | "neutral" }>`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  white-space: nowrap;
  ${({ $tone }) => toneStyles[$tone]}
`;

