"use client";

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { EarningsCalendarModal } from "@/components/calendar/EarningsCalendarModal";
import type { UpcomingNewsEvent } from "@/data/news/news.types";
import { formatDate } from "@/utils/formatting/formatDate";

type UpcomingEventsCardProps = {
  events: UpcomingNewsEvent[];
  locale: string;
};

export const UpcomingEventsCard = ({ events, locale }: UpcomingEventsCardProps) => {
  const t = useTranslations("news.events");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <Card>
        <Header>
          <TitleGroup>
            <IconWrap aria-hidden>
              <CalendarDays size={16} strokeWidth={1.9} />
            </IconWrap>
            <Title>{t("title")}</Title>
          </TitleGroup>
          <ViewButton type="button" onClick={() => setIsCalendarOpen(true)}>
            {t("viewCalendar")}
          </ViewButton>
        </Header>
        <List>
          {events.map((event) => (
            <Row key={event.id}>
              <Symbol dir="ltr">{event.symbol}</Symbol>
              <Copy>
                <Label>{event.label}</Label>
                <DateText>{formatDate(event.date, { locale })}</DateText>
              </Copy>
            </Row>
          ))}
        </List>
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
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ViewButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const Symbol = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  flex-shrink: 0;
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Label = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
`;
