import type { AlertStatus } from "@/data/alerts/alerts.types";
import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import type { AlertSettingsState } from "@/data/settings/settings.types";
import { getAlertTabCount } from "@/data/alerts/mappers";
import { applyAlertSettingsToAlerts } from "@/utils/alerts/applyAlertSettingsToAlerts";
import { buildMergedAlerts } from "@/utils/alerts/buildMergedAlerts";

export const computeAlertCounts = (
  userCreatedAlerts: UserCreatedAlert[],
  alertStatusOverrides: Record<string, AlertStatus>,
  alertSettings: AlertSettingsState,
  includeDemoAlerts = false,
): { activeAlertsCount: number; snoozedAlertsCount: number } => {
  const items = applyAlertSettingsToAlerts(
    buildMergedAlerts({
      userCreatedAlerts,
      alertStatusOverrides,
      includeDemoAlerts,
    }),
    alertSettings,
  );

  return {
    activeAlertsCount: getAlertTabCount(items, "active"),
    snoozedAlertsCount: getAlertTabCount(items, "snoozed"),
  };
};
