import type { CurrencyCode } from "@/data/currencies/currency.types";

export type AlertType =
  | "price"
  | "earnings"
  | "portfolio"
  | "buyZone"
  | "score"
  | "smartReplace"
  | "analyst";

export type AlertPriority = "high" | "medium" | "low" | "info";

export type AlertStatus = "active" | "triggered" | "snoozed" | "dismissed";

export type AlertSource = "portfolio" | "watchlist" | "system";

export type AlertTab =
  | "allAlerts"
  | "active"
  | "triggered"
  | "snoozed"
  | "dismissed";

export type AlertSortOption = "newest" | "oldest" | "priority";

export type AlertMetricKind =
  | "activeAlerts"
  | "priceAlerts"
  | "earningsAlerts"
  | "portfolioAlerts"
  | "smartReplace";

export type AlertTone = "positive" | "negative" | "neutral" | "warning";

export type AlertPrimaryValue =
  | { kind: "money"; amount: number; currency: CurrencyCode }
  | { kind: "text"; valueKey: string }
  | { kind: "date"; value: string }
  | { kind: "percent"; value: number }
  | { kind: "points"; value: number };

export type AlertSecondaryValue =
  | { kind: "percent"; value: number }
  | { kind: "textKey"; valueKey: string }
  | { kind: "text"; value: string };

export type AlertItem = {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  source: AlertSource;
  titleKey: string;
  descriptionKey: string;
  symbol?: string;
  companyName?: string;
  logoUrl?: string | null;
  triggeredAt?: string;
  createdAt: string;
  timestampKey: string;
  timestampParams?: Record<string, string | number>;
  primaryValue: AlertPrimaryValue;
  secondaryValue?: AlertSecondaryValue;
  isHighlighted?: boolean;
};

export type AlertSummaryMetric = {
  kind: AlertMetricKind;
  value: number;
  newCount: number | null;
  trend: number[];
};

export type AlertSummaryBreakdown = {
  key: "price" | "earnings" | "portfolio" | "smartReplace";
  value: number;
  percent: number;
};

export type AlertQuickFilterKey =
  | "highPriority"
  | "priceAlerts"
  | "earningsAlerts"
  | "buyZoneAlerts"
  | "scoreAlerts"
  | "portfolioRisks";

export type AlertQuickFilter = {
  key: AlertQuickFilterKey;
  count: number;
  tone: AlertTone;
  filterType: AlertType | AlertPriority | "portfolio";
};

export type SnoozedAlertsSummary = {
  count: number;
};

export type AlertFilters = {
  searchQuery: string;
  quickFilterKey: AlertQuickFilterKey | null;
  tab: AlertTab;
  sort: AlertSortOption;
};
