import type { AlertSettingsState } from "@/data/settings/settings.types";

export const hasAtLeastOnePriorityEnabled = (state: AlertSettingsState): boolean =>
  Object.values(state.enabledPriorities).some(Boolean);
