"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { EarningsCalendarModal } from "@/components/calendar/EarningsCalendarModal";
import { EmptyState } from "@/components/ui/states/EmptyState";
import type { DashboardUpcomingEarning } from "@/data/dashboard/dashboard.types";
import { formatDate } from "@/utils/formatting/formatDate";

type UpcomingEarningsCardProps = {
  earnings: DashboardUpcomingEarning[];
  locale: string;
};

export const UpcomingEarningsCard = ({
  earnings,
  locale,
}: UpcomingEarningsCardProps) => {
  const t = useTranslations("dashboard");
  const tStates = useTranslations("states");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <Card>
        <Header>
          <Title>{t("cards.upcomingEarnings")}</Title>
          <CalendarButton type="button" onClick={() => setIsCalendarOpen(true)}>
            {t("earnings.viewCalendar")}
          </CalendarButton>
        </Header>
        {earnings.length === 0 ? (
          <EmptyState
            title={tStates("empty.title")}
            description={t("earnings.emptyDescription")}
            $compact
          />
        ) : (
        <List>
          {earnings.map((earning) => (
            <Row key={`${earning.symbol}-${earning.date}`}>
              <Symbol dir="ltr">{earning.symbol}</Symbol>
              <Company>{earning.companyName}</Company>
              <DateText>{formatDate(earning.date, { locale })}</DateText>
              <Timing>{t(`earnings.timing.${earning.timing}`)}</Timing>
            </Row>
          ))}
        </List>
        )}
      </Card>
      <EarningsCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
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

const CalendarButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.card};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.strong};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.md};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-block-end: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: auto minmax(0, 1fr);
  }
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const Company = styled.span`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;
`;

const Timing = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  white-space: nowrap;
`;

