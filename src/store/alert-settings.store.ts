import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeAlertSettingsState } from "@/data/settings/mappers";
import { defaultAlertSettings } from "@/data/settings/settings.mock";
import type { AlertSettingsState } from "@/data/settings/settings.types";

type AlertSettingsStoreState = {
  alertSettings: AlertSettingsState;
  setAlertSettings: (settings: AlertSettingsState) => void;
  resetAlertSettings: () => void;
};

export const useAlertSettingsStore = create<AlertSettingsStoreState>()(
  persist(
    (set) => ({
      alertSettings: defaultAlertSettings,
      setAlertSettings: (alertSettings) => set({ alertSettings }),
      resetAlertSettings: () => set({ alertSettings: { ...defaultAlertSettings } }),
    }),
    {
      name: "equi-alert-settings",
      partialize: (state) => ({
        alertSettings: state.alertSettings,
      }),
      merge: (persisted, current) => {
        const persistedState = persisted as
          | { alertSettings?: Partial<AlertSettingsState> }
          | undefined;

        if (!persistedState?.alertSettings) {
          return current;
        }

        return {
          ...current,
          alertSettings: normalizeAlertSettingsState(persistedState.alertSettings),
        };
      },
    },
  ),
);
