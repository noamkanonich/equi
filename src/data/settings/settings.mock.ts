import {
  defaultScoringWeights,
  recommendedScoringWeights,
  scoringFactorKeys,
} from "@/data/scoring/scoring.mock";
import type {
  AlertRulesOverviewStats,
  AlertSettingsState,
  AlertSettingsSummarySegment,
  AlertSettingsTypeKey,
  QuietHoursOption,
  AiBehaviorKey,
  AiExplanationSectionKey,
  AiInsightDetailLevel,
  AiPreferencesQuickAction,
  AiPreferencesState,
  AiPreferencesSummaryItem,
  AiRiskVisibilityKey,
  AiTone,
  AlertsQuickAction,
  AppearanceSettingsState,
  BenchmarkOption,
  DateFormatOption,
  GeneralSettingsState,
  LayoutDensityOption,
  MarketRegionOption,
  MotionPreferenceOption,
  PortfolioQuickAction,
  PortfolioSettingsState,
  PortfolioSummaryItem,
  RiskProfileOption,
  ScoringModelSettingsState,
  ScoringRange,
  ScoringQuickAction,
  SettingsQuickAction,
  SettingsSummaryItem,
  SettingsTabKey,
  TargetAllocationOption,
  ThemeOption,
} from "./settings.types";

export { recommendedScoringWeights, scoringFactorKeys };

export const settingsTabs: SettingsTabKey[] = [
  "general",
  "appearance",
  "portfolio",
  "scoringModel",
  "alerts",
  "aiPreferences",
  "integrations",
];

export const languageOptions = ["en", "he"] as const;

export const currencyOptions = ["USD", "ILS", "EUR"] as const;

export const marketRegionOptions: MarketRegionOption[] = [
  "unitedStates",
  "israel",
  "europe",
  "global",
];

export const dateFormatOptions: DateFormatOption[] = ["us", "european", "iso"];

export const benchmarkOptions: BenchmarkOption[] = [
  "sp500",
  "nasdaq100",
  "dowJones",
  "russell2000",
  "custom",
];

export const defaultGeneralSettings: GeneralSettingsState = {
  language: "en",
  displayCurrency: "USD",
  marketRegion: "unitedStates",
  dateFormat: "us",
  benchmark: "sp500",
};

export const riskProfileOptions: RiskProfileOption[] = [
  "conservative",
  "moderate",
  "aggressive",
];

export const targetAllocationOptions: TargetAllocationOption[] = [
  "automatic",
  "manual",
  "custom",
];

export const defaultPortfolioSettings: PortfolioSettingsState = {
  riskProfile: "moderate",
  targetAllocation: "automatic",
  benchmark: "sp500",
  maxSectorExposure: 30,
  maxSingleStockExposure: 10,
  rebalancingThreshold: 5,
};

export const portfolioSummaryItems: PortfolioSummaryItem[] = [
  { key: "riskProfile", iconKey: "riskProfile" },
  { key: "targetAllocation", iconKey: "targetAllocation" },
  { key: "benchmark", iconKey: "benchmark" },
  { key: "maxSectorExposure", iconKey: "maxSectorExposure" },
  { key: "maxSingleStockExposure", iconKey: "maxSingleStockExposure" },
  { key: "rebalancingThreshold", iconKey: "rebalancingThreshold" },
];

export const portfolioQuickActions: PortfolioQuickAction[] = [
  { key: "resetPortfolioSettings", iconKey: "resetPortfolioSettings" },
  { key: "manageTargetAllocation", iconKey: "manageTargetAllocation" },
  { key: "viewCurrentAllocation", iconKey: "viewCurrentAllocation" },
  { key: "portfolioRiskAnalysis", iconKey: "portfolioRiskAnalysis" },
];

export const settingsSummaryItems: SettingsSummaryItem[] = [
  {
    key: "riskProfile",
    valueKey: "moderate",
    iconKey: "riskProfile",
    iconAccent: "warning",
  },
  {
    key: "targetAllocation",
    valueKey: "enabled",
    iconKey: "targetAllocation",
    iconAccent: "positive",
  },
  {
    key: "scoringModel",
    valueKey: "custom",
    iconKey: "scoringModel",
    iconAccent: "purple",
  },
  {
    key: "alerts",
    valueKey: "enabled",
    iconKey: "alerts",
    iconAccent: "primary",
  },
  {
    key: "aiInsights",
    valueKey: "balanced",
    iconKey: "aiInsights",
    iconAccent: "accentAi",
  },
];

export const settingsQuickActions: SettingsQuickAction[] = [
  { key: "exportSettings", iconKey: "exportSettings" },
  { key: "importSettings", iconKey: "importSettings" },
  { key: "howScoringWorks", iconKey: "howScoringWorks" },
  { key: "helpSupport", iconKey: "helpSupport" },
];

export const themeOptions: ThemeOption[] = ["light", "dark", "system"];

export const layoutDensityOptions: LayoutDensityOption[] = [
  "comfortable",
  "compact",
];

export const motionPreferenceOptions: MotionPreferenceOption[] = [
  "system",
  "reduce",
  "full",
];

export const defaultAppearanceSettings: AppearanceSettingsState = {
  theme: "light",
  backgroundGlow: 40,
  layoutDensity: "comfortable",
  chartAnimations: true,
  cardRadius: 12,
  motionPreference: "system",
};

export const defaultScoringModelSettings: ScoringModelSettingsState = {
  weights: { ...defaultScoringWeights },
  isCustomModel: false,
};

