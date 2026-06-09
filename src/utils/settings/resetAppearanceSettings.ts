import { defaultAppearanceSettings } from "@/data/settings/settings.mock";
import type { AppearanceSettingsState } from "@/data/settings/settings.types";
import { useAppearanceStore } from "@/store/appearance.store";

export const resetAppearanceSettings = (): AppearanceSettingsState => ({
  ...defaultAppearanceSettings,
});

export const applyAppearanceSettings = (
  draft: AppearanceSettingsState,
): AppearanceSettingsState => {
  useAppearanceStore.getState().setAppearanceSettings(draft);
  return draft;
};
