import { alerts as demoAlerts } from "@/data/alerts/alerts.mock";
import type { AlertItem, AlertStatus } from "@/data/alerts/alerts.types";
import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import { mapUserAlertToAlertItem } from "@/utils/alerts/mapUserAlertToAlertItem";

type BuildMergedAlertsInput = {
  userCreatedAlerts: UserCreatedAlert[];
  alertStatusOverrides: Record<string, AlertStatus>;
  includeDemoAlerts: boolean;
};

export const buildMergedAlerts = ({
  userCreatedAlerts,
  alertStatusOverrides,
  includeDemoAlerts,
}: BuildMergedAlertsInput): AlertItem[] => {
  const merged = [
    ...userCreatedAlerts.map(mapUserAlertToAlertItem),
    ...(includeDemoAlerts ? demoAlerts : []),
  ];

  return merged.map((alert) => ({
    ...alert,
    status: alertStatusOverrides[alert.id] ?? alert.status,
  }));
};
