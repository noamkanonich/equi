"use client";

import { BellRing } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { alertSettingsTypeKeys } from "@/data/settings/settings.mock";
import type { AlertSettingsState, AlertSettingsTypeKey } from "@/data/settings/settings.types";
import { AlertConfigureModal } from "./AlertConfigureModal";
import { AlertSettingsTypeRow } from "./AlertSettingsTypeRow";
import { SettingsCard } from "./SettingsCard";

type AlertsSettingsTypesCardProps = {
  draft: AlertSettingsState;
  onChange: (next: AlertSettingsState) => void;
};

export const AlertsSettingsTypesCard = ({
  draft,
  onChange,
}: AlertsSettingsTypesCardProps) => {
  const t = useTranslations("settings.alerts.types");
  const [configureTypeKey, setConfigureTypeKey] = useState<AlertSettingsTypeKey | null>(
    null,
  );

  const handleToggleEnabled = useCallback(
    (typeKey: AlertSettingsTypeKey, enabled: boolean) => {
      onChange({
        ...draft,
        enabledTypes: {
          ...draft.enabledTypes,
          [typeKey]: enabled,
        },
      });
    },
    [draft, onChange],
  );

  return (
    <>
      <SettingsCard
        icon={BellRing}
        iconAccent="primary"
        title={t("title")}
        description={t("description")}
      >
        <List>
          {alertSettingsTypeKeys.map((typeKey, index) => (
            <AlertSettingsTypeRow
              key={typeKey}
              typeKey={typeKey}
              enabled={draft.enabledTypes[typeKey]}
              index={index}
              onToggleEnabled={(enabled) => handleToggleEnabled(typeKey, enabled)}
              onConfigure={() => setConfigureTypeKey(typeKey)}
            />
          ))}
        </List>
      </SettingsCard>

      <AlertConfigureModal
        typeKey={configureTypeKey}
        isOpen={configureTypeKey !== null}
        onClose={() => setConfigureTypeKey(null)}
      />
    </>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;
