"use client";

import styled from "styled-components";
import { Badge } from "@/components/ui/Badge";
import type { EarningsCalendarEvent } from "@/data/calendar/calendar.types";
import { mapCalendarImpactToTone } from "@/data/calendar/mappers";

type DetailRow = {
  label: string;
  value: string;
};

type EarningsCalendarEventDetailsProps = {
  event: EarningsCalendarEvent | null;
  title: string;
  emptyTitle: string;
  note: string;
  impactLabel?: string;
  detailRows: DetailRow[];
};

export const EarningsCalendarEventDetails = ({
  event,
  title,
  emptyTitle,
  note,
  impactLabel,
  detailRows,
}: EarningsCalendarEventDetailsProps) => {
  if (!event) {
    return (
      <DetailsCard>
        <DetailsTitle>{emptyTitle}</DetailsTitle>
        <Note>{note}</Note>
      </DetailsCard>
    );
  }

  return (
    <DetailsCard>
      <DetailsHeader>
        <DetailsTitle>{title}</DetailsTitle>
        {impactLabel ? (
          <Badge $tone={mapCalendarImpactToTone(event.impact)}>{impactLabel}</Badge>
        ) : null}
      </DetailsHeader>
      <Symbol dir="ltr">{event.symbol}</Symbol>
      <Company>{event.companyName}</Company>
      <DetailGrid>
        {detailRows.map((row) => (
          <DetailItem key={row.label}>
            <DetailLabel>{row.label}</DetailLabel>
            <DetailValue>{row.value}</DetailValue>
          </DetailItem>
        ))}
      </DetailGrid>
      <Note>{note}</Note>
    </DetailsCard>
  );
};

const DetailsCard = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: none;
  }
`;

const DetailsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailsTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
  text-align: start;
`;

const Symbol = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Company = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;

const DetailGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.md} 0 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const DetailItem = styled.div`
  min-inline-size: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
`;

const DetailLabel = styled.dt`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const DetailValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Note = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
`;
