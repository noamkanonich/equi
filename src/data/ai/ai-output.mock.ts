import type {
  AiInsightContext,
  AiInsightOutput,
  AiInsightSection,
} from "./ai-output.types";
import { AI_INSIGHT_CONTEXTS } from "./ai-output.types";

const DISCLAIMER_KEY = "ai.output.disclaimer";
const MOCK_UPDATED_AT = "2026-06-01T12:00:00.000Z";
const MOCK_SOURCE = "Equi mock data";

const sectionTitleKey = (type: AiInsightSection["type"]) =>
  `ai.output.sections.${type}`;

const contextTitleKey = (context: AiInsightContext) =>
  `ai.output.contextTitles.${context}`;

const mockDataFreshness = {
  status: "mock" as const,
  lastUpdated: MOCK_UPDATED_AT,
  source: MOCK_SOURCE,
};

const buildSections = (
  sections: Omit<AiInsightSection, "titleKey">[],
): AiInsightSection[] =>
  sections.map((section) => ({
    ...section,
    titleKey: sectionTitleKey(section.type),
  }));

export const mockDashboardAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-dashboard",
  context: "dashboard",
  titleKey: contextTitleKey("dashboard"),
  summary:
    "Your portfolio is performing well today, led by stronger momentum in NVDA and AAPL.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "Your portfolio is performing well today, led by stronger momentum in NVDA and AAPL.",
      tone: "positive",
    },
    {
      type: "whatsStrong",
      content:
        "NVDA and AAPL are the strongest contributors across score, momentum, and day change.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "TSLA may be worth reviewing because its score and near-term momentum are weaker than the rest of the portfolio.",
      tone: "warning",
    },
    {
      type: "suggestedNextStep",
      content:
        "Consider reviewing concentration in technology and confirming whether lower-scoring holdings still fit your plan.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Medium confidence based on mock scores and last-close prices.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Prices as of last market close; scores refreshed within 24 hours (mock).",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "This is decision-support information only and is not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.reviewPortfolio",
      targetRoute: "/portfolio",
      actionType: "navigate",
    },
  ],
  confidence: "medium",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockPortfolioAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-portfolio",
  context: "portfolio",
  titleKey: contextTitleKey("portfolio"),
  summary:
    "Your portfolio is up today, with strength from NVDA and AAPL offsetting weaker moves in TSLA and GOOGL.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "Your portfolio is up today, with strength from NVDA and AAPL offsetting weaker moves in TSLA and GOOGL.",
      tone: "positive",
    },
    {
      type: "whatsStrong",
      content:
        "Technology leaders are contributing most of today's gains and keeping the portfolio above its benchmark trend.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Technology concentration is elevated, so a single sector pullback may have an outsized impact.",
      tone: "warning",
    },
    {
      type: "whatChanged",
      content:
        "Portfolio value is up about 2.1% over the last 30 days; one position moved from Hold to Watch after earnings (mock).",
      tone: "neutral",
    },
    {
      type: "suggestedNextStep",
      content:
        "Consider reviewing lower-scoring holdings and confirming whether the cash balance still fits your plan.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Medium confidence — mixed scores across holdings with solid top contributors.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Mock portfolio metrics; prices as of last close, scores within 24 hours.",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "This is decision-support information only and is not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.reviewPortfolio",
      targetRoute: "/portfolio",
      actionType: "navigate",
    },
  ],
  confidence: "medium",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockStockAnalysisAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-stock-aapl",
  context: "stockAnalysis",
  titleKey: contextTitleKey("stockAnalysis"),
  summary:
    "Apple shows strong profitability and financial health scores. Valuation is above sector median, which may limit near-term upside. Momentum remains positive but is cooling.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "Apple shows strong profitability and financial health scores. Valuation is above sector median, which may limit near-term upside. Momentum remains positive but is cooling.",
      tone: "neutral",
    },
    {
      type: "whatsStrong",
      content:
        "High profitability and cash generation scores; strong brand and ecosystem stability metrics.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Valuation may be priced for growth; revenue growth has slowed versus prior years — worth monitoring.",
      tone: "warning",
    },
    {
      type: "whatChanged",
      content:
        "Score unchanged this week; momentum category down 3 points after recent price consolidation (mock).",
      tone: "neutral",
    },
    {
      type: "suggestedNextStep",
      content:
        "Based on current score, a Hold posture may fit: solid fundamentals with valuation as the main drag.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "High confidence on profitability and health; medium on near-term momentum.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Fundamentals from latest quarterly report; price data from last close (mock).",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "This is decision-support information only and is not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.viewStock",
      targetRoute: "/stocks/AAPL",
      actionType: "navigate",
    },
  ],
  confidence: "high",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockFundamentalsAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-fundamentals",
  context: "fundamentals",
  titleKey: contextTitleKey("fundamentals"),
  summary:
    "Revenue has grown steadily over the last eight quarters with only one flat period. The trend supports the growth score but does not guarantee future results.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "Revenue has grown steadily over the last eight quarters with only one flat period. The trend supports the growth score but does not guarantee future results.",
      tone: "neutral",
    },
    {
      type: "whatsStrong",
      content:
        "Consistent quarter-over-quarter growth in six of eight periods; growth rate accelerated in the two most recent quarters.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Base effect may make year-over-year comparisons harder next quarter; one flat quarter is worth monitoring.",
      tone: "warning",
    },
    {
      type: "suggestedNextStep",
      content:
        "Pair this chart context with the overall score — valuation uncertainty may still warrant a Watch posture.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Low confidence when interpreting a single metric in isolation.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Chart data through last reported quarter; not real-time (mock).",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "This is decision-support information only and is not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.reviewFundamentals",
      targetRoute: "/stocks/AAPL",
      actionType: "navigate",
    },
  ],
  confidence: "low",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockWatchlistAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-watchlist",
  context: "watchlist",
  titleKey: contextTitleKey("watchlist"),
  summary:
    "Markets look strong, but valuations are stretching in some names. Best opportunities may be in quality leaders pulling back toward buy zones.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "Markets look strong, but valuations are stretching in some names. Best opportunities may be in quality leaders pulling back toward buy zones.",
      tone: "neutral",
    },
    {
      type: "whatsStrong",
      content:
        "Several watchlist names show improving opportunity scores and constructive momentum versus last month.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Earnings week may add volatility; stretched valuations in leaders may limit upside if results disappoint.",
      tone: "warning",
    },
    {
      type: "suggestedNextStep",
      content:
        "Focus on earnings this week because volatility may create better entries for high-conviction names.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Medium confidence — watchlist scores are mock and may not reflect live market moves.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Watchlist scores and prices are mock; refresh timing is simulated.",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "Informational only. Scores and prompts support decisions; they are not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.viewWatchlist",
      targetRoute: "/watchlist",
      actionType: "navigate",
    },
  ],
  confidence: "medium",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockSmartReplaceAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-smart-replace",
  context: "smartReplace",
  titleKey: contextTitleKey("smartReplace"),
  summary:
    "AVGO may offer stronger profitability and more consistent execution than TSLA, while still providing exposure to secular growth themes like AI infrastructure.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "AVGO may offer stronger profitability and more consistent execution than TSLA, while still providing exposure to secular growth themes like AI infrastructure.",
      tone: "neutral",
    },
    {
      type: "whatsStrong",
      content:
        "Replacement candidate shows higher profitability and stability scores versus the weak position in this mock scenario.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Sector concentration and swap impact on portfolio weights should be reviewed before any real decision.",
      tone: "warning",
    },
    {
      type: "suggestedNextStep",
      content:
        "Use Simulate Swap to preview score and risk assumptions — this does not change your portfolio.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Medium confidence — comparison uses mock scores and estimated weights only.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Smart Replace uses mock holdings, scores, and swap estimates.",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content: "Informational only, not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.openSmartReplace",
      targetRoute: "/smart-replace",
      actionType: "navigate",
    },
  ],
  confidence: "medium",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockNextMovesAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-next-moves",
  context: "nextMoves",
  titleKey: contextTitleKey("nextMoves"),
  summary:
    "Your portfolio is performing well overall. Consider reviewing technology exposure and the TSLA position. Strong opportunities may appear in NVDA and MSFT.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "Your portfolio is performing well overall. Consider reviewing technology exposure and the TSLA position. Strong opportunities may appear in NVDA and MSFT.",
      tone: "neutral",
    },
    {
      type: "whatsStrong",
      content:
        "Portfolio health metrics are stable with several opportunity-type moves surfaced for review.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Risk-type moves include concentration and a weaker-scoring position that may deserve attention.",
      tone: "warning",
    },
    {
      type: "suggestedNextStep",
      content:
        "Prioritize Needs Action and Risk tabs to address items that may affect portfolio quality first.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Medium confidence based on mock move priorities and scores.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Next Moves cards and summary use mock portfolio events and scores.",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "This is decision-support information only and is not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.viewNextMoves",
      targetRoute: "/next-moves",
      actionType: "navigate",
    },
  ],
  confidence: "medium",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockAlertsAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-alerts",
  context: "alerts",
  titleKey: contextTitleKey("alerts"),
  summary:
    "This alert fired because AAPL crossed below your mock price threshold. The move may be worth monitoring alongside score and momentum context.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "This alert fired because AAPL crossed below your mock price threshold. The move may be worth monitoring alongside score and momentum context.",
      tone: "neutral",
    },
    {
      type: "whatsStrong",
      content:
        "Underlying profitability and health scores remain solid in the mock stock profile.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Short-term price pressure may continue if momentum stays soft; alert does not imply you must trade.",
      tone: "warning",
    },
    {
      type: "whatChanged",
      content: "Price alert triggered today; score unchanged in the last week (mock).",
      tone: "neutral",
    },
    {
      type: "suggestedNextStep",
      content:
        "Consider reviewing the stock analysis page and whether the alert rule still matches your plan.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Medium confidence — alert context is mock and not linked to live feeds.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Alert trigger time and prices are simulated mock data.",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "This is decision-support information only and is not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [
    {
      labelKey: "ai.output.actions.viewAlerts",
      targetRoute: "/alerts",
      actionType: "navigate",
    },
    {
      labelKey: "ai.output.actions.viewStock",
      targetRoute: "/stocks/AAPL",
      actionType: "navigate",
    },
  ],
  confidence: "medium",
  riskLevel: "medium",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockSettingsPreviewAiInsightOutput: AiInsightOutput = {
  id: "mock-ai-settings-preview",
  context: "settingsPreview",
  titleKey: contextTitleKey("settingsPreview"),
  summary:
    "Based on your balanced tone and balanced detail level, Equi would surface a concise summary, key strengths, risks, and a suggested next step with confidence and data freshness notes.",
  sections: buildSections([
    {
      type: "summary",
      content:
        "Based on your balanced tone and balanced detail level, Equi would surface a concise summary, key strengths, risks, and a suggested next step with confidence and data freshness notes.",
      tone: "neutral",
    },
    {
      type: "whatsStrong",
      content:
        "Example strength: top holdings show solid profitability scores on average in this mock portfolio.",
      tone: "positive",
    },
    {
      type: "riskToWatch",
      content:
        "Example risk: sector concentration may increase volatility if a single sector corrects.",
      tone: "warning",
    },
    {
      type: "suggestedNextStep",
      content:
        "Example next step: consider reviewing Watch-rated names and confirming they still fit your plan.",
      tone: "neutral",
    },
    {
      type: "confidence",
      content: "Preview shows medium confidence when confidence visibility is enabled.",
      tone: "neutral",
    },
    {
      type: "dataFreshness",
      content: "Preview uses mock freshness labels; live data is not connected.",
      tone: "neutral",
    },
    {
      type: "disclaimer",
      content:
        "This is decision-support information only and is not financial advice.",
      tone: "neutral",
    },
  ]),
  suggestedActions: [],
  confidence: "medium",
  riskLevel: "low",
  dataFreshness: mockDataFreshness,
  disclaimerKey: DISCLAIMER_KEY,
};

export const mockAiInsightOutputsByContext: Record<
  AiInsightContext,
  AiInsightOutput
> = {
  dashboard: mockDashboardAiInsightOutput,
  portfolio: mockPortfolioAiInsightOutput,
  stockAnalysis: mockStockAnalysisAiInsightOutput,
  fundamentals: mockFundamentalsAiInsightOutput,
  watchlist: mockWatchlistAiInsightOutput,
  smartReplace: mockSmartReplaceAiInsightOutput,
  nextMoves: mockNextMovesAiInsightOutput,
  alerts: mockAlertsAiInsightOutput,
  settingsPreview: mockSettingsPreviewAiInsightOutput,
};

export const mockAiInsightOutputs: AiInsightOutput[] = AI_INSIGHT_CONTEXTS.map(
  (context) => mockAiInsightOutputsByContext[context],
);
