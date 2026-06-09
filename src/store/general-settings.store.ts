import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultGeneralSettings } from "@/data/settings/settings.mock";
import type { GeneralSettingsState } from "@/data/settings/settings.types";

type GeneralSettingsStoreState = {
  generalSettings: Omit<GeneralSettingsState, "language" | "displayCurrency">;
  setGeneralSettings: (
    settings: Omit<GeneralSettingsState, "language" | "displayCurrency">,
  ) => void;
  resetGeneralSettings: () => void;
};

const pickPersistedGeneralSettings = (
  settings: GeneralSettingsState,
): Omit<GeneralSettingsState, "language" | "displayCurrency"> => ({
  marketRegion: settings.marketRegion,
  dateFormat: settings.dateFormat,
  benchmark: settings.benchmark,
});

export const useGeneralSettingsStore = create<GeneralSettingsStoreState>()(
  persist(
    (set) => ({
      generalSettings: pickPersistedGeneralSettings(defaultGeneralSettings),
      setGeneralSettings: (generalSettings) => set({ generalSettings }),
      resetGeneralSettings: () =>
        set({
          generalSettings: pickPersistedGeneralSettings(defaultGeneralSettings),
        }),
    }),
    {
      name: "equi-general-settings",
      partialize: (state) => ({
        generalSettings: state.generalSettings,
      }),
    },
  ),
);
