"use client";

import { CheckCircle2, Info, Sparkles, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { StockAiInsight } from "@/data/stocks/stock-analysis.types";

type StockAiInsightCardProps = {
  insight: StockAiInsight;
};

export const StockAiInsightCard = ({ insight }: StockAiInsightCardProps) => {
  const t = useTranslations("stockAnalysis");

  return (
    <Card>
      <Header>
        <IconWrap aria-hidden>
          <Sparkles size={18} strokeWidth={1.8} />
        </IconWrap>
        <Title>{t("ai.title")}</Title>
      </Header>

      <InsightGrid>
        <InsightItem>
          <InsightLabel $tone="positive">
            <CheckCircle2 size={16} strokeWidth={1.8} />
            {t("ai.whatsGood")}
          </InsightLabel>
          <InsightCopy>{t(insight.whatsGoodKey)}</InsightCopy>
        </InsightItem>

        <InsightItem>
          <InsightLabel $tone="warning">
            <TriangleAlert size={16} strokeWidth={1.8} />
            {t("ai.riskToWatch")}
          </InsightLabel>
          <InsightCopy>{t(insight.riskToWatchKey)}</InsightCopy>
        </InsightItem>

        <InsightItem>
          <InsightLabel $tone="neutral">
            <Info size={16} strokeWidth={1.8} />
            {t("ai.suggestedAction")}
          </InsightLabel>
          <InsightCopy>{t(insight.suggestedActionKey)}</InsightCopy>
        </InsightItem>
      </InsightGrid>

      <Footer>
        <Disclaimer>{t("ai.disclaimer")}</Disclaimer>
        <PoweredBy>{t("ai.poweredBy")}</PoweredBy>
      </Footer>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-inline-start: 0.25rem solid ${({ theme }) => theme.colors.brand.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const IconWrap = styled.span`
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const InsightItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InsightLabel = styled.span<{ $tone: "positive" | "warning" | "neutral" }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $tone }) =>
    $tone === "positive"
      ? theme.colors.status.positive
      : $tone === "warning"
        ? theme.colors.status.warning
        : theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const InsightCopy = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-start: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Disclaimer = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const PoweredBy = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
