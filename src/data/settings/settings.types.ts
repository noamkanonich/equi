import type { AlertPriority, AlertType } from "@/data/alerts/alerts.types";
import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { SupportedLocale } from "@/data/i18n/i18n.types";
import type { ScoringFactorWeights } from "@/data/scoring/scoring.types";

export type SettingsTabKey =
  | "general"
  | "appearance"
  | "portfolio"
  | "scoringModel"
  | "alerts"
  | "aiPreferences"
  | "integrations";

export type MarketRegionOption = "unitedStates" | "israel" | "europe" | "global";

export type DateFormatOption = "us" | "european" | "iso";

export type BenchmarkOption =
  | "sp500"
  | "nasdaq100"
  | "dowJones"
  | "russell2000"
  | "custom";

export type GeneralSettingsState = {
  language: SupportedLocale;
  displayCurrency: CurrencyCode;
  marketRegion: MarketRegionOption;
  dateFormat: DateFormatOption;
  benchmark: BenchmarkOption;
};

export type RiskProfileOption = "conservative" | "moderate" | "aggressive";

export type TargetAllocationOption = "automatic" | "manual" | "custom";

export type PortfolioSettingsState = {
  riskProfile: RiskProfileOption;
  targetAllocation: TargetAllocationOption;
  benchmark: BenchmarkOption;
  maxSectorExposure: number;
  maxSingleStockExposure: number;
  rebalancingThreshold: number;
};

export type PortfolioSummaryItemKey =
  | "riskProfile"
  | "targetAllocation"
  | "benchmark"
  | "maxSectorExposure"
  | "maxSingleStockExposure"
  | "rebalancingThreshold";

export type PortfolioSummaryItem = {
  key: PortfolioSummaryItemKey;
  iconKey: PortfolioSummaryItemKey;
};

export type PortfolioQuickActionKey =
  | "resetPortfolioSettings"
  | "manageTargetAllocation"
  | "viewCurrentAllocation"
  | "portfolioRiskAnalysis";

export type PortfolioQuickAction = {
  key: PortfolioQuickActionKey;
  iconKey: PortfolioQuickActionKey;
};

export type SettingsSummaryItemKey =
  | "riskProfile"
  | "targetAllocation"
  | "scoringModel"
  | "alerts"
  | "aiInsights";

export type SettingsSummaryIconAccent =
  | "warning"
  | "positive"
  | "purple"
  | "primary"
  | "accentAi";

export type SettingsSummaryItem = {
  key: SettingsSummaryItemKey;
  valueKey: string;
  iconKey: SettingsSummaryItemKey;
  iconAccent: SettingsSummaryIconAccent;
};

export type SettingsQuickActionKey =
  | "exportSettings"
  | "importSettings"
  | "howScoringWorks"
  | "helpSupport";

export type SettingsQuickAction = {
  key: SettingsQuickActionKey;
  iconKey: SettingsQuickActionKey;
};

export type { SupportedLocale as LanguageOption };

export type DisplayCurrencyOption = CurrencyCode;

export type ThemeOption = "light" | "dark" | "system";

export type LayoutDensityOption = "comfortable" | "compact";

export type MotionPreferenceOption = "system" | "reduce" | "full";

export type AppearanceSettingsState = {
  theme: ThemeOption;
  backgroundGlow: number;
  layoutDensity: LayoutDensityOption;
  chartAnimations: boolean;
  cardRadius: number;
  motionPreference: MotionPreferenceOption;
};

export type ScoringModelSettingsState = {
  weights: ScoringFactorWeights;
  isCustomModel: boolean;
};

export type ScoringModelValidation = {
  total: number;
  isValid: boolean;
};

export type ScoringRangeKey =
  | "veryStrong"
  | "strong"
  | "average"
  | "weak"
  | "veryWeak";

export type ScoringRangeTone =
  | "positive"
  | "positiveSoft"
  | "warning"
  | "warningSoft"
  | "negative";

export type ScoringRange = {
  key: ScoringRangeKey;
  tone: ScoringRangeTone;
};

export type ScoringQuickActionKey =
  | "compareRecommended"
  | "resetRecommended"
  | "saveCustomModel"
  | "howScoringWorks"
  | "viewFactorDefinitions";

export type ScoringQuickAction = {
  key: ScoringQuickActionKey;
  iconKey: ScoringQuickActionKey;
};

export type AlertNotificationChannel =
  | "inApp"
  | "email"
  | "browserPush"
  | "weeklyDigest";

export type AlertSettingsTypeKey = Exclude<AlertType, "analyst">;

