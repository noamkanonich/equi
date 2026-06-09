import type { PortfolioSettingsState } from "@/data/settings/settings.types";
import { usePortfolioSettingsStore } from "@/store/portfolio-settings.store";

export const applyPortfolioSettings = (
  draft: PortfolioSettingsState,
): PortfolioSettingsState => {
  usePortfolioSettingsStore.getState().setPortfolioSettings(draft);
  return draft;
};
