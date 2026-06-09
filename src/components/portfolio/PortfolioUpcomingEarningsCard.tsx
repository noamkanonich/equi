"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { EarningsCalendarModal } from "@/components/calendar/EarningsCalendarModal";
import type { PortfolioUpcomingEarning } from "@/data/portfolio/portfolio.types";
import { formatDate } from "@/utils/formatting/formatDate";

type PortfolioUpcomingEarningsCardProps = {
  earnings: PortfolioUpcomingEarning[];
  locale: string;
};

export const PortfolioUpcomingEarningsCard = ({
  earnings,
  locale,
}: PortfolioUpcomingEarningsCardProps) => {
  const t = useTranslations("portfolio");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <Card>
        <Header>
          <Title>{t("earnings.title")}</Title>
          <CalendarButton type="button" onClick={() => setIsCalendarOpen(true)}>
            {t("actions.viewCalendar")}
          </CalendarButton>
        </Header>
        <List>
          {earnings.map((earning) => (
            <Row key={`${earning.symbol}-${earning.date}`}>
              <Symbol dir="ltr">{earning.symbol}</Symbol>
              <Company>{earning.companyName}</Company>
              <DateText>{formatDate(earning.date, { locale })}</DateText>
              <Timing>{t(`earnings.${earning.timing}`)}</Timing>
            </Row>
          ))}
        </List>
      </Card>
      <EarningsCalendarModal
        isOpen={isCalendarOpen}
        initialFilter="portfolio"
        onClose={() => setIsCalendarOpen(false)}
      />
    </>
  );
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

const CalendarButton = styled.button`
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
