import { mapHoldingsToAllocation, mapHoldingsToView } from "@/data/portfolio/mappers";
import type { EnrichedPortfolioHolding, PortfolioSummary } from "@/data/portfolio/portfolio.types";
import type { StockProviderDataBundle } from "@/data/financial-data/financial-data.types";
import { emptyNextMovesData } from "@/data/next-moves/empty-next-moves-data";
import { nextMovesMockData } from "@/data/next-moves/next-moves.mock";
import type {
  NextMoveItem,
  NextMovePriority,
  NextMovesData,
  PortfolioHealthLegendItem,
  UpcomingPortfolioEvent,
} from "@/data/next-moves/next-moves.types";
import type { SuggestedAction } from "@/data/scoring/scoring.types";
import { getSuggestedAction } from "@/utils/scoring/getSuggestedAction";

const ACTION_TO_MOVE_TYPE: Record<
  SuggestedAction,
  NextMoveItem["type"]
> = {
  buyMore: "opportunity",
  hold: "monitor",
  watch: "monitor",
  reduce: "needsAction",
  avoid: "needsAction",
};

const scoreToPriority = (score: number): NextMovePriority => {
  if (score < 45) return "high";
  if (score < 60) return "medium";
  return "low";
};

const buildHealthLegend = (
  holdings: EnrichedPortfolioHolding[],
): PortfolioHealthLegendItem[] => {
  const buckets = { great: 0, good: 0, watch: 0, avoid: 0 };

  for (const holding of holdings) {
    const action = getSuggestedAction(holding.score);
    if (action === "buyMore") buckets.great += 1;
    else if (action === "hold") buckets.good += 1;
    else if (action === "watch") buckets.watch += 1;
    else buckets.avoid += 1;
  }

  return [
    { key: "great", value: buckets.great },
    { key: "good", value: buckets.good },
    { key: "watch", value: buckets.watch },
    { key: "avoid", value: buckets.avoid },
  ];
};

const buildMoveFromHolding = (holding: EnrichedPortfolioHolding): NextMoveItem => {
  const action = getSuggestedAction(holding.score);
  const moveType = ACTION_TO_MOVE_TYPE[action];

  return {
    id: `holding-${holding.id}`,
    type: moveType,
    priority: scoreToPriority(holding.score),
    status: "active",
    symbol: holding.symbol,
    companyName: holding.companyName,
    logoUrl: holding.logoUrl,
    titleKey:
      moveType === "needsAction"
        ? "nextMoves.derived.review.title"
        : "nextMoves.derived.monitor.title",
    descriptionKey:
      moveType === "needsAction"
        ? "nextMoves.derived.review.description"
        : "nextMoves.derived.monitor.description",
    action: moveType === "needsAction" ? "reviewStock" : "analyze",
    metrics: [
      {
        id: "score",
        labelKey: "nextMoves.metrics.score",
        value: `${holding.score}/100`,
        trend: holding.score >= 60 ? "up" : holding.score >= 45 ? "warning" : "down",
      },
      {
        id: "weight",
        labelKey: "nextMoves.metrics.positionSize",
        value: `${holding.weightPercent.toFixed(1)}%`,
        trend: "neutral",
      },
    ],
  };
};

const buildSectorRebalanceMove = (
  summary: PortfolioSummary,
  holdings: EnrichedPortfolioHolding[],
): NextMoveItem | null => {
  const holdingViews = mapHoldingsToView(holdings, summary.totalValue);
  const allocation = mapHoldingsToAllocation(holdingViews, summary);
  const overweight = allocation
    .filter((segment) => segment.key !== "cash")
    .sort((left, right) => right.value - left.value)[0];

  if (!overweight || overweight.value <= 50) {
    return null;
  }

  return {
    id: "rebalance-sector",
    type: "risk",
    priority: overweight.value >= 60 ? "high" : "medium",
    status: "active",
    entityKey: "nextMoves.entities.portfolio",
    titleKey: "nextMoves.derived.rebalance.title",
    descriptionKey: "nextMoves.derived.rebalance.description",
    action: "viewAllocation",
    metrics: [
      {
        id: "current",
        labelKey: "nextMoves.metrics.current",
        value: `${overweight.value.toFixed(0)}%`,
        trend: "warning",
      },
      {
        id: "targetMax",
        labelKey: "nextMoves.metrics.targetMax",
        value: "50%",
        trend: "neutral",
      },
      {
        id: "deviation",
        labelKey: "nextMoves.metrics.deviation",
        value: `+${Math.max(0, overweight.value - 50).toFixed(0)}%`,
        trend: "warning",
      },
    ],
  };
};

