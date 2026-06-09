"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { MiniTrendChart } from "@/components/charts/MiniTrendChart";
import { HoldingRecentDayChanges } from "./HoldingRecentDayChanges";
import { ActionBadge } from "@/components/ui/ActionBadge";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StockLogo } from "@/components/ui/StockLogo";
import type {
  DashboardHoldingView,
  DashboardTrendTone,
} from "@/data/dashboard/dashboard.types";
import { Link } from "@/i18n/routing";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { SOFT_EASE } from "@/utils/motion/transitions";
import { mapScoreToBadgeTone } from "@/utils/scoring/mappers";

type DashboardHoldingsCardsProps = {
  holdingViews: DashboardHoldingView[];
  locale: string;
};

export const DashboardHoldingsCards = ({
  holdingViews,
  locale,
}: DashboardHoldingsCardsProps) => {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const prefersReducedMotion = useReducedMotion();

  return (
    <CardsGrid
      initial={prefersReducedMotion ? false : "hidden"}
      animate="show"
      variants={prefersReducedMotion ? undefined : cardsGridVariants}
    >
      {holdingViews.map((holding) => (
        <CardItem
          key={holding.symbol}
          variants={prefersReducedMotion ? undefined : holdingCardVariants}
        >
          <CardLink
            href={`/stocks/${holding.symbol}`}
            aria-label={t("holdings.cardAria", { symbol: holding.symbol })}
          >
            <CardTop>
              <Identity>
                <StockLogo
                  symbol={holding.symbol}
                  companyName={holding.companyName}
                  logoUrl={holding.logoUrl}
                  size="md"
                />
                <NameStack>
                  <Symbol dir="ltr">{holding.symbol}</Symbol>
                  <Company>{holding.companyName}</Company>
                </NameStack>
              </Identity>
              <ScoreBadge
                score={holding.score}
                $tone={mapScoreToBadgeTone(holding.score)}
              />
            </CardTop>

            <MainMetric>
              <MetricLabel>{t("holdings.columns.marketValue")}</MetricLabel>
              <MetricValue>
                <DisplayMoney
                  amount={holding.marketValue}
                  currency={holding.currency}
                  locale={locale}
                />
              </MetricValue>
            </MainMetric>

            <RecentChangesBlock>
              <RecentChangesLabel>
                {t("holdings.columns.recentDayChanges")}
              </RecentChangesLabel>
              <HoldingRecentDayChanges
                changes={holding.recentDayChanges}
                locale={locale}
              />
            </RecentChangesBlock>

            <TrendBlock dir="ltr">
              <TrendLabel>{t("holdings.columns.trend")}</TrendLabel>
              <MiniTrendChart
                data={holding.trend}
                tone={holding.tone}
                height={42}
              />
            </TrendBlock>

            <StatsGrid>
              <Stat>
                <StatLabel>{t("holdings.columns.dayChange")}</StatLabel>
                <ToneValue $tone={holding.tone}>
                  {formatPercent(holding.dayChangePercent, { locale })}
                </ToneValue>
              </Stat>
              <Stat>
                <StatLabel>{t("holdings.columns.gainLoss")}</StatLabel>
                <ToneValue
                  $tone={holding.gainLossPercent >= 0 ? "positive" : "negative"}
                >
                  {formatPercent(holding.gainLossPercent, { locale })}
                </ToneValue>
              </Stat>
              <Stat>
                <StatLabel>{t("holdings.columns.shares")}</StatLabel>
                <StatValue>{holding.shares}</StatValue>
              </Stat>
              <Stat>
                <StatLabel>{t("holdings.columns.currentPrice")}</StatLabel>
                <StatValue>
                  <DisplayMoney
                    amount={holding.currentPrice}
                    currency={holding.currency}
                    locale={locale}
                  />
                </StatValue>
              </Stat>
            </StatsGrid>

            <CardFooter>
              <LargeActionBadge action={holding.suggestedAction}>
                {tCommon(holding.suggestedAction)}
              </LargeActionBadge>
            </CardFooter>
          </CardLink>
        </CardItem>
      ))}
    </CardsGrid>
  );
};

const cardsGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02,
    },
  },
};

const holdingCardVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: SOFT_EASE,
    },
  },
};

const toneTextStyles = css<{ $tone: DashboardTrendTone }>`
  color: ${({ theme, $tone }) =>
    $tone === "negative"
      ? theme.colors.status.negative
      : $tone === "positive"
        ? theme.colors.status.positive
        : theme.colors.text.secondary};
`;

const CardsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const CardItem = styled(motion.div)`
  min-inline-size: 0;
`;

const CardLink = styled(Link)`
  display: flex;
  min-block-size: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.card};
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: ${({ theme }) => theme.colors.shadow.soft};
    transform: translateY(-0.125rem);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      border-color 0.16s ease,
      box-shadow 0.16s ease;

    &:hover {
      transform: none;
    }
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Identity = styled.div`
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NameStack = styled.div`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Company = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MainMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MetricLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const MetricValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const RecentChangesBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-block: ${({ theme }) => theme.spacing.xs};
`;

const RecentChangesLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const TrendBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-block: ${({ theme }) => theme.spacing.xs};
`;

const TrendLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Stat = styled.div`
  min-inline-size: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.soft};
`;

const StatLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const StatValue = styled.strong`
  display: block;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.tableText.lineHeight};
  text-align: end;
`;

const ToneValue = styled(StatValue)<{ $tone: DashboardTrendTone }>`
  ${toneTextStyles}
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: stretch;
  margin-block-start: auto;
`;

const LargeActionBadge = styled(ActionBadge)`
  inline-size: 100%;
  min-block-size: 2.5rem;
  padding-block: ${({ theme }) => theme.spacing.sm};
  padding-inline: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.preset.tableText.fontSize};
`;
