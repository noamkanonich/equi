import type { AlertItem, AlertTab } from "./alerts.types";

export const alertTabs: AlertTab[] = [
  "allAlerts",
  "active",
  "triggered",
  "snoozed",
  "dismissed",
];

export const getAlertTabCount = (items: AlertItem[], tab: AlertTab): number => {
  switch (tab) {
    case "allAlerts":
      return items.filter((item) => item.status !== "dismissed").length;
    case "active":
      return items.filter(
        (item) => item.status === "active" || item.status === "triggered",
      ).length;
    case "triggered":
      return items.filter((item) => item.status === "triggered").length;
    case "snoozed":
      return items.filter((item) => item.status === "snoozed").length;
    case "dismissed":
      return items.filter((item) => item.status === "dismissed").length;
    default:
      return 0;
  }
};

export const getAlertTabCounts = (items: AlertItem[]): Record<AlertTab, number> =>
  alertTabs.reduce<Record<AlertTab, number>>(
    (counts, tab) => ({
      ...counts,
      [tab]: getAlertTabCount(items, tab),
    }),
    {
      allAlerts: 0,
      active: 0,
      triggered: 0,
      snoozed: 0,
      dismissed: 0,
    },
  );

export const getAlertViewHref = (alert: AlertItem): string | undefined => {
  if (alert.type === "portfolio") {
    return "/portfolio";
  }

  if (alert.type === "smartReplace") {
    return "/smart-replace";
  }

  if (alert.symbol) {
    return `/stocks/${alert.symbol}`;
  }

  return undefined;
};

export const getAlertSortDate = (alert: AlertItem): number => {
  const dateString = alert.triggeredAt ?? alert.createdAt;
  return new Date(dateString).getTime();
};
