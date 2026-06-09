"use client";

import { useLocale, useTranslations } from "next-intl";
import styled from "styled-components";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import type {
  AddStockQuickOverview as AddStockQuickOverviewData,
  AddStockSearchResult,
} from "@/data/add-stock/add-stock.types";
import {
  mapAddStockScoreToTone,
  mapSearchResultToQuickOverview,
} from "@/data/add-stock/mappers";
import { formatMoney } from "@/utils/currencies/formatMoney";

type AddStockQuickOverviewProps = {
  stock: AddStockSearchResult | null;
};

export const AddStockQuickOverview = ({ stock }: AddStockQuickOverviewProps) => {
  const locale = useLocale();
  const t = useTranslations("addStock");

  if (!stock) {
    return (
      <Panel>
        <Title>{t("overview.title")}</Title>
        <Placeholder>{t("overview.empty")}</Placeholder>
      </Panel>
    );
  }

  const overview = mapSearchResultToQuickOverview(stock);
  const hasLivePrice = stock.hasLivePrice !== false;
  const hasSectorMetadata = Boolean(stock.sector && stock.sector !== "—");
  const weekRange = hasLivePrice ? formatWeekRange(overview, locale) : null;

  return (
    <Panel>
      <TitleRow>
        <Title>{t("overview.title")}</Title>
        {stock.isMock ? <MockPreviewNotice>{t("mockPreviewNotice")}</MockPreviewNotice> : null}
      </TitleRow>
      <OverviewGrid>
        <Metric>
          <MetricLabel>{t("overview.currentPrice")}</MetricLabel>
          {hasLivePrice ? (
            <MetricValue dir="ltr">
              <DisplayMoney
                amount={overview.currentPrice}
                currency={overview.currency}
                locale={locale}
                layout="inline"
                inheritColor
              />
            </MetricValue>
          ) : (
            <MetricValue>{t("overview.priceUnavailable")}</MetricValue>
          )}
        </Metric>
        <Metric>
          <MetricLabel>{t("overview.marketCap")}</MetricLabel>
          <MetricValue dir={hasLivePrice ? "ltr" : undefined}>
            {hasLivePrice
              ? formatMoney(overview.marketCap, overview.currency, {
                  locale,
                  compact: true,
                })
              : t("overview.notAvailable")}
          </MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>
            {hasLivePrice || hasSectorMetadata ? t("overview.sector") : t("overview.market")}
          </MetricLabel>
          <MetricValue>
            {hasLivePrice
              ? overview.sector
              : hasSectorMetadata
                ? stock.sector
                : (stock.market ?? "US")}
          </MetricValue>
          <MetricMeta>
            {hasLivePrice
              ? overview.industry
              : hasSectorMetadata
                ? stock.industry
                : stock.exchange}
          </MetricMeta>
        </Metric>
        <Metric>
          <MetricLabel>{t("overview.weekRange")}</MetricLabel>
          <MetricValue dir={hasLivePrice ? "ltr" : undefined}>
            {weekRange ?? t("overview.notAvailable")}
          </MetricValue>
          {hasLivePrice ? (
            <RangeTrack aria-hidden>
              <RangeFill />
            </RangeTrack>
          ) : null}
        </Metric>
        <Metric>
          <MetricLabel>
            {hasLivePrice ? t("overview.analystRating") : t("overview.assetType")}
          </MetricLabel>
          <MetricValue>
            {hasLivePrice
              ? t(`overview.ratings.${overview.analystRating}`)
              : (stock.assetType ?? "unknown")}
          </MetricValue>
          <MetricMeta>
            {hasLivePrice
              ? t("overview.ratingAverage", { value: overview.analystRatingScore })
              : stock.providerSymbol}
          </MetricMeta>
        </Metric>
        <ScoreMetric>
          <MetricLabel>{t("overview.equiScore")}</MetricLabel>
          {hasLivePrice ? (
            <ScoreLine>
              <ScoreBadge
                score={overview.equiScore}
                $tone={mapAddStockScoreToTone(overview.equiScore)}
              />
              <ScoreText>{t("overview.scoreSummary")}</ScoreText>
            </ScoreLine>
          ) : (
            <MetricValue>{t("overview.scoreUnavailable")}</MetricValue>
          )}
        </ScoreMetric>
      </OverviewGrid>
    </Panel>
  );
};

const formatWeekRange = (
  overview: AddStockQuickOverviewData,
  locale: string,
) => {
  const low = formatMoney(overview.weekRangeLow, overview.currency, { locale });
  const high = formatMoney(overview.weekRangeHigh, overview.currency, { locale });

  return `${low} - ${high}`;
};

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  text-align: start;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MockPreviewNotice = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-align: start;
`;

const Placeholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-block-size: 5.5rem;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.app};
`;

const ScoreMetric = styled(Metric)`
  grid-column: span 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-column: auto;
  }
`;

const MetricLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const MetricValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const MetricMeta = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const RangeTrack = styled.span`
  display: block;
  block-size: 0.375rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.status.neutralSoft};
  overflow: hidden;
`;

const RangeFill = styled.span`
  display: block;
  inline-size: 72%;
  block-size: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.status.positive};
`;

const ScoreLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ScoreText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
