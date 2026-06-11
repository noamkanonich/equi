import type { AlertItem } from "@/data/alerts/alerts.types";
import type { AlertSettingsState } from "@/data/settings/settings.types";

export const applyAlertSettingsToAlerts = (
  alerts: AlertItem[],
  settings: AlertSettingsState,
): AlertItem[] =>
  alerts.filter(
    (alert) =>
      settings.enabledTypes[alert.type] === true &&
      settings.enabledPriorities[alert.priority] === true,
  );
