import type { SettingsTabKey } from "@/data/settings/settings.types";
import { getSettingsTabTranslationKey } from "@/data/settings/mappers";

export const getSettingsTabLabelKey = (tab: SettingsTabKey): string =>
  getSettingsTabTranslationKey(tab);
