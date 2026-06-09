import type { AiInsight } from "../ai.types";

const DISCLAIMER =
  "This is not financial advice. Insights are for informational and decision-support purposes only.";

export const mockPortfolioInsight: AiInsight = {
  id: "mock-portfolio-1",
  type: "portfolio",
  title: "Portfolio overview",
  summary:
    "Your portfolio is moderately diversified across 8 holdings. Technology represents the largest sector weight. Recent performance is slightly ahead of your benchmark over the last month.",
  positives: [
    "Diversification across multiple sectors reduces single-name risk",
    "Top holdings show solid profitability scores on average",
    "No single position exceeds 25% of total value",
  ],
  risks: [
    "Technology concentration may increase volatility if the sector corrects",
    "Two holdings have Watch scores due to elevated valuation",
    "International exposure is limited relative to US equities",
  ],
  suggestedAction: "Hold",
  confidence: "medium",
  scoreExplanation:
    "Based on current aggregate scores, a Hold posture fits the mix of strong and Watch-rated names.",
  whatChanged: [
    "Portfolio value up 2.1% over the last 30 days",
    "One position moved from Hold to Watch after earnings",
  ],
  dataFreshnessNote: "Prices as of last market close; scores refreshed within 24 hours.",
  disclaimer: DISCLAIMER,
  createdAt: new Date().toISOString(),
};

export const mockStockInsight: AiInsight = {
  id: "mock-stock-aapl",
  type: "stock",
  title: "AAPL analysis",
  summary:
    "Apple shows strong profitability and financial health scores. Valuation is above sector median, which may limit near-term upside. Momentum remains positive but is cooling.",
  positives: [
    "High profitability and cash generation scores",
    "Strong brand and ecosystem moat reflected in stability metrics",
    "Analyst sentiment remains moderately positive",
  ],
  risks: [
    "Valuation score suggests the stock may be priced for growth",
    "Revenue growth has slowed versus prior years — worth monitoring",
    "Regulatory headlines in key markets may add uncertainty",
  ],
  suggestedAction: "Hold",
  confidence: "high",
  scoreExplanation:
    "Overall score of 76 maps to Hold: solid fundamentals with valuation as the main drag.",
  whatChanged: [
    "Score unchanged this week",
    "Momentum category down 3 points after recent price consolidation",
  ],
  dataFreshnessNote: "Fundamentals from latest quarterly report; price data from last close.",
  disclaimer: DISCLAIMER,
  createdAt: new Date().toISOString(),
};

export const mockChartInsight: AiInsight = {
  id: "mock-chart-revenue",
  type: "chart",
  title: "Revenue trend",
  summary:
    "Revenue has grown steadily over the last eight quarters with only one flat period. The trend supports the Growth score but does not guarantee future results.",
  positives: [
    "Consistent quarter-over-quarter growth in six of eight periods",
    "Growth rate accelerated in the two most recent quarters",
  ],
  risks: [
    "Base effect may make year-over-year comparisons harder next quarter",
    "One quarter showed flat revenue — monitor next report",
  ],
  suggestedAction: "Watch",
  confidence: "low",
  scoreExplanation: "Chart context alone does not set action; paired with score, Watch is appropriate for valuation uncertainty.",
  dataFreshnessNote: "Chart data through last reported quarter; not real-time.",
  disclaimer: DISCLAIMER,
  createdAt: new Date().toISOString(),
};

export const mockAiInsights: AiInsight[] = [
  mockPortfolioInsight,
  mockStockInsight,
  mockChartInsight,
];
