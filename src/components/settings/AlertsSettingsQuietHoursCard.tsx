"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { quietHoursOptions } from "@/data/settings/settings.mock";
import type { AlertSettingsState, QuietHoursOption } from "@/data/settings/settings.types";
import { SettingsCard } from "./SettingsCard";
import { SettingsInfoBox } from "./SettingsInfoBox";
import { SettingsSelectField } from "./SettingsSelectField";

type AlertsSettingsQuietHoursCardProps = {
  draft: AlertSettingsState;
  onChange: (next: AlertSettingsState) => void;
};

const quietHoursLabelKeys: Record<QuietHoursOption, string> = {
  "10pm-8am": "optionDefault",
  "11pm-7am": "optionLate",
  disabled: "disabled",
  custom: "custom",
};

export const AlertsSettingsQuietHoursCard = ({
  draft,
  onChange,
}: AlertsSettingsQuietHoursCardProps) => {
  const t = useTranslations("settings.alerts.quietHours");

  return (
    <SettingsCard
      icon={Clock}
      iconAccent="warning"
      title={t("title")}
      description={t("description")}
    >
      <SettingsSelectField
        id="quiet-hours-schedule"
        label={t("scheduleLabel")}
        value={draft.quietHours}
        onChange={(value) =>
          onChange({ ...draft, quietHours: value as QuietHoursOption })
        }
      >
        {quietHoursOptions.map((option) => (
          <option key={option} value={option}>
            {t(quietHoursLabelKeys[option])}
          </option>
        ))}
      </SettingsSelectField>

      {draft.quietHours === "custom" ? (
        <SettingsInfoBox variant="info" icon={Clock}>
          {t("customPlaceholder")}
        </SettingsInfoBox>
      ) : null}

      <SettingsInfoBox variant="info" icon={Clock}>
        {t("helper")}
      </SettingsInfoBox>
    </SettingsCard>
  );
};
