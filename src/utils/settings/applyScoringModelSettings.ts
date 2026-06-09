import type { ScoringModelSettingsState } from "@/data/settings/settings.types";
import { useScoringSettingsStore } from "@/store/scoring-settings.store";

export const applyScoringModelSettings = (
  draft: ScoringModelSettingsState,
): ScoringModelSettingsState => {
  useScoringSettingsStore.getState().setScoringModelSettings(draft);
  return draft;
};
