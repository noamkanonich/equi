import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultAppearanceSettings } from "@/data/settings/settings.mock";
import type { AppearanceSettingsState } from "@/data/settings/settings.types";

type AppearanceState = {
  appearanceSettings: AppearanceSettingsState;
  setAppearanceSettings: (settings: AppearanceSettingsState) => void;
  resetAppearanceSettings: () => void;
};

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      appearanceSettings: defaultAppearanceSettings,
      setAppearanceSettings: (appearanceSettings) => set({ appearanceSettings }),
      resetAppearanceSettings: () =>
        set({ appearanceSettings: { ...defaultAppearanceSettings } }),
    }),
    {
      name: "equi-appearance-settings",
      partialize: (state) => ({
        appearanceSettings: state.appearanceSettings,
      }),
    },
  ),
);
