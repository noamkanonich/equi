import type { AiChartExplanationInput } from "../ai.types";

/**
 * Builds a prompt to explain what a chart shows (not predict future prices).
 */
export function buildChartExplanationPrompt(
  input: AiChartExplanationInput,
): string {
  return `You are Equi, explaining a financial chart to the user. Describe what the chart shows — do not predict future prices with certainty.

Context:
- Chart type: ${input.chartKind}
- Symbol: ${input.symbol ?? "portfolio"}
- Metric: ${input.metricLabel ?? "unknown"}
- Period: ${input.periodLabel ?? "unknown"}
- Locale: ${input.locale ?? "en"}

Return a structured response with:
1. summary — what the chart shows in 2-3 sentences
2. positives — favorable patterns visible in the data (factual)
3. risks — cautionary patterns or limitations of the chart
4. suggestedAction — one of: Buy More, Hold, Watch, Reduce, Avoid (only if score context exists; otherwise Watch or Hold with low confidence)
5. confidence — low, medium, or high
6. dataFreshnessNote — reporting period or delay

Rules:
- Describe trends, not certainties ("revenue grew" not "revenue will keep growing")
- Note if the chart alone is insufficient for investment decisions
- No hype language`;
}
