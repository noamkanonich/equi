import type { AlertStatus } from "@/data/alerts/alerts.types";
import type { SetAlertFormState } from "@/data/alerts/set-alert.types";

export type UserCreatedAlert = {
  id: string;
  symbol: string;
  form: SetAlertFormState & { note?: string };
  status: AlertStatus;
  createdAt: string;
};

export type UserCreatedAlertInput = {
  symbol: string;
  form: SetAlertFormState & { note?: string };
};