export type QuietHoursOption = "10pm-8am" | "11pm-7am" | "disabled" | "custom";

export type AlertSettingsSummarySegmentKey =
  | "price"
  | "earnings"
  | "portfolio"
  | "buyZone"
  | "score"
  | "smartReplace";

export type AlertSettingsSummarySegment = {
  key: AlertSettingsSummarySegmentKey;
  value: number;
  percent: number;
};

export type AlertConfigureFieldKey = "priority" | "frequency" | "channels" | "threshold";

export type AlertSettingsState = {
  enabledTypes: Record<AlertType, boolean>;
  channels: Record<AlertNotificationChannel, boolean>;
  quietHours: QuietHoursOption;
  enabledPriorities: Record<AlertPriority, boolean>;
};

/** Legacy persisted / import shape — migrated on load */
export type LegacyQuietHoursPayload = {
  quietHours?: QuietHoursOption;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
};

export type AlertRulesOverviewStats = {
  totalRules: number;
  activeRules: number;
  snoozedRules: number;
  disabledRules: number;
};

export type AlertsQuickActionKey =
  | "createNewAlert"
  | "manageRules"
  | "snoozedAlerts"
  | "notificationHistory";

export type AlertsQuickAction = {
  key: AlertsQuickActionKey;
  iconKey: AlertsQuickActionKey;
};

export type AiInsightDetailLevel = "concise" | "balanced" | "detailed";

/** @deprecated Use AiInsightDetailLevel */
export type AiDetailLevelOption = AiInsightDetailLevel;

export type AiTone = "conservative" | "balanced" | "growthOriented";

/** @deprecated Use AiTone */
export type AiToneOption = AiTone;

export type AiRiskVisibilityKey =
  | "showRiskWarnings"
  | "showDownsideScenarios"
  | "showConfidenceLevel"
  | "showMissingDataWarnings";

export type AiExplanationSectionKey =
  | "summary"
  | "strengths"
  | "risks"
  | "whatChanged"
  | "suggestedNextStep"
  | "confidence"
  | "dataFreshness";

export type AiBehaviorKey =
  | "prioritizePortfolioContext"
  | "compareAgainstSectorPeers"
  | "considerWatchlistOpportunities"
  | "includeEarningsContext"
  | "conservativeFallback";

export type AiPreferencesState = {
  detailLevel: AiInsightDetailLevel;
  tone: AiTone;
  riskVisibility: Record<AiRiskVisibilityKey, boolean>;
  enabledSections: Record<AiExplanationSectionKey, boolean>;
  behavior: Record<AiBehaviorKey, boolean>;
};

export type AiPreferencesSummaryItemKey =
  | "detailLevel"
  | "tone"
  | "riskWarnings"
  | "confidenceLevel"
  | "portfolioContext"
  | "dataFreshness";

export type AiPreferencesSummaryItem = {
  key: AiPreferencesSummaryItemKey;
  iconKey: AiPreferencesSummaryItemKey;
};

export type AiPreferencesQuickActionKey =
  | "resetAiPreferences"
  | "previewAiResponse"
  | "viewAiSafetyRules"
  | "explainConfidenceScores";

export type AiPreferencesQuickAction = {
  key: AiPreferencesQuickActionKey;
  iconKey: AiPreferencesQuickActionKey;
};

export type AiPreviewTextKey = `${AiInsightDetailLevel}_${AiTone}`;

export type EquiSettingsExportVersion = "1";

export type EquiSettingsExportPayload = {
  version: EquiSettingsExportVersion;
  exportedAt: string;
  general: GeneralSettingsState;
  appearance: AppearanceSettingsState;
  portfolio: PortfolioSettingsState;
  scoringModel: ScoringModelSettingsState;
  alerts: AlertSettingsState;
  aiPreferences: AiPreferencesState;
};

export type SettingsImportErrorReason =
  | "invalidJson"
  | "invalidFormat"
  | "unsupportedVersion";

export type SettingsImportResult =
  | { ok: true; payload: EquiSettingsExportPayload }
  | { ok: false; reason: SettingsImportErrorReason };

export type AppliedSettingsSnapshot = {
  general: GeneralSettingsState;
  appearance: AppearanceSettingsState;
  portfolio: PortfolioSettingsState;
  scoringModel: ScoringModelSettingsState;
  alerts: AlertSettingsState;
  aiPreferences: AiPreferencesState;
};

export type SettingsQuickActionsFeedback = {
  exportStatus: "idle" | "success";
  importStatus: "idle" | "success" | "error";
  importErrorReason?: SettingsImportErrorReason;
};
