"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import type { SnoozedAlertsSummary } from "@/data/alerts/alerts.types";

type SnoozedAlertsCardProps = {
  summary: SnoozedAlertsSummary;
  onViewSnoozed: () => void;
};

export const SnoozedAlertsCard = ({
  summary,
  onViewSnoozed,
}: SnoozedAlertsCardProps) => {
  const t = useTranslations("alerts");

  return (
    <Card>
      <Header>
        <Title>{t("sidebar.snoozedAlerts")}</Title>
        <CountBadge>{summary.count}</CountBadge>
      </Header>
      <Description>
        {t("sidebar.snoozedDescription", { count: summary.count })}
      </Description>
      <Button $variant="secondary" $size="sm" onClick={onViewSnoozed}>
        {t("sidebar.viewSnoozed")}
      </Button>
    </Card>
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
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 1.5rem;
  padding-inline: ${({ theme }) => theme.spacing.xs};
  block-size: 1.375rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.colors.status.warning};
  background: ${({ theme }) => theme.colors.status.warningSoft};
`;

const Description = styled.p`
  margin-block-end: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
