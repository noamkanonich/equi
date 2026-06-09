"use client";

import {
  BellPlus,
  Clock3,
  History,
  ListChecks,
} from "lucide-react";
import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useTranslations } from "next-intl";
import { useState } from "react";
import styled, { css } from "styled-components";
import { Card } from "@/components/ui/Card";
import { alertsQuickActions } from "@/data/settings/settings.mock";
import type { AlertsQuickActionKey } from "@/data/settings/settings.types";
import { Link } from "@/i18n/routing";
import { AlertPlaceholderModal } from "./AlertPlaceholderModal";

const actionIcons: Record<AlertsQuickActionKey, typeof BellPlus> = {
  createNewAlert: BellPlus,
  manageRules: ListChecks,
  snoozedAlerts: Clock3,
  notificationHistory: History,
};

const linkActions: AlertsQuickActionKey[] = ["manageRules", "snoozedAlerts"];

type ModalKind = "createNewAlert" | "notificationHistory" | null;

export const AlertsSettingsQuickActionsCard = () => {
  const t = useTranslations("settings.alerts");
  const tQuick = useTranslations("settings.alerts.quickActions");
  const [openModal, setOpenModal] = useState<ModalKind>(null);

  const modalTitle =
    openModal === "createNewAlert"
      ? t("modals.createAlertTitle")
      : openModal === "notificationHistory"
        ? t("modals.notificationHistoryTitle")
        : "";

  return (
    <>
      <StyledCard $padding="md">
        <Title>{tQuick("title")}</Title>
        <List>
          {alertsQuickActions.map((action) => {
            const Icon = actionIcons[action.key];
            const label = tQuick(action.key);

            if (linkActions.includes(action.key)) {
              return (
                <ActionLink key={action.key} href="/alerts">
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
                onClick={() => setOpenModal(action.key as ModalKind)}
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

      <AlertPlaceholderModal
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
        title={modalTitle}
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
