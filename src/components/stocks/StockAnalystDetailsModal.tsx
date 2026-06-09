"use client";

import { TrendingUp, X } from "lucide-react";
import { useId } from "react";
import { useTranslations } from "next-intl";
import styled, { useTheme } from "styled-components";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { Modal } from "@/components/ui/Modal";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { StockAnalystTarget } from "@/data/stocks/stock-analysis.types";
import { formatPercent } from "@/utils/formatting/formatPercent";
import { useIsMobileBreakpoint } from "@/utils/client/useIsMobileBreakpoint";

type StockAnalystDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  analystTarget: StockAnalystTarget;
  currency: CurrencyCode;
  locale: string;
};

export const StockAnalystDetailsModal = ({
  isOpen,
  onClose,
  analystTarget,
  currency,
  locale,
}: StockAnalystDetailsModalProps) => {
  const t = useTranslations("stockAnalysis.analystTarget");
  const theme = useTheme();
  const titleId = useId();
  const isMobile = useIsMobileBreakpoint(theme.breakpoints.tablet);

  const total =
    analystTarget.distribution.buy +
    analystTarget.distribution.hold +
    analystTarget.distribution.sell;
  const buyPercent = (analystTarget.distribution.buy / total) * 100;
  const holdPercent = (analystTarget.distribution.hold / total) * 100;
  const sellPercent = (analystTarget.distribution.sell / total) * 100;

  const content = (
    <Shell>
      {!isMobile ? (
        <Header>
          <HeaderStart>
            <IconWrap aria-hidden>
              <TrendingUp size={20} strokeWidth={1.9} />
            </IconWrap>
            <Title id={titleId}>{t("detailsTitle")}</Title>
          </HeaderStart>
          <CloseButton type="button" onClick={onClose} aria-label={t("close")}>
            <X size={18} strokeWidth={1.8} aria-hidden />
          </CloseButton>
        </Header>
      ) : null}

      <Body>
        <Row>
          <Label>{t("averageTarget")}</Label>
          <Value>
            <DisplayMoney
              amount={analystTarget.averageTarget}
              currency={currency}
              locale={locale}
            />
          </Value>
          <Upside>
            {formatPercent(analystTarget.upsidePercent, { locale })} {t("upside")}
          </Upside>
        </Row>

        <Row>
          <Label>{t("highLow")}</Label>
          <Value>
            <DisplayMoney amount={analystTarget.high} currency={currency} locale={locale} />
            {" / "}
            <DisplayMoney amount={analystTarget.low} currency={currency} locale={locale} />
          </Value>
        </Row>

        <Row>
          <Label>{t("consensus")}</Label>
          <Consensus>{t(`consensusLabels.${analystTarget.consensusKey}`)}</Consensus>
          <Muted>{t("basedOnAnalysts", { count: analystTarget.analystCount })}</Muted>
        </Row>

        <DistributionBar aria-hidden>
          <BarSegment $width={buyPercent} $tone="buy" />
          <BarSegment $width={holdPercent} $tone="hold" />
          <BarSegment $width={sellPercent} $tone="sell" />
        </DistributionBar>

        <Legend>
          <LegendItem>
            <LegendSwatch $tone="buy" />
            {t("buy")} ({analystTarget.distribution.buy})
          </LegendItem>
          <LegendItem>
            <LegendSwatch $tone="hold" />
            {t("hold")} ({analystTarget.distribution.hold})
          </LegendItem>
          <LegendItem>
            <LegendSwatch $tone="sell" />
            {t("sell")} ({analystTarget.distribution.sell})
          </LegendItem>
        </Legend>
      </Body>

      <Footer>
        <Button onClick={onClose}>{t("close")}</Button>
      </Footer>
    </Shell>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t("detailsTitle")}
        closeLabel={t("close")}
      >
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy={titleId}>
      <PanelWrap>{content}</PanelWrap>
    </Modal>
  );
};

const PanelWrap = styled.div`
  inline-size: min(32rem, 100%);
  margin-inline: auto;
`;

const Shell = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const HeaderStart = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const Value = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const Upside = styled.span`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const Consensus = styled.strong`
  color: ${({ theme }) => theme.colors.status.positive};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const Muted = styled.span`
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

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;
