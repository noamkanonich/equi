import type { AiExplanationSectionKey, AiPreferencesState } from "@/data/settings/settings.types";

export type ValidateAiPreferencesResult = {
  isValid: boolean;
  forcedState?: AiPreferencesState;
  blockedSection?: AiExplanationSectionKey;
};

export const validateAiPreferences = (
  state: AiPreferencesState,
): ValidateAiPreferencesResult => {
  if (state.enabledSections.summary) {
    return { isValid: true };
  }

  return {
    isValid: false,
    blockedSection: "summary",
    forcedState: {
      ...state,
      enabledSections: {
        ...state.enabledSections,
        summary: true,
      },
    },
  };
};
