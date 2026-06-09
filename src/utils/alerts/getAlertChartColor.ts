import type { DefaultTheme } from "styled-components";
import type { AlertType } from "@/data/alerts/alerts.types";
import { getAlertTypeMeta } from "@/utils/alerts/getAlertTypeMeta";

export const getAlertChartColor = (type: AlertType, theme: DefaultTheme): string => {
  const { chartColorKey } = getAlertTypeMeta(type);
  return theme.colors.chart[chartColorKey];
};
