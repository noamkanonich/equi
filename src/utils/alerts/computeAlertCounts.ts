import { alerts } from "@/data/alerts/alerts.mock";
import type { AlertItem, AlertStatus } from "@/data/alerts/alerts.types";
import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import { getAlertTabCount } from "@/data/alerts/mappers";
import { mapUserAlertToAlertItem } from "@/utils/alerts/mapUserAlertToAlertItem";

export const buildMergedAlertsWithStatus = (
  userCreatedAlerts: UserCreatedAlert[],
  alertStatusOverrides: Record<string, AlertStatus>,
): AlertItem[] => {
  const merged = [
    ...userCreatedAlerts.map(mapUserAlertToAlertItem),
    ...alerts,
  ];

  return merged.map((alert) => ({
    ...alert,
    status: alertStatusOverrides[alert.id] ?? alert.status,
  }));
};

export const computeAlertCounts = (
  userCreatedAlerts: UserCreatedAlert[],
  alertStatusOverrides: Record<string, AlertStatus>,
): { activeAlertsCount: number; snoozedAlertsCount: number } => {
  const items = buildMergedAlertsWithStatus(userCreatedAlerts, alertStatusOverrides);

  return {
    activeAlertsCount: getAlertTabCount(items, "active"),
    snoozedAlertsCount: getAlertTabCount(items, "snoozed"),
  };
};