const buildUpcomingEvents = (
  holdings: EnrichedPortfolioHolding[],
  stockDataBySymbol: Record<string, StockProviderDataBundle>,
): UpcomingPortfolioEvent[] => {
  const events: UpcomingPortfolioEvent[] = [];

  for (const holding of holdings) {
    const earnings = stockDataBySymbol[holding.symbol]?.earnings?.[0];
    if (!earnings?.date) {
      continue;
    }

    events.push({
      id: `earnings-${holding.id}`,
      symbol: holding.symbol,
      companyName: holding.companyName,
      logoUrl: holding.logoUrl,
      eventKey: "nextMoves.cards.events.earningsCall",
      date: earnings.date,
      timing: "afterMarket",
    });
  }

  return events.slice(0, 5);
};

export type BuildNextMovesPageDataInput = {
  enrichedPortfolioHoldings: EnrichedPortfolioHolding[];
  portfolioSummary: PortfolioSummary;
  stockDataBySymbol: Record<string, StockProviderDataBundle>;
  dismissedNextMoveIds: string[];
  isUsingDemoPortfolio: boolean;
};

export const buildNextMovesPageData = ({
  enrichedPortfolioHoldings,
  portfolioSummary,
  stockDataBySymbol,
  dismissedNextMoveIds,
  isUsingDemoPortfolio,
}: BuildNextMovesPageDataInput): NextMovesData => {
  if (isUsingDemoPortfolio) {
    return nextMovesMockData;
  }

  if (enrichedPortfolioHoldings.length === 0) {
    return emptyNextMovesData;
  }

  const holdingMoves = enrichedPortfolioHoldings
    .filter((holding) => {
      const action = getSuggestedAction(holding.score);
      return action !== "hold" && action !== "buyMore";
    })
    .map(buildMoveFromHolding);

  const rebalanceMove = buildSectorRebalanceMove(
    portfolioSummary,
    enrichedPortfolioHoldings,
  );

  const moves = [
    ...holdingMoves,
    ...(rebalanceMove ? [rebalanceMove] : []),
  ].filter((move) => !dismissedNextMoveIds.includes(move.id));

  const averageScore =
    enrichedPortfolioHoldings.reduce((sum, holding) => sum + holding.score, 0) /
    enrichedPortfolioHoldings.length;

  return {
    moves,
    portfolioHealth: {
      score: Math.round(averageScore),
      maxScore: 100,
      titleKey: "nextMoves.cards.portfolioHealth.overallHealthy",
      subtitleKey: "nextMoves.cards.portfolioHealth.monitorRisks",
      legend: buildHealthLegend(enrichedPortfolioHoldings),
    },
    riskFactors: rebalanceMove
      ? [
          {
            id: "sector-concentration",
            titleKey: "nextMoves.cards.riskFactors.highConcentration",
            descriptionKey: "nextMoves.cards.riskFactors.highConcentrationDetail",
            priority: "high",
          },
        ]
      : [],
    upcomingEvents: buildUpcomingEvents(
      enrichedPortfolioHoldings,
      stockDataBySymbol,
    ),
    aiSummary: {
      titleKey: "nextMoves.cards.aiSummary.title",
      summaryKey: "nextMoves.guidanceEmpty.summary",
      disclaimerKey: "nextMoves.cards.aiSummary.disclaimer",
    },
  };
};
