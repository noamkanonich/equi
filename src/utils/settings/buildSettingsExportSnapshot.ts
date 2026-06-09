import type {
  AiPreferencesState,
  AlertSettingsState,
  AppearanceSettingsState,
  EquiSettingsExportPayload,
  GeneralSettingsState,
  PortfolioSettingsState,
  ScoringModelSettingsState,
} from "@/data/settings/settings.types";

type BuildSettingsExportSnapshotParams = {
  general: GeneralSettingsState;
  appearance: AppearanceSettingsState;
  portfolio: PortfolioSettingsState;
  scoringModel: ScoringModelSettingsState;
  alerts: AlertSettingsState;
  aiPreferences: AiPreferencesState;
};

export const buildSettingsExportSnapshot = (
  snapshots: BuildSettingsExportSnapshotParams,
): EquiSettingsExportPayload => ({
  version: "1",
  exportedAt: new Date().toISOString(),
  general: { ...snapshots.general },
  appearance: { ...snapshots.appearance },
  portfolio: { ...snapshots.portfolio },
  scoringModel: {
    ...snapshots.scoringModel,
    weights: { ...snapshots.scoringModel.weights },
  },
  alerts: {
    ...snapshots.alerts,
    enabledTypes: { ...snapshots.alerts.enabledTypes },
    channels: { ...snapshots.alerts.channels },
    enabledPriorities: { ...snapshots.alerts.enabledPriorities },
  },
  aiPreferences: {
    ...snapshots.aiPreferences,
    riskVisibility: { ...snapshots.aiPreferences.riskVisibility },
    enabledSections: { ...snapshots.aiPreferences.enabledSections },
    behavior: { ...snapshots.aiPreferences.behavior },
  },
});
