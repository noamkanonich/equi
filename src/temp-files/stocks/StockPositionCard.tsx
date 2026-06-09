"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { Link } from "@/i18n/routing";
import type { StockUserPosition } from "@/data/stocks/stock-analysis.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

type StockPositionCardProps = {
  position: StockUserPosition | null;
  locale: string;
};

export const StockPositionCard = ({ position, locale }: StockPositionCardProps) => {
  const t = useTranslations("stockAnalysis");

  if (!position) {
    return (
      <Card>
        <Header>
          <Title>{t("position.title")}</Title>
        </Header>
        <EmptyText>{t("position.noPosition")}</EmptyText>
      </Card>
    );
  }

  const dayPositive = position.dayGainLoss >= 0;
  const totalPositive = position.totalGainLoss >= 0;

  return (
    <Card>
      <Header>
        <Title>{t("position.title")}</Title>
        <ViewLink href="/portfolio">{t("position.viewInPortfolio")}</ViewLink>
      </Header>

      <Grid>
        <Metric>
          <MetricLabel>{t("position.shares")}</MetricLabel>
          <MetricValue>{position.shares}</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>{t("position.avgCost")}</MetricLabel>
          <MetricValue>
            <DisplayMoney
              amount={position.avgCost}
              currency={position.currency}
              locale={locale}
            />
          </MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>{t("position.marketValue")}</MetricLabel>
          <MetricValue>
            <DisplayMoney
              amount={position.marketValue}
              currency={position.currency}
              locale={locale}
            />
          </MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>{t("position.dayGainLoss")}</MetricLabel>
          <ToneValue $positive={dayPositive}>
            <DisplayMoney
              amount={position.dayGainLoss}
              currency={position.currency}
              locale={locale}
              inheritColor
            />
            <span>({formatPercent(position.dayGainLossPercent, { locale })})</span>
          </ToneValue>
        </Metric>
        <Metric $full>
          <MetricLabel>{t("position.totalGainLoss")}</MetricLabel>
          <ToneValue $positive={totalPositive}>
            <DisplayMoney
              amount={position.totalGainLoss}
              currency={position.currency}
              locale={locale}
              inheritColor
            />
            <span>({formatPercent(position.totalGainLossPercent, { locale })})</span>
          </ToneValue>
        </Metric>
      </Grid>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ViewLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const Metric = styled.div<{ $full?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  ${({ $full }) =>
    $full
      ? css`
          grid-column: 1 / -1;
        `
      : ""}
`;

const MetricLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const MetricValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const ToneValue = styled.span<{ $positive: boolean }>`
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.status.positive : theme.colors.status.negative};
`;
