import type { AlertPriority, AlertType } from "@/data/alerts/alerts.types";

export type AlertTone = "positive" | "negative" | "warning" | "neutral" | "brand";

export type AlertTypeMeta = {
  tone: AlertTone;
  chartColorKey: "blue" | "amber" | "green" | "purple" | "cyan" | "red";
};

export const getAlertPriorityTone = (
  priority: AlertPriority,
): AlertTone => {
  if (priority === "high") return "negative";
  if (priority === "medium") return "warning";
  if (priority === "low") return "positive";
  return "brand";
};

export const getAlertPriorityMeta = (priority: AlertPriority) => ({
  tone: getAlertPriorityTone(priority),
});

const alertTypeMetaMap: Record<AlertType, AlertTypeMeta> = {
  price: { tone: "brand", chartColorKey: "blue" },
  earnings: { tone: "warning", chartColorKey: "amber" },
  portfolio: { tone: "positive", chartColorKey: "green" },
  buyZone: { tone: "positive", chartColorKey: "cyan" },
  score: { tone: "brand", chartColorKey: "purple" },
  smartReplace: { tone: "brand", chartColorKey: "purple" },
  analyst: { tone: "neutral", chartColorKey: "cyan" },
};

export const getAlertTypeMeta = (type: AlertType): AlertTypeMeta =>
  alertTypeMetaMap[type];
