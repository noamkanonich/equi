"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  PieChart,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { Card } from "@/components/ui/Card";
import { portfolioQuickActions } from "@/data/settings/settings.mock";
import type { PortfolioQuickActionKey } from "@/data/settings/settings.types";
import { Link } from "@/i18n/routing";
import { SettingsInfoBox } from "./SettingsInfoBox";
import { SettingsPlaceholderModal } from "./SettingsPlaceholderModal";

type PortfolioModalKey = "manageTargetAllocation" | "portfolioRiskAnalysis" | null;

type PortfolioSettingsQuickActionsCardProps = {
  onResetPortfolioSettings: () => void;
};

const actionIcons: Record<PortfolioQuickActionKey, typeof RefreshCw> = {
  resetPortfolioSettings: RefreshCw,
  manageTargetAllocation: PieChart,
  viewCurrentAllocation: Eye,
  portfolioRiskAnalysis: ShieldAlert,
};

const linkActions: PortfolioQuickActionKey[] = ["viewCurrentAllocation"];

export const PortfolioSettingsQuickActionsCard = ({
  onResetPortfolioSettings,
}: PortfolioSettingsQuickActionsCardProps) => {
  const t = useTranslations("settings.portfolio.quickActions");
  const tModals = useTranslations("settings.portfolio.modals");
  const [openModal, setOpenModal] = useState<PortfolioModalKey>(null);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  useEffect(() => {
    if (!showResetSuccess) return;

    const timer = window.setTimeout(() => {
      setShowResetSuccess(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [showResetSuccess]);

  const handleAction = (key: PortfolioQuickActionKey) => {
    if (key === "resetPortfolioSettings") {
      onResetPortfolioSettings();
      setShowResetSuccess(true);
      return;
    }

    if (key === "manageTargetAllocation" || key === "portfolioRiskAnalysis") {
      setOpenModal(key);
    }
  };

  const modalTitle =
    openModal === "manageTargetAllocation"
      ? tModals("manageTargetAllocationTitle")
      : openModal === "portfolioRiskAnalysis"
        ? tModals("portfolioRiskAnalysisTitle")
        : "";

  return (
    <>
      <StyledCard $padding="md">
        <Title>{t("title")}</Title>
        {showResetSuccess ? (
          <SettingsInfoBox variant="positive" icon={CheckCircle2}>
            {t("resetSuccess")}
          </SettingsInfoBox>
        ) : null}
        <List>
          {portfolioQuickActions.map((action) => {
            const Icon = actionIcons[action.key];
            const label = t(action.key);

            if (linkActions.includes(action.key)) {
              return (
                <ActionLink key={action.key} href="/portfolio">
                  <RowStart>
                    <IconWrap aria-hidden>
                      <Icon size={16} strokeWidth={1.9} />
                    </IconWrap>
                    <Label>{label}</Label>
                  </RowStart>
                  <DirectionalChevron />
                </ActionLink>
              );
            }

            return (
              <ActionButton
                key={action.key}
                type="button"
                onClick={() => handleAction(action.key)}
              >
                <RowStart>
                  <IconWrap aria-hidden>
                    <Icon size={16} strokeWidth={1.9} />
                  </IconWrap>
                  <Label>{label}</Label>
                </RowStart>
                <DirectionalChevron />
              </ActionButton>
            );
          })}
        </List>
      </StyledCard>

      <SettingsPlaceholderModal
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
        title={modalTitle}
        description={tModals("placeholderDescription")}
      />
    </>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
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
  gap: ${({ theme }) => theme.spacing.xs};
`;

const actionRowStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  svg:last-child {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text.muted};

    [dir="rtl"] & {
      transform: scaleX(-1);
    }
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const ActionLink = styled(Link)`
  ${actionRowStyles}
`;

const ActionButton = styled.button`
  ${actionRowStyles}
  border: 1px solid transparent;
  text-align: inherit;
  font: inherit;
`;

const RowStart = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
