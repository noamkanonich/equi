import { defaultPortfolioSettings } from "@/data/settings/settings.mock";
import type { PortfolioSettingsState } from "@/data/settings/settings.types";

export const resetPortfolioSettings = (): PortfolioSettingsState => ({
  ...defaultPortfolioSettings,
});
