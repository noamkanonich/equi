"use client";

import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type {
  DashboardActivity,
  DashboardTrendTone,
} from "@/data/dashboard/dashboard.types";
import { DisplayMoney } from "@/components/ui/DisplayMoney";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { StockLogo } from "@/components/ui/StockLogo";

type RecentActivityCardProps = {
  activities: DashboardActivity[];
  locale: string;
};

export const RecentActivityCard = ({
  activities,
  locale,
}: RecentActivityCardProps) => {
  const t = useTranslations("dashboard");
  const tStates = useTranslations("states");

  return (
    <Card>
      <Title>{t("cards.recentActivity")}</Title>
      {activities.length === 0 ? (
        <EmptyState
          title={tStates("empty.title")}
          description={t("activity.emptyDescription")}
          $compact
        />
      ) : (
      <List>
        {activities.map((activity) => (
          <Row key={`${activity.symbol}-${activity.type}`}>
            <StockLogo
              symbol={activity.symbol}
              companyName={activity.companyName}
              logoUrl={activity.logoUrl}
            />
            <TextGroup>
              <ActionText>
                {t(`activity.types.${activity.type}`, {
                  symbol: activity.symbol,
                })}
              </ActionText>
              <Meta>{t("activity.mockTimestamp")}</Meta>
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
      )}
    </Card>
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
  min-block-size: 13.25rem;
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionText = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Value = styled.strong<{ $tone: DashboardTrendTone }>`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  ${({ $tone }) => toneStyles[$tone]}
  background: transparent;
`;

