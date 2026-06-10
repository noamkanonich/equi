"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { StockAnalystDetailsModal } from "./StockAnalystDetailsModal";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import type { StockAnalystTarget } from "@/data/stocks/stock-analysis.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

type StockAnalystTargetCardProps = {
  analystTarget: StockAnalystTarget;
  currency: "USD" | "ILS" | "EUR";
  locale: string;
};

export const StockAnalystTargetCard = ({
  analystTarget,
  currency,
  locale,
}: StockAnalystTargetCardProps) => {
  const t = useTranslations("stockAnalysis");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isUnavailable = analystTarget.isFallback === true;
  const total =
    analystTarget.distribution.buy +
    analystTarget.distribution.hold +
    analystTarget.distribution.sell;

  const buyPercent = (analystTarget.distribution.buy / total) * 100;
  const holdPercent = (analystTarget.distribution.hold / total) * 100;
  const sellPercent = (analystTarget.distribution.sell / total) * 100;

  return (
    <>
    <Card>
      <Title>{t("analystTarget.title")}</Title>

      {isUnavailable ? (
        <UnavailableState>
          <UnavailableTitle>{t("analystTarget.unavailableTitle")}</UnavailableTitle>
          <UnavailableText>{t("analystTarget.unavailableDescription")}</UnavailableText>
        </UnavailableState>
      ) : (
        <>
      <TargetRow>
        <TargetBlock>
          <TargetLabel>{t("analystTarget.averageTarget")}</TargetLabel>
          <TargetValue>
            <DisplayMoney
              amount={analystTarget.averageTarget}
              currency={currency}
              locale={locale}
            />
          </TargetValue>
          <Upside>
            {formatPercent(analystTarget.upsidePercent, { locale })} {t("analystTarget.upside")}
          </Upside>
        </TargetBlock>
        <HighLow>
          <HighLowLabel>{t("analystTarget.highLow")}</HighLowLabel>
          <HighLowValue>
            <DisplayMoney amount={analystTarget.high} currency={currency} locale={locale} />
            {" / "}
            <DisplayMoney amount={analystTarget.low} currency={currency} locale={locale} />
          </HighLowValue>
        </HighLow>
      </TargetRow>

      <ConsensusBlock>
        <ConsensusLabel>{t("analystTarget.consensus")}</ConsensusLabel>
        <ConsensusValue>{t(`analystTarget.consensusLabels.${analystTarget.consensusKey}`)}</ConsensusValue>
        <AnalystCount>
          {t("analystTarget.basedOnAnalysts", { count: analystTarget.analystCount })}
        </AnalystCount>
      </ConsensusBlock>

      <DistributionBar aria-hidden>
        <BarSegment $width={buyPercent} $tone="buy" />
        <BarSegment $width={holdPercent} $tone="hold" />
        <BarSegment $width={sellPercent} $tone="sell" />
      </DistributionBar>

      <Legend>
        <LegendItem>
          <LegendSwatch $tone="buy" />
          {t("analystTarget.buy")} ({analystTarget.distribution.buy})
        </LegendItem>
        <LegendItem>
          <LegendSwatch $tone="hold" />
          {t("analystTarget.hold")} ({analystTarget.distribution.hold})
        </LegendItem>
        <LegendItem>
          <LegendSwatch $tone="sell" />
          {t("analystTarget.sell")} ({analystTarget.distribution.sell})
        </LegendItem>
      </Legend>

      <ViewDetails type="button" onClick={() => setIsDetailsOpen(true)}>
        {t("analystTarget.viewDetails")}
      </ViewDetails>
        </>
      )}
    </Card>

    {!isUnavailable ? (
      <StockAnalystDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        analystTarget={analystTarget}
        currency={currency}
        locale={locale}
      />
    ) : null}
    </>
  );
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

const UnavailableState = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.soft};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const UnavailableTitle = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  margin-block-end: ${({ theme }) => theme.spacing.xs};
`;

const UnavailableText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  margin: 0;
`;

const TargetRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const TargetBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TargetLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const TargetValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Upside = styled.span`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const HighLow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  text-align: end;
`;

const HighLowLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const HighLowValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const ConsensusBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const ConsensusLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const ConsensusValue = styled.strong`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const AnalystCount = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const DistributionBar = styled.div`
  display: flex;
  inline-size: 100%;
  block-size: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.soft};
`;

const BarSegment = styled.span<{ $width: number; $tone: "buy" | "hold" | "sell" }>`
  inline-size: ${({ $width }) => $width}%;
  background: ${({ theme, $tone }) =>
    $tone === "buy"
      ? theme.colors.status.positive
      : $tone === "hold"
        ? theme.colors.status.warning
        : theme.colors.status.negative};
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block: ${({ theme }) => theme.spacing.sm};
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;

const LegendSwatch = styled.span<{ $tone: "buy" | "hold" | "sell" }>`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: ${({ theme, $tone }) =>
    $tone === "buy"
      ? theme.colors.status.positive
      : $tone === "hold"
        ? theme.colors.status.warning
        : theme.colors.status.negative};
`;

const ViewDetails = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  text-align: start;

  &:hover {
    text-decoration: underline;
  }
`;
