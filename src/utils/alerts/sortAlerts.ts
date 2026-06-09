import type { AlertItem, AlertPriority, AlertSortOption } from "@/data/alerts/alerts.types";
import { getAlertSortDate } from "@/data/alerts/mappers";

const priorityWeight: Record<AlertPriority, number> = {
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

export const sortAlerts = (
  items: AlertItem[],
  sort: AlertSortOption,
): AlertItem[] => {
  const sorted = [...items];

  if (sort === "newest") {
    return sorted.sort((a, b) => getAlertSortDate(b) - getAlertSortDate(a));
  }

  if (sort === "oldest") {
    return sorted.sort((a, b) => getAlertSortDate(a) - getAlertSortDate(b));
  }

  return sorted.sort((a, b) => {
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    return getAlertSortDate(b) - getAlertSortDate(a);
  });
};
