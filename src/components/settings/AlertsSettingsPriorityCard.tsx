"use client";

import { AlertTriangle, Bell } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import type { AlertPriority } from "@/data/alerts/alerts.types";
import { alertPriorityKeys } from "@/data/settings/settings.mock";
import type { AlertSettingsState } from "@/data/settings/settings.types";
import type { AlertTone } from "@/utils/alerts/getAlertTypeMeta";
import { getAlertPriorityTone } from "@/utils/alerts/getAlertTypeMeta";
import { hasAtLeastOnePriorityEnabled } from "@/utils/settings/validateAlertPriorities";
import { SettingsCard } from "./SettingsCard";
import { SettingsInfoBox } from "./SettingsInfoBox";

type AlertsSettingsPriorityCardProps = {
  draft: AlertSettingsState;
  onChange: (next: AlertSettingsState) => void;
};

const priorityAccents: Record<AlertTone, ReturnType<typeof css>> = {
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
  brand: css`
    color: ${({ theme }) => theme.colors.brand.primary};
    background: ${({ theme }) => theme.colors.brand.primarySoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.background.elevated};
  `,
};

export const AlertsSettingsPriorityCard = ({
  draft,
  onChange,
}: AlertsSettingsPriorityCardProps) => {
  const t = useTranslations("settings.alerts.priority");
  const prefersReducedMotion = useReducedMotion();
  const showWarning = !hasAtLeastOnePriorityEnabled(draft);

  const togglePriority = (priority: AlertPriority) => {
    onChange({
      ...draft,
      enabledPriorities: {
        ...draft.enabledPriorities,
        [priority]: !draft.enabledPriorities[priority],
      },
    });
  };

  return (
    <SettingsCard
      icon={Bell}
      iconAccent="primary"
      title={t("title")}
      description={t("description")}
    >
      <Grid>
        {alertPriorityKeys.map((priority) => {
          const tone = getAlertPriorityTone(priority);
          const enabled = draft.enabledPriorities[priority];

          return (
            <PriorityCard
              key={priority}
              type="button"
              $selected={enabled}
              onClick={() => togglePriority(priority)}
              aria-pressed={enabled}
              layout={prefersReducedMotion ? undefined : false}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <IconWrap $tone={tone} aria-hidden>
                <Bell size={20} strokeWidth={1.9} />
              </IconWrap>
              <Label>{t(`${priority}.title`)}</Label>
              <Description>{t(`${priority}.description`)}</Description>
              <SwitchTrack $active={enabled} aria-hidden>
                <SwitchThumb $active={enabled} />
              </SwitchTrack>
            </PriorityCard>
          );
        })}
      </Grid>

      {showWarning ? (
        <SettingsInfoBox variant="info" icon={AlertTriangle}>
          {t("warning")}
        </SettingsInfoBox>
      ) : null}
    </SettingsCard>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

const PriorityCard = styled(motion.button)<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.brand.primary : theme.colors.border.subtle};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.brand.primarySoft : theme.colors.background.card};
  cursor: pointer;
  text-align: center;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const IconWrap = styled.span<{ $tone: AlertTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ $tone }) => priorityAccents[$tone]}
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Description = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  min-block-size: 2.5rem;
`;

const SwitchTrack = styled.span<{ $active: boolean }>`
  inline-size: 2.75rem;
  block-size: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xs};
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.border.strong};
`;

const SwitchThumb = styled.span<{ $active: boolean }>`
  display: block;
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.card};
  margin-inline-start: 0;
  transform: ${({ $active }) => ($active ? "translateX(1.25rem)" : "translateX(0)")};
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);

  [dir="rtl"] & {
    transform: ${({ $active }) => ($active ? "translateX(-1.25rem)" : "translateX(0)")};
  }
`;
