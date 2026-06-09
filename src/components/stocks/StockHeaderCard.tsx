"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { CircularScore } from "@/components/ui/CircularScore";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { StockLogo } from "@/components/ui/StockLogo";
import type { StockAnalysisData } from "@/data/stocks/stock-analysis.types";
import { formatDate } from "@/utils/formatting/formatDate";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { mapSuggestedActionToTone } from "@/utils/scoring/mappers";

type StockHeaderCardProps = {
  stock: StockAnalysisData;
  locale: string;
};

export const StockHeaderCard = ({ stock, locale }: StockHeaderCardProps) => {
  const t = useTranslations("stockAnalysis");
  const tCommon = useTranslations("common");
  const isPositive = stock.dayChangePercent >= 0;
  const actionTone = mapSuggestedActionToTone(stock.suggestedAction);

  return (
    <Card>
      <MainRow>
        <IdentityBlock>
          <StockLogo
            symbol={stock.symbol}
            companyName={stock.companyName}
            logoUrl={stock.logoUrl}
            size="md"
            aria-hidden
          />
          <IdentityText>
            <CompanyRow>
              <CompanyName>{stock.companyName}</CompanyName>
              <SymbolBadge dir="ltr">{stock.symbol}</SymbolBadge>
              <ExchangeBadge>{stock.exchange}</ExchangeBadge>
            </CompanyRow>
            <PriceRow>
              <CurrentPrice>
                <DisplayMoney
                  amount={stock.currentPrice}
                  currency={stock.currency}
                  locale={locale}
                />
              </CurrentPrice>
              <DayChange $positive={isPositive}>
                <DisplayMoney
                  amount={stock.dayChange}
                  currency={stock.currency}
                  locale={locale}
                  inheritColor
                />
                <span>({formatPercent(stock.dayChangePercent, { locale })})</span>
              </DayChange>
            </PriceRow>
            <LastUpdated>
              {t("header.lastUpdated", {
                date: formatDate(stock.lastUpdated, { locale }),
              })}
            </LastUpdated>
          </IdentityText>
        </IdentityBlock>

        <ScoreBlock>
          <CircularScore
            score={stock.overallScore}
            size="lg"
            ariaLabel={t("header.overallScore")}
          />
          <ScoreMeta>
            <ScoreLabelRow>
              <ScoreLabel>{t("header.overallScore")}</ScoreLabel>
              <InfoIcon aria-hidden>
                <Info size={14} strokeWidth={1.8} />
              </InfoIcon>
            </ScoreLabelRow>
            <ScoreTier $positive={stock.overallScore >= 70}>
              {t(`scoreLabels.${stock.scoreLabelKey}`)}
            </ScoreTier>
            <ActionButton $tone={actionTone}>
              {tCommon(stock.suggestedAction)}
            </ActionButton>
            <Conviction>{t(`confidence.${stock.confidenceLabelKey}`)}</Conviction>
          </ScoreMeta>
        </ScoreBlock>
      </MainRow>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
`;

const MainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const IdentityBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
  flex: 1;
`;

const IdentityText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const CompanyRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CompanyName = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const SymbolBadge = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const ExchangeBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.soft};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CurrentPrice = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const DayChange = styled.span<{ $positive: boolean }>`
  display: inline-flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.status.positive : theme.colors.status.negative};
`;

const LastUpdated = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ScoreBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    justify-content: space-between;
  }
`;

const ScoreMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 8rem;
`;

const ScoreLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ScoreLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const InfoIcon = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const ScoreTier = styled.strong<{ $positive: boolean }>`
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.status.positive : theme.colors.status.warning};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const actionToneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ theme }) => theme.colors.status.positive};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ theme }) => theme.colors.status.negative};
  `,
};

const ActionButton = styled.span<{ $tone: keyof typeof actionToneStyles }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  ${({ $tone }) => actionToneStyles[$tone]}
`;

const Conviction = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
