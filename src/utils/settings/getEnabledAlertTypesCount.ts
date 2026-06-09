import { alertSettingsTypeKeys } from "@/data/settings/settings.mock";
import type { AlertSettingsState } from "@/data/settings/settings.types";

export const getEnabledAlertTypesCount = (state: AlertSettingsState): number =>
  alertSettingsTypeKeys.filter((typeKey) => state.enabledTypes[typeKey]).length;
