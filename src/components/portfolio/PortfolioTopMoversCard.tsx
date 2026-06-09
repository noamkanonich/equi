"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import { StockLogo } from "@/components/ui/StockLogo";
import type { PortfolioMoverGroup, PortfolioTone } from "@/data/portfolio/portfolio.types";
import { useRouter } from "@/i18n/routing";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { getStockHref } from "@/utils/navigation/getStockHref";

type PortfolioTopMoversCardProps = {
  movers: PortfolioMoverGroup;
  locale: string;
};

export const PortfolioTopMoversCard = ({
  movers,
  locale,
}: PortfolioTopMoversCardProps) => {
  const t = useTranslations("portfolio");
  const tInteractions = useTranslations("interactions");
  const router = useRouter();
  const [isMoversOpen, setIsMoversOpen] = useState(false);

  return (
    <>
    <Card>
      <Title>{t("topMovers.title")}</Title>
      <Columns>
        <MoverGroup>
          <GroupTitle>{t("topMovers.topWinners")}</GroupTitle>
          {movers.winners.map((mover) => (
            <MoverRow
              key={mover.symbol}
              type="button"
              onClick={() => router.push(getStockHref(mover.symbol))}
            >
              <StockLogo
                symbol={mover.symbol}
                companyName={mover.companyName}
                logoUrl={mover.logoUrl}
              />
              <TextGroup>
                <Symbol dir="ltr">{mover.symbol}</Symbol>
                <Company>{mover.companyName}</Company>
              </TextGroup>
              <ValueGroup>
                <Price>
                  <DisplayMoney
                    amount={mover.currentPrice}
                    currency={mover.purchaseCurrency}
                    locale={locale}
                    layout="inline"
                  />
                </Price>
                <Change $tone={mover.tone}>
                  {formatPercent(mover.dayChangePercent, { locale })}
                </Change>
              </ValueGroup>
            </MoverRow>
          ))}
          <FooterButton type="button" onClick={() => setIsMoversOpen(true)}>
            {t("topMovers.viewAllWinners")}
          </FooterButton>
        </MoverGroup>

        <MoverGroup>
          <GroupTitle>{t("topMovers.topLosers")}</GroupTitle>
          {movers.losers.map((mover) => (
            <MoverRow
              key={mover.symbol}
              type="button"
              onClick={() => router.push(getStockHref(mover.symbol))}
            >
              <StockLogo
                symbol={mover.symbol}
                companyName={mover.companyName}
                logoUrl={mover.logoUrl}
              />
              <TextGroup>
                <Symbol dir="ltr">{mover.symbol}</Symbol>
                <Company>{mover.companyName}</Company>
              </TextGroup>
              <ValueGroup>
                <Price>
                  <DisplayMoney
                    amount={mover.currentPrice}
                    currency={mover.purchaseCurrency}
                    locale={locale}
                    layout="inline"
                  />
                </Price>
                <Change $tone={mover.tone}>
                  {formatPercent(mover.dayChangePercent, { locale })}
                </Change>
              </ValueGroup>
            </MoverRow>
          ))}
          <FooterButton type="button" onClick={() => setIsMoversOpen(true)}>
            {t("topMovers.viewAllLosers")}
          </FooterButton>
        </MoverGroup>
      </Columns>
    </Card>

    <PlaceholderModal
      isOpen={isMoversOpen}
      onClose={() => setIsMoversOpen(false)}
      title={tInteractions("features.moversTitle")}
      description={tInteractions("features.moversDescription")}
    />
    </>
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
  block-size: 100%;
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

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const MoverGroup = styled.div`
  min-inline-size: 0;
`;

const GroupTitle = styled.h3`
  margin-block-end: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const MoverRow = styled.button`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  padding-block: ${({ theme }) => theme.spacing.sm};
  border: 0;
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: transparent;
  text-align: start;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
  }
`;

const TextGroup = styled.div`
  min-inline-size: 0;
`;

const Symbol = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Company = styled.span`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ValueGroup = styled.div`
  text-align: end;
`;

const Price = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const Change = styled.strong<{ $tone: PortfolioTone }>`
  display: block;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  ${({ $tone }) => toneStyles[$tone]}
`;

const FooterButton = styled.button`
  margin-block-start: ${({ theme }) => theme.spacing.sm};
  border: 0;
  padding: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: transparent;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;
