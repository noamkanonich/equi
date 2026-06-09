import type { AlertItem, AlertStatus } from "@/data/alerts/alerts.types";

export const updateAlertStatus = (
  items: AlertItem[],
  alertId: string,
  status: AlertStatus,
): AlertItem[] =>
  items.map((item) => (item.id === alertId ? { ...item, status } : item));
