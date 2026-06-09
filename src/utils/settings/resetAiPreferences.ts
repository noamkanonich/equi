import { defaultAiPreferences } from "@/data/settings/settings.mock";
import type { AiPreferencesState } from "@/data/settings/settings.types";

export const resetAiPreferences = (): AiPreferencesState => ({
  ...defaultAiPreferences,
  riskVisibility: { ...defaultAiPreferences.riskVisibility },
  enabledSections: { ...defaultAiPreferences.enabledSections },
  behavior: { ...defaultAiPreferences.behavior },
});