export const scoringRanges: ScoringRange[] = [
  { key: "veryStrong", tone: "positive" },
  { key: "strong", tone: "positiveSoft" },
  { key: "average", tone: "warning" },
  { key: "weak", tone: "warningSoft" },
  { key: "veryWeak", tone: "negative" },
];

export const scoringQuickActions: ScoringQuickAction[] = [
  { key: "compareRecommended", iconKey: "compareRecommended" },
  { key: "resetRecommended", iconKey: "resetRecommended" },
  { key: "saveCustomModel", iconKey: "saveCustomModel" },
  { key: "howScoringWorks", iconKey: "howScoringWorks" },
  { key: "viewFactorDefinitions", iconKey: "viewFactorDefinitions" },
];

export const alertSettingsTypeKeys: AlertSettingsTypeKey[] = [
  "price",
  "buyZone",
  "earnings",
  "score",
  "smartReplace",
  "portfolio",
];

export const alertNotificationChannelKeys = [
  "inApp",
  "email",
  "browserPush",
  "weeklyDigest",
] as const;

export const alertPriorityKeys = ["high", "medium", "low", "info"] as const;

export const quietHoursOptions: QuietHoursOption[] = [
  "10pm-8am",
  "11pm-7am",
  "disabled",
  "custom",
];

export const defaultAlertSettings: AlertSettingsState = {
  enabledTypes: {
    price: true,
    buyZone: true,
    earnings: true,
    score: true,
    smartReplace: true,
    portfolio: true,
    analyst: true,
  },
  channels: {
    inApp: true,
    email: true,
    browserPush: false,
    weeklyDigest: true,
  },
  quietHours: "10pm-8am",
  enabledPriorities: {
    high: true,
    medium: true,
    low: true,
    info: true,
  },
};

export const alertsSettingsSummaryActiveCount = 24;

export const alertsSettingsSummarySegments: AlertSettingsSummarySegment[] = [
  { key: "price", value: 10, percent: 42 },
  { key: "earnings", value: 6, percent: 25 },
  { key: "portfolio", value: 5, percent: 21 },
  { key: "buyZone", value: 4, percent: 17 },
  { key: "score", value: 2, percent: 8 },
  { key: "smartReplace", value: 3, percent: 12 },
];

export const alertRulesOverviewStats: AlertRulesOverviewStats = {
  totalRules: 38,
  activeRules: 24,
  snoozedRules: 6,
  disabledRules: 8,
};

export const alertsQuickActions: AlertsQuickAction[] = [
  { key: "createNewAlert", iconKey: "createNewAlert" },
  { key: "manageRules", iconKey: "manageRules" },
  { key: "snoozedAlerts", iconKey: "snoozedAlerts" },
  { key: "notificationHistory", iconKey: "notificationHistory" },
];

export const aiDetailLevelOptions: AiInsightDetailLevel[] = [
  "concise",
  "balanced",
  "detailed",
];

export const aiToneOptions: AiTone[] = ["conservative", "balanced", "growthOriented"];

export const aiRiskVisibilityKeys: AiRiskVisibilityKey[] = [
  "showRiskWarnings",
  "showDownsideScenarios",
  "showConfidenceLevel",
  "showMissingDataWarnings",
];

export const aiExplanationSectionKeys: AiExplanationSectionKey[] = [
  "summary",
  "strengths",
  "risks",
  "whatChanged",
  "suggestedNextStep",
  "confidence",
  "dataFreshness",
];

export const aiBehaviorKeys: AiBehaviorKey[] = [
  "prioritizePortfolioContext",
  "compareAgainstSectorPeers",
  "considerWatchlistOpportunities",
  "includeEarningsContext",
  "conservativeFallback",
];

export const defaultAiRiskVisibility: Record<AiRiskVisibilityKey, boolean> = {
  showRiskWarnings: true,
  showDownsideScenarios: true,
  showConfidenceLevel: true,
  showMissingDataWarnings: true,
};

export const defaultAiEnabledSections: Record<AiExplanationSectionKey, boolean> = {
  summary: true,
  strengths: true,
  risks: true,
  whatChanged: true,
  suggestedNextStep: true,
  confidence: true,
  dataFreshness: true,
};

export const defaultAiBehavior: Record<AiBehaviorKey, boolean> = {
  prioritizePortfolioContext: true,
  compareAgainstSectorPeers: true,
  considerWatchlistOpportunities: true,
  includeEarningsContext: true,
  conservativeFallback: true,
};

export const defaultAiPreferences: AiPreferencesState = {
  detailLevel: "balanced",
  tone: "balanced",
  riskVisibility: { ...defaultAiRiskVisibility },
  enabledSections: { ...defaultAiEnabledSections },
  behavior: { ...defaultAiBehavior },
};

export const aiPreferencesSummaryItems: AiPreferencesSummaryItem[] = [
  { key: "detailLevel", iconKey: "detailLevel" },
  { key: "tone", iconKey: "tone" },
  { key: "riskWarnings", iconKey: "riskWarnings" },
  { key: "confidenceLevel", iconKey: "confidenceLevel" },
  { key: "portfolioContext", iconKey: "portfolioContext" },
  { key: "dataFreshness", iconKey: "dataFreshness" },
];

export const aiPreferencesQuickActions: AiPreferencesQuickAction[] = [
  { key: "resetAiPreferences", iconKey: "resetAiPreferences" },
  { key: "previewAiResponse", iconKey: "previewAiResponse" },
  { key: "viewAiSafetyRules", iconKey: "viewAiSafetyRules" },
  { key: "explainConfidenceScores", iconKey: "explainConfidenceScores" },
];
