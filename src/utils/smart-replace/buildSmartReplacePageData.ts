import type { CurrencyCode } from "@/data/currencies/currency.types";
import type { EnrichedPortfolioHolding, PortfolioAllocationKey } from "@/data/portfolio/portfolio.types";
import { smartReplaceMockData } from "@/data/smart-replace/smart-replace.mock";
import type {
  ReplacementCandidate,
  SmartReplaceData,
  SmartReplaceSummaryMetric,
  SwapImpactMetric,
  WeakPosition,
} from "@/data/smart-replace/smart-replace.types";
import type { EnrichedWatchlistItem } from "@/data/watchlist/watchlist.types";
import type { SuggestedAction } from "@/data/scoring/scoring.types";
import { getSuggestedCompetitors } from "@/utils/stocks/getSuggestedCompetitors";
import { getSuggestedAction } from "@/utils/scoring/getSuggestedAction";

const WEAK_ACTIONS = new Set<SuggestedAction>(["reduce", "avoid", "watch"]);
const WEAK_SCORE_THRESHOLD = 55;

const mapSectorKey = (sector: PortfolioAllocationKey): string =>
  `smartReplace.sectors.${sector}`;

const buildConcerns = (holding: EnrichedPortfolioHolding): string[] => {
  const concerns: string[] = [];

  if (holding.score < 45) {
    concerns.push("smartReplace.concerns.weakMomentum");
  }
  if (holding.totalGainLossPercent < -5) {
    concerns.push("smartReplace.concerns.highVolatility");
  }
  if (holding.score < 55) {
    concerns.push("smartReplace.concerns.premiumValuation");
  }

  return concerns.length > 0 ? concerns : ["smartReplace.concerns.weakMomentum"];
};

const mapHoldingToWeakPosition = (
  holding: EnrichedPortfolioHolding,
): WeakPosition => ({
  id: holding.id,
  symbol: holding.symbol,
  companyName: holding.companyName,
  logoUrl: holding.logoUrl,
  sectorKey: mapSectorKey(holding.sector),
  score: holding.score,
  suggestedAction: getSuggestedAction(holding.score),
  currentWeightPercent: holding.weightPercent,
  avgCost: holding.averageCost,
  marketValue: holding.marketValue,
  currency: holding.purchaseCurrency,
  unrealizedPlPercent: holding.totalGainLossPercent,
  concerns: buildConcerns(holding),
});

const isWeakPosition = (holding: EnrichedPortfolioHolding): boolean => {
  const action = getSuggestedAction(holding.score);
  return WEAK_ACTIONS.has(action) && holding.score <= WEAK_SCORE_THRESHOLD;
};

const buildSwapMetrics = (
  weakScore: number,
  candidateScore: number,
  weakWeight: number,
): SwapImpactMetric[] => {
  const scoreDelta = Math.max(0, candidateScore - weakScore);

  return [
    {
      key: "portfolioScore",
      before: weakScore,
      after: Math.min(100, weakScore + scoreDelta),
      unit: "points",
      decimals: 0,
    },
    {
      key: "technologyExposure",
      before: weakWeight,
      after: weakWeight,
      unit: "percent",
      decimals: 1,
    },
    {
      key: "expectedUpside",
      before: Math.max(0, 100 - weakScore) * 0.15,
      after: Math.max(0, 100 - candidateScore) * 0.15 + scoreDelta * 0.2,
      unit: "percent",
      decimals: 1,
    },
    {
      key: "annualizedReturnEstimate",
      before: 8,
      after: 8 + scoreDelta * 0.15,
      unit: "percent",
      decimals: 1,
    },
    {
      key: "riskScore",
      before: 1.3,
      after: 1.2,
      unit: "beta",
      decimals: 2,
      lowerIsBetter: true,
    },
  ];
};

const mapWatchlistToCandidate = (
  item: EnrichedWatchlistItem,
  weakPosition: WeakPosition,
  index: number,
): ReplacementCandidate => {
  const score = item.opportunityScore;
  const simulationMetrics = buildSwapMetrics(
    weakPosition.score,
    score,
    weakPosition.currentWeightPercent,
  );

  return {
    id: `watchlist-${item.id}`,
    symbol: item.symbol,
    companyName: item.companyName,
    logoUrl: item.logoUrl,
    sectorKey: mapSectorKey("technology"),
    matchType: index === 0 ? "qualityUpgrade" : "sameSector",
    score,
    upsidePercent: Math.max(5, (100 - score) * 0.2),
    beta: 1.1,
    keyReasonKey: "smartReplace.reasons.strongAiExposure",
    action: index === 0 ? "bestMatch" : "consider",
    estimatedWeightPercent: weakPosition.currentWeightPercent,
    currentPrice: item.currentPrice,
    currency: item.currency,
    analystConsensusKey: "smartReplace.consensus.buy",
    positives: [
      "smartReplace.positives.higherProfitability",
      "smartReplace.positives.betterRiskReward",
    ],
    simulation: {
      candidateId: `watchlist-${item.id}`,
      metrics: simulationMetrics,
    },
  };
};

