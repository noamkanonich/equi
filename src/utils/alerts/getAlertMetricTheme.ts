import type { AlertMetricKind } from "@/data/alerts/alerts.types";
import type { MiniSparklineVariant } from "@/components/charts/MiniSparklineChart";

export type AlertMetricTheme = {
  sparklineVariant: MiniSparklineVariant;
  showSparkline: boolean;
};

export type AlertMetricThemeKind = AlertMetricKind;

const alertMetricThemes: Record<AlertMetricKind, AlertMetricTheme> = {
  activeAlerts: {
    sparklineVariant: "neutral",
    showSparkline: true,
  },
  priceAlerts: {
    sparklineVariant: "purple",
    showSparkline: true,
  },
  earningsAlerts: {
    sparklineVariant: "amber",
    showSparkline: true,
  },
  portfolioAlerts: {
    sparklineVariant: "positive",
    showSparkline: false,
  },
  smartReplace: {
    sparklineVariant: "purple",
    showSparkline: false,
  },
};

export const getAlertMetricTheme = (kind: AlertMetricKind): AlertMetricTheme =>
  alertMetricThemes[kind];
