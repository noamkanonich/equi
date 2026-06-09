import { defaultAlertSettings } from "@/data/settings/settings.mock";
import type { AlertSettingsState } from "@/data/settings/settings.types";

export const resetAlertsSettings = (): AlertSettingsState => ({
  ...defaultAlertSettings,
  enabledTypes: { ...defaultAlertSettings.enabledTypes },
  channels: { ...defaultAlertSettings.channels },
  enabledPriorities: { ...defaultAlertSettings.enabledPriorities },
});
