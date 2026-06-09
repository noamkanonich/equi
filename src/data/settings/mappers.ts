import type {
  AiBehaviorKey,
  AiExplanationSectionKey,
  AiInsightDetailLevel,
  AiPreferencesState,
  AiRiskVisibilityKey,
  AiTone,
  AlertSettingsState,
  BenchmarkOption,
  LegacyQuietHoursPayload,
  QuietHoursOption,
  SettingsTabKey,
} from "./settings.types";
import {
  benchmarkOptions,
  defaultAiBehavior,
  defaultAiEnabledSections,
  defaultAiPreferences,
  defaultAiRiskVisibility,
  defaultAlertSettings,
  settingsTabs,
} from "./settings.mock";

export { settingsTabs };

export const getSettingsTabTranslationKey = (tab: SettingsTabKey): string =>
  tab;

export const getBenchmarkSubtitleKey = (
  benchmark: BenchmarkOption,
): string => {
  const subtitleMap: Record<BenchmarkOption, string> = {
    sp500: "standard",
    nasdaq100: "growth",
    dowJones: "industrial",
    russell2000: "smallCap",
    custom: "chooseIndex",
  };

  return subtitleMap[benchmark];
};

export { benchmarkOptions };

export const mapLegacyQuietHoursToOption = (
  legacy: LegacyQuietHoursPayload,
): QuietHoursOption => {
  if ("quietHours" in legacy && legacy.quietHours) {
    return legacy.quietHours;
  }

  const enabled = legacy.quietHoursEnabled;
  const start = legacy.quietHoursStart;
  const end = legacy.quietHoursEnd;

  if (enabled === false) {
    return "disabled";
  }

  if (start === "22:00" && end === "08:00") {
    return "10pm-8am";
  }

  if (start === "23:00" && end === "07:00") {
    return "11pm-7am";
  }

  if (enabled === true && (start || end)) {
    return "custom";
  }

  return defaultAlertSettings.quietHours;
};

const isAiInsightDetailLevel = (value: unknown): value is AiInsightDetailLevel =>
  value === "concise" || value === "balanced" || value === "detailed";

const isAiTone = (value: unknown): value is AiTone =>
  value === "conservative" || value === "balanced" || value === "growthOriented";

const mapLegacyAiTone = (value: unknown): AiTone | undefined => {
  if (value === "aggressive") return "growthOriented";
  return isAiTone(value) ? value : undefined;
};

const mergeBooleanRecord = <K extends string>(
  keys: readonly K[],
  defaults: Record<K, boolean>,
  raw?: Partial<Record<K, boolean>>,
): Record<K, boolean> =>
  keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: raw?.[key] ?? defaults[key],
    }),
    {} as Record<K, boolean>,
  );

export const normalizeAiPreferencesState = (
  raw: Partial<AiPreferencesState> & Record<string, unknown>,
): AiPreferencesState => {
  const detailLevel = isAiInsightDetailLevel(raw.detailLevel)
    ? raw.detailLevel
    : defaultAiPreferences.detailLevel;

  const tone = mapLegacyAiTone(raw.tone) ?? defaultAiPreferences.tone;

  const legacyRisk = raw as {
    showRiskWarnings?: boolean;
    showConfidenceLevel?: boolean;
  };

  const riskVisibility = mergeBooleanRecord(
    Object.keys(defaultAiRiskVisibility) as AiRiskVisibilityKey[],
    defaultAiRiskVisibility,
    {
      ...raw.riskVisibility,
      showRiskWarnings:
        raw.riskVisibility?.showRiskWarnings ?? legacyRisk.showRiskWarnings,
      showConfidenceLevel:
        raw.riskVisibility?.showConfidenceLevel ?? legacyRisk.showConfidenceLevel,
    },
  );

  const enabledSections = mergeBooleanRecord(
    Object.keys(defaultAiEnabledSections) as AiExplanationSectionKey[],
    defaultAiEnabledSections,
    raw.enabledSections,
  );

  enabledSections.summary = true;

  const legacyBehavior = raw as {
    learnFromActions?: boolean;
    useWatchlistActivity?: boolean;
  };

  const behavior = mergeBooleanRecord(
    Object.keys(defaultAiBehavior) as AiBehaviorKey[],
    defaultAiBehavior,
    {
      ...raw.behavior,
      prioritizePortfolioContext:
        raw.behavior?.prioritizePortfolioContext ?? legacyBehavior.learnFromActions,
      considerWatchlistOpportunities:
        raw.behavior?.considerWatchlistOpportunities ??
        legacyBehavior.useWatchlistActivity,
    },
  );

  return {
    detailLevel,
    tone,
    riskVisibility,
    enabledSections,
    behavior,
  };
};

export const normalizeAlertSettingsState = (
  raw: Partial<AlertSettingsState> & LegacyQuietHoursPayload,
): AlertSettingsState => ({
  enabledTypes: {
    ...defaultAlertSettings.enabledTypes,
    ...raw.enabledTypes,
  },
  channels: {
    ...defaultAlertSettings.channels,
    ...raw.channels,
  },
  quietHours: mapLegacyQuietHoursToOption(raw),
  enabledPriorities: {
    ...defaultAlertSettings.enabledPriorities,
    ...raw.enabledPriorities,
  },
});
