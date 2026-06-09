"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";

type ProfileDataStatusCardProps = {
  holdingsCount: number;
  watchlistCount: number;
  notesCount: number;
  alertsCount: number;
};

export const ProfileDataStatusCard = ({
  holdingsCount,
  watchlistCount,
  notesCount,
  alertsCount,
}: ProfileDataStatusCardProps) => {
  const t = useTranslations("profile");

  const rows = [
    { label: t("portfolioHoldings"), value: holdingsCount },
    { label: t("watchlistItems"), value: watchlistCount },
    { label: t("notes"), value: notesCount },
    { label: t("alerts"), value: alertsCount },
    { label: t("settings"), value: 1 },
  ];

  return (
    <Card $interactive={false}>
      <Title>{t("dataSync")}</Title>
      <Rows>
        {rows.map((row) => (
          <Row key={row.label}>
            <Label>{row.label}</Label>
            <Value>{row.value}</Value>
          </Row>
        ))}
      </Rows>
    </Card>
  );
};

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block: ${({ theme }) => theme.spacing.xs};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-block-end: none;
  }
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-variant-numeric: tabular-nums;
`;
