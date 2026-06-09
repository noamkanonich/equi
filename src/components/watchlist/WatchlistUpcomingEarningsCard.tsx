"use client";

import { ArrowUpRight, CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { EarningsCalendarModal } from "@/components/calendar/EarningsCalendarModal";
import { StockLogo } from "@/components/ui/StockLogo";
import type { WatchlistEarningsItem } from "@/data/watchlist/watchlist.types";
import { Link } from "@/i18n/routing";

type WatchlistUpcomingEarningsCardProps = {
  earnings: WatchlistEarningsItem[];
};

export const WatchlistUpcomingEarningsCard = ({
  earnings,
}: WatchlistUpcomingEarningsCardProps) => {
  const t = useTranslations("watchlist");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <Card>
        <TitleRow>
          <CalendarDays size={16} strokeWidth={1.8} aria-hidden />
          <Title>{t("sidebar.upcomingEarnings")}</Title>
        </TitleRow>
        <List>
          {earnings.map((earning) => (
            <ListItem key={earning.symbol}>
              <StockIdentity href={`/stocks/${earning.symbol}`} dir="ltr">
                <StockLogo
                  symbol={earning.symbol}
                  companyName={earning.symbol}
                  logoUrl={earning.logoUrl}
                />
                <Symbol>{earning.symbol}</Symbol>
              </StockIdentity>
              <DateText>{t(earning.dateKey)}</DateText>
            </ListItem>
          ))}
        </List>
        <CardLink type="button" onClick={() => setIsCalendarOpen(true)}>
          {t("actions.viewCalendar")}
          <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden />
        </CardLink>
      </Card>
      <EarningsCalendarModal
        isOpen={isCalendarOpen}
        initialFilter="watchlist"
        onClose={() => setIsCalendarOpen(false)}
      />
    </>
  );
};

const Card = styled.article`
  block-size: 100%;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.primary};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StockIdentity = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: color 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 3px;
  }
`;

const Symbol = styled.strong`
  color: currentColor;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;

const CardLink = styled.button`
  margin-block-start: ${({ theme }) => theme.spacing.md};
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: transparent;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