const buildSummaryMetrics = (
  weakCount: number,
  candidateCount: number,
): SmartReplaceSummaryMetric[] => [
  {
    kind: "positionsToReview",
    value: weakCount,
    unit: "count",
    helperKey: "smartReplace.metrics.helpers.needsAttention",
    tone: weakCount > 0 ? "negative" : "neutral",
    trend: [],
  },
  {
    kind: "bestReplacementMatches",
    value: candidateCount,
    unit: "count",
    helperKey: "smartReplace.metrics.helpers.highQualityOptions",
    tone: candidateCount > 0 ? "positive" : "neutral",
    trend: [],
  },
  {
    kind: "potentialScoreImprovement",
    value: candidateCount > 0 ? 12 : 0,
    unit: "points",
    helperKey: "smartReplace.metrics.helpers.averageImprovement",
    tone: "neutral",
    trend: [],
  },
  {
    kind: "estimatedUpsideDifference",
    value: candidateCount > 0 ? 8 : 0,
    unit: "percent",
    helperKey: "smartReplace.metrics.helpers.averageUpsideLift",
    tone: "neutral",
    trend: [],
  },
];

const buildEmptySmartReplaceData = (): SmartReplaceData => ({
  summaryMetrics: buildSummaryMetrics(0, 0),
  weakPositions: [],
  defaultWeakPositionId: "",
  replacementCandidates: [],
  defaultReplacementCandidateId: "",
  recommendationReasons: [],
  otherWeakPositions: [],
  upgradeDowngradeSignals: [],
  aiNote: {
    bodyKey: "smartReplace.aiNote.body",
    disclaimerKey: "smartReplace.aiNote.disclaimer",
  },
});

export type BuildSmartReplacePageDataInput = {
  enrichedPortfolioHoldings: EnrichedPortfolioHolding[];
  enrichedWatchlistItems: EnrichedWatchlistItem[];
  isUsingDemoPortfolio: boolean;
};

export type BuildSmartReplacePageDataResult = SmartReplaceData & {
  isEmpty: boolean;
  emptyReason: "noHoldings" | "noWeakPositions" | null;
};

export const buildSmartReplacePageData = ({
  enrichedPortfolioHoldings,
  enrichedWatchlistItems,
  isUsingDemoPortfolio,
}: BuildSmartReplacePageDataInput): BuildSmartReplacePageDataResult => {
  if (isUsingDemoPortfolio) {
    return {
      ...smartReplaceMockData,
      isEmpty: false,
      emptyReason: null,
    };
  }

  if (enrichedPortfolioHoldings.length === 0) {
    return {
      ...buildEmptySmartReplaceData(),
      isEmpty: true,
      emptyReason: "noHoldings",
    };
  }

  const weakHoldings = enrichedPortfolioHoldings.filter(isWeakPosition);

  if (weakHoldings.length === 0) {
    return {
      ...buildEmptySmartReplaceData(),
      isEmpty: true,
      emptyReason: "noWeakPositions",
    };
  }

  const weakPositions = weakHoldings.map(mapHoldingToWeakPosition);
  const primaryWeak = weakPositions[0];
  const otherWeakPositions = weakPositions.slice(1);
  const portfolioSymbols = new Set(
    enrichedPortfolioHoldings.map((holding) => holding.symbol),
  );

  const watchlistCandidates = enrichedWatchlistItems
    .filter((item) => !portfolioSymbols.has(item.symbol))
    .sort((left, right) => right.opportunityScore - left.opportunityScore)
    .slice(0, 4)
    .map((item, index) => mapWatchlistToCandidate(item, primaryWeak, index));

  const competitorSymbols = getSuggestedCompetitors(primaryWeak.symbol)
    .filter((symbol) => !portfolioSymbols.has(symbol))
    .slice(0, 2);

  const competitorCandidates: ReplacementCandidate[] = competitorSymbols.map(
    (symbol, index) => {
      const candidateScore = Math.min(95, primaryWeak.score + 25 + index * 3);
      const id = `competitor-${symbol.toLowerCase()}`;

      return {
        id,
        symbol,
        companyName: symbol,
        logoUrl: null,
        sectorKey: primaryWeak.sectorKey,
        matchType: "similarBusiness",
        score: candidateScore,
        upsidePercent: 14,
        beta: 1.15,
        keyReasonKey: "smartReplace.reasons.aiDemandImproving",
        action: watchlistCandidates.length === 0 && index === 0 ? "bestMatch" : "watch",
        estimatedWeightPercent: primaryWeak.currentWeightPercent,
        currentPrice: 0,
        currency: primaryWeak.currency as CurrencyCode,
        analystConsensusKey: "smartReplace.consensus.buy",
        positives: ["smartReplace.positives.aiInfrastructureExposure"],
        simulation: {
          candidateId: id,
          metrics: buildSwapMetrics(
            primaryWeak.score,
            candidateScore,
            primaryWeak.currentWeightPercent,
          ),
        },
      };
    },
  );

  const replacementCandidates = [...watchlistCandidates, ...competitorCandidates].slice(
    0,
    6,
  );

  return {
    summaryMetrics: buildSummaryMetrics(
      weakPositions.length,
      replacementCandidates.length,
    ),
    weakPositions: [primaryWeak],
    defaultWeakPositionId: primaryWeak.id,
    replacementCandidates,
    defaultReplacementCandidateId: replacementCandidates[0]?.id ?? "",
    recommendationReasons: smartReplaceMockData.recommendationReasons,
    otherWeakPositions,
    upgradeDowngradeSignals: [],
    aiNote: smartReplaceMockData.aiNote,
    isEmpty: false,
    emptyReason: null,
  };
};
