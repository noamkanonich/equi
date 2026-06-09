import type { AiPreferencesState } from "@/data/settings/settings.types";
import { useAiPreferencesStore } from "@/store/ai-preferences.store";

export const applyAiPreferencesSettings = (
  draft: AiPreferencesState,
): AiPreferencesState => {
  useAiPreferencesStore.getState().setAiPreferences(draft);
  return draft;
};
