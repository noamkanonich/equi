import type { AiPreferencesState } from "@/data/settings/settings.types";

export type AiPreviewVariantKey = `${AiPreferencesState["detailLevel"]}_${AiPreferencesState["tone"]}`;

export type AiPreviewContent =
  | { mode: "text"; variantKey: AiPreviewVariantKey }
  | {
      mode: "detailed";
      variantKey: AiPreviewVariantKey;
      bulletKeys: ["bullet1", "bullet2", "bullet3"];
    };

export const getAiPreviewContent = (settings: AiPreferencesState): AiPreviewContent => {
  const variantKey = `${settings.detailLevel}_${settings.tone}` as AiPreviewVariantKey;

  if (settings.detailLevel === "detailed") {
    return {
      mode: "detailed",
      variantKey,
      bulletKeys: ["bullet1", "bullet2", "bullet3"],
    };
  }

  return {
    mode: "text",
    variantKey,
  };
};

export const getAiPreviewPreferenceLabels = (
  settings: AiPreferencesState,
): {
  detailLevel: AiPreferencesState["detailLevel"];
  tone: AiPreferencesState["tone"];
  riskWarnings: boolean;
  showConfidence: boolean;
  showDownside: boolean;
} => ({
  detailLevel: settings.detailLevel,
  tone: settings.tone,
  riskWarnings: settings.riskVisibility.showRiskWarnings,
  showConfidence: settings.riskVisibility.showConfidenceLevel,
  showDownside: settings.riskVisibility.showDownsideScenarios,
});
