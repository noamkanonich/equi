"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { PortfolioAiInsight } from "@/data/portfolio/portfolio.types";
import { formatPercent } from "@/utils/formatting/formatPercent";

type PortfolioAiInsightCardProps = {
  insight: PortfolioAiInsight;
  locale: string;
};

export const PortfolioAiInsightCard = ({
  insight,
  locale,
}: PortfolioAiInsightCardProps) => {
  const t = useTranslations("portfolio");

  return (
    <Card>
      <Header>
        <IconWrap aria-hidden>
          <Sparkles size={18} strokeWidth={1.8} />
        </IconWrap>
        <Title>{t("ai.title")}</Title>
      </Header>
      <Summary>{t("ai.summary")}</Summary>
      <InsightList>
        <InsightRow>
          <Label>{t("ai.keyPositive")}</Label>
          <Copy>{t(insight.keyPositiveKey)}</Copy>
        </InsightRow>
        <InsightRow>
          <Label>{t("ai.potentialConcern")}</Label>
          <Copy>{t(insight.potentialConcernKey)}</Copy>
        </InsightRow>
        <InsightRow>
          <Label>{t("ai.suggestedReview")}</Label>
          <Copy>{t(insight.suggestedReviewKey)}</Copy>
        </InsightRow>
      </InsightList>
      <Confidence>
        <span>{t("ai.confidence")}</span>
        <strong>
          {formatPercent(insight.confidencePercent, {
            decimals: 0,
            locale,
            showSign: false,
          })}
        </strong>
      </Confidence>
      <Disclaimer>{t("ai.disclaimer")}</Disclaimer>
    </Card>
  );
};

const Card = styled.section`
  block-size: 100%;
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

const Summary = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const InsightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InsightRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Copy = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Confidence = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.soft};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};

  strong {
    color: ${({ theme }) => theme.colors.brand.primary};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
  }
`;

const Disclaimer = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;
