import type {
  AlertItem,
  AlertMetricKind,
  AlertQuickFilter,
  AlertSummaryBreakdown,
  AlertSummaryMetric,
  AlertType,
} from "@/data/alerts/alerts.types";
import { getAlertTabCount } from "@/data/alerts/mappers";
import { matchesQuickFilter } from "@/utils/alerts/filterAlerts";

const summaryMetricTypes: Array<{
  kind: AlertMetricKind;
  type?: AlertType;
  showNewCount?: boolean;
}> = [
  { kind: "activeAlerts", showNewCount: true },
  { kind: "priceAlerts", type: "price", showNewCount: true },
  { kind: "earningsAlerts", type: "earnings", showNewCount: true },
  { kind: "portfolioAlerts", type: "portfolio" },
  { kind: "smartReplace", type: "smartReplace", showNewCount: true },
];

const breakdownTypes: AlertSummaryBreakdown["key"][] = [
  "price",
  "earnings",
  "portfolio",
  "smartReplace",
];

const isVisibleAlert = (alert: AlertItem): boolean => alert.status !== "dismissed";

const buildTrend = (value: number): number[] =>
  Array.from({ length: 7 }, (_, index) =>
    Math.max(0, value - (6 - index)),
  );

const countByType = (alerts: AlertItem[], type: AlertType): number =>
  alerts.filter((alert) => alert.type === type).length;

const countTriggeredByType = (alerts: AlertItem[], type: AlertType): number =>
  alerts.filter((alert) => alert.type === type && alert.status === "triggered")
    .length;

export const buildAlertSummaryMetrics = (
  alerts: AlertItem[],
): AlertSummaryMetric[] => {
  const visibleAlerts = alerts.filter(isVisibleAlert);

  return summaryMetricTypes.map((metric) => {
    const value = metric.type
      ? countByType(visibleAlerts, metric.type)
      : getAlertTabCount(alerts, "active");
    const newCount = metric.showNewCount
      ? metric.type
        ? countTriggeredByType(visibleAlerts, metric.type)
        : getAlertTabCount(alerts, "triggered")
      : null;

    return {
      kind: metric.kind,
      value,
      newCount,
      trend: buildTrend(value),
    };
  });
};

export const buildAlertSummaryBreakdown = (
  alerts: AlertItem[],
): AlertSummaryBreakdown[] => {
  const visibleAlerts = alerts.filter(isVisibleAlert);
  const counts = breakdownTypes.map((type) => ({
    key: type,
    value: countByType(visibleAlerts, type),
  }));
  const total = counts.reduce((sum, segment) => sum + segment.value, 0);

  return counts.map((segment) => ({
    ...segment,
    percent: total > 0 ? Math.round((segment.value / total) * 100) : 0,
  }));
};

export const buildAlertQuickFilters = (
  alerts: AlertItem[],
  filters: AlertQuickFilter[],
): AlertQuickFilter[] => {
  const visibleAlerts = alerts.filter(isVisibleAlert);

  return filters.map((filter) => ({
    ...filter,
    count: visibleAlerts.filter((alert) => matchesQuickFilter(alert, filter))
      .length,
  }));
};
