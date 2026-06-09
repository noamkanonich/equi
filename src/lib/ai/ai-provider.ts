import { aiConfig } from "./ai.config";
import type { AiGenerateInput, AiInsight } from "./ai.types";
import {
  mockChartInsight,
  mockPortfolioInsight,
  mockStockInsight,
} from "./mock/mock-ai-insights";

export interface AiProvider {
  generateInsight(input: AiGenerateInput): Promise<AiInsight>;
}

function insightForInput(input: AiGenerateInput): AiInsight {
  switch (input.type) {
    case "portfolio":
      return { ...mockPortfolioInsight, id: `mock-portfolio-${Date.now()}` };
    case "stock":
      return {
        ...mockStockInsight,
        id: `mock-stock-${input.symbol}-${Date.now()}`,
        title: `${input.symbol} analysis`,
      };
    case "smartReplace":
      return {
        ...mockStockInsight,
        id: `mock-replace-${Date.now()}`,
        type: "smartReplace",
        title: `${input.currentSymbol} vs ${input.candidateSymbol}`,
        summary: `Comparing ${input.currentSymbol} with ${input.candidateSymbol} as a potential replacement. This is a decision-support preview using mock data.`,
        suggestedAction: "Watch",
        confidence: "low",
      };
    case "chart":
      return { ...mockChartInsight, id: `mock-chart-${Date.now()}` };
    case "score":
      return {
        ...mockStockInsight,
        id: `mock-score-${input.symbol}-${Date.now()}`,
        type: "score",
        title: `${input.symbol} score explanation`,
        suggestedAction: input.suggestedAction,
        scoreExplanation: `Overall score ${input.score} maps to suggested action: ${input.suggestedAction}.`,
        summary: `Based on current score of ${input.score}, ${input.symbol} receives a ${input.suggestedAction} suggested action. Review category breakdown for details.`,
      };
    default: {
      const _exhaustive: never = input;
      return _exhaustive;
    }
  }
}

/**
 * Generates an AI insight using mock data.
 * TODO: Integrate OpenAI when aiConfig.providers.openai.enabled
 * TODO: Integrate Anthropic when aiConfig.providers.anthropic.enabled
 */
export async function generateAiInsight(
  input: AiGenerateInput,
): Promise<AiInsight> {
  if (!aiConfig.enabled) {
    return insightForInput(input);
  }

  // Future: route to real provider based on aiConfig.defaultProvider
  return insightForInput(input);
}

export const aiProvider: AiProvider = {
  generateInsight: generateAiInsight,
};
