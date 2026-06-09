export type SetAlertType = "price" | "buyZone" | "scoreChange" | "earnings";

export type SetAlertPriority = "high" | "medium" | "low";

export type SetAlertFormState = {
  alertType: SetAlertType;
  targetValue: string;
  priority: SetAlertPriority;
  note: string;
};

export const defaultSetAlertFormState: SetAlertFormState = {
  alertType: "price",
  targetValue: "",
  priority: "medium",
  note: "",
};

export const buildSetAlertFormState = (
  initialType: SetAlertType = "price",
): SetAlertFormState => ({
  ...defaultSetAlertFormState,
  alertType: initialType,
});
