"use client";

import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { EarningsCalendarModal } from "@/components/calendar/EarningsCalendarModal";
import type { UpcomingPortfolioEvent } from "@/data/next-moves/next-moves.types";
import { formatDate } from "@/utils/formatting/formatDate";

type UpcomingEventsCardProps = {
  events: UpcomingPortfolioEvent[];
  locale: string;
};

export const UpcomingEventsCard = ({ events, locale }: UpcomingEventsCardProps) => {
  const t = useTranslations("nextMoves");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <Card>
        <Header>
          <Title>{t("cards.events.title")}</Title>
          <ViewButton type="button" onClick={() => setIsCalendarOpen(true)}>
            {t("actions.viewCalendar")}
          </ViewButton>
        </Header>
        <List>
          {events.map((event) => (
            <EventRow key={event.id}>
              <EventIcon aria-hidden>
                <CalendarDays size={16} strokeWidth={1.9} />
              </EventIcon>
              <EventText>
                <EventTitle>
                  <Symbol dir="ltr">{event.symbol}</Symbol>
                  {t(event.eventKey)}
                </EventTitle>
                <EventMeta>
                  <span>{formatDate(event.date, { locale })}</span>
                  <MetaDivider aria-hidden />
                  <span>{t(`cards.events.${event.timing}`)}</span>
                </EventMeta>
              </EventText>
            </EventRow>
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
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
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

const ViewButton = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EventRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EventIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.35rem;
  block-size: 2.35rem;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.status.negative};
  background: ${({ theme }) => theme.colors.status.negativeSoft};
  flex-shrink: 0;
`;

const EventText = styled.div`
  min-inline-size: 0;
`;

const EventTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Symbol = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EventMeta = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const MetaDivider = styled.span`
  inline-size: 0.25rem;
  block-size: 0.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border.strong};
`;
