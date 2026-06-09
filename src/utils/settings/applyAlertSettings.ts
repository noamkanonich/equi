import type { AlertSettingsState } from "@/data/settings/settings.types";
import { useAlertSettingsStore } from "@/store/alert-settings.store";

export const applyAlertSettings = (draft: AlertSettingsState): AlertSettingsState => {
  useAlertSettingsStore.getState().setAlertSettings(draft);
  return draft;
};
