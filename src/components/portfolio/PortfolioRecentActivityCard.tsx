"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import styled, { css } from "styled-components";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { StockLogo } from "@/components/ui/StockLogo";
import type { PortfolioActivity, PortfolioTone } from "@/data/portfolio/portfolio.types";
import { formatDate } from "@/utils/formatting/formatDate";

type PortfolioRecentActivityCardProps = {
  activities: PortfolioActivity[];
  locale: string;
  showHeader?: boolean;
  translationNamespace?: "portfolio" | "reports.activity";
};

export const PortfolioRecentActivityCard = ({
  activities,
  locale,
  showHeader = true,
  translationNamespace = "portfolio",
}: PortfolioRecentActivityCardProps) => {
  const t = useTranslations(translationNamespace);
  const tPortfolio = useTranslations("portfolio");
  const tInteractions = useTranslations("interactions");
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const getActivityLabel = (activity: PortfolioActivity) => {
    if (translationNamespace === "portfolio") {
      return tPortfolio(`recentActivity.${activity.descriptionKey}`, {
        symbol: activity.symbol,
      });
    }
    return t(activity.descriptionKey, { symbol: activity.symbol });
  };

  return (
    <>
    <Card>
      {showHeader ? (
        <Header>
          <Title>
            {translationNamespace === "portfolio"
              ? tPortfolio("recentActivity.title")
              : t("title")}
          </Title>
          <ActivityButton type="button" onClick={() => setIsActivityOpen(true)}>
            {tPortfolio("actions.viewAllActivity")}
          </ActivityButton>
        </Header>
      ) : null}
      <List>
        {activities.map((activity) => (
          <Row key={`${activity.symbol}-${activity.type}-${activity.date}`}>
            <StockLogo
              symbol={activity.symbol}
              companyName={activity.companyName}
              logoUrl={activity.logoUrl}
            />
            <TextGroup>
              <ActionText>{getActivityLabel(activity)}</ActionText>
              <Meta>{formatDate(activity.date, { locale })}</Meta>
            </TextGroup>
            <Value $tone={activity.tone}>
              <DisplayMoney
                amount={activity.value}
                currency={activity.currency}
                locale={locale}
                inheritColor
              />
            </Value>
          </Row>
        ))}
      </List>
    </Card>

    <PlaceholderModal
      isOpen={isActivityOpen}
      onClose={() => setIsActivityOpen(false)}
      title={tInteractions("features.activityTitle")}
      description={tInteractions("features.activityDescription")}
    />
    </>
  );
};

const toneStyles = {
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.status.neutral};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
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

const ActivityButton = styled.button`
  border: 0;
  padding: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: transparent;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TextGroup = styled.div`
  min-inline-size: 0;
`;

const ActionText = styled.span`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  display: block;
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Value = styled.strong<{ $tone: PortfolioTone }>`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  ${({ $tone }) => toneStyles[$tone]}
  background: transparent;
`;
