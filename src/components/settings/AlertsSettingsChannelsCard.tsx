"use client";

import { Bell, CalendarDays, Mail, Radio } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { alertNotificationChannelKeys } from "@/data/settings/settings.mock";
import type {
  AlertNotificationChannel,
  AlertSettingsState,
} from "@/data/settings/settings.types";
import type { SettingsCardAccent } from "./SettingsCard";
import { NotificationChannelRow } from "./NotificationChannelRow";
import { SettingsCard } from "./SettingsCard";

type AlertsSettingsChannelsCardProps = {
  draft: AlertSettingsState;
  onChange: (next: AlertSettingsState) => void;
};

const channelIcons = {
  inApp: Bell,
  email: Mail,
  browserPush: Radio,
  weeklyDigest: CalendarDays,
} as const;

const channelAccents: Record<AlertNotificationChannel, SettingsCardAccent> = {
  inApp: "primary",
  email: "purple",
  browserPush: "warning",
  weeklyDigest: "positive",
};

export const AlertsSettingsChannelsCard = ({
  draft,
  onChange,
}: AlertsSettingsChannelsCardProps) => {
  const t = useTranslations("settings.alerts.channels");

  const updateChannel = (channel: AlertNotificationChannel, checked: boolean) => {
    onChange({
      ...draft,
      channels: {
        ...draft.channels,
        [channel]: checked,
      },
    });
  };

  return (
    <SettingsCard
      icon={Radio}
      iconAccent="purple"
      title={t("title")}
      description={t("description")}
    >
      <List>
        {alertNotificationChannelKeys.map((channel) => {
          const Icon = channelIcons[channel];

          return (
            <NotificationChannelRow
              key={channel}
              icon={Icon}
              accent={channelAccents[channel]}
              title={t(`${channel}.title`)}
              description={t(`${channel}.description`)}
              checked={draft.channels[channel]}
              onChange={(checked) => updateChannel(channel, checked)}
            />
          );
        })}
      </List>
    </SettingsCard>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
