"use client";

import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { alertRulesOverviewStats } from "@/data/settings/settings.mock";
import { Link } from "@/i18n/routing";

export const AlertsSettingsRulesOverviewCard = () => {
  const t = useTranslations("settings.alerts.rulesOverview");

  const statRows = [
    { key: "totalRules", value: alertRulesOverviewStats.totalRules },
    { key: "activeRules", value: alertRulesOverviewStats.activeRules },
    { key: "snoozedRules", value: alertRulesOverviewStats.snoozedRules },
    { key: "disabledRules", value: alertRulesOverviewStats.disabledRules },
  ] as const;

  return (
    <StyledCard $padding="md">
      <Title>{t("title")}</Title>
      <List>
        {statRows.map((row) => (
          <StatRow key={row.key}>
            <StatLabel>{t(row.key)}</StatLabel>
            <StatValue>{row.value}</StatValue>
          </StatRow>
        ))}
      </List>
      <ManageLink href="/alerts">
        {t("manageAll")}
        <DirectionalChevron />
      </ManageLink>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const ManageLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-decoration: none;

  svg {
    flex-shrink: 0;

    [dir="rtl"] & {
      transform: scaleX(-1);
    }
  }

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;
