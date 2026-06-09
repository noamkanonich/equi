import type { AlertItem, AlertType } from "@/data/alerts/alerts.types";
import type { UserCreatedAlert } from "@/data/app-data/user-alert.types";
import type { SetAlertType } from "@/data/alerts/set-alert.types";

const mapSetAlertTypeToAlertType = (type: SetAlertType): AlertType => {
  if (type === "scoreChange") return "score";
  if (type === "buyZone") return "buyZone";
  if (type === "earnings") return "earnings";
  return "price";
};

export const mapUserAlertToAlertItem = (alert: UserCreatedAlert): AlertItem => {
  const alertType = mapSetAlertTypeToAlertType(alert.form.alertType);
  const target = alert.form.targetValue.trim();
  const parsedTarget = Number.parseFloat(target.replace(/[^0-9.-]/g, ""));

  return {
    id: alert.id,
    type: alertType,
    priority: alert.form.priority,
    status: alert.status ?? "active",
    source: "watchlist",
    symbol: alert.symbol,
    companyName: alert.symbol,
    titleKey: "alerts.userCreated.title",
    descriptionKey: "alerts.userCreated.description",
    createdAt: alert.createdAt,
    timestampKey: "alerts.userCreated.timestamp",
    timestampParams: { symbol: alert.symbol },
    primaryValue:
      Number.isFinite(parsedTarget) && parsedTarget > 0
        ? { kind: "money", amount: parsedTarget, currency: "USD" }
        : { kind: "text", valueKey: "alerts.userCreated.noTarget" },
    isHighlighted: true,
  };
};
