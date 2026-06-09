import type {
  WatchlistInsight,
  WatchlistMetric,
  WatchlistSidebarSummary,
} from "@/data/watchlist/watchlist.types";

export const emptyWatchlistSummaryMetrics: WatchlistMetric[] = [
  {
    kind: "watchedStocks",
    value: 0,
    helperKey: "metrics.thisWeek",
    helperValue: "0",
    trend: [0],
    tone: "neutral",
  },
  {
    kind: "averageOpportunityScore",
    value: 0,
    helperKey: "metrics.vsLastWeek",
    helperValue: "0%",
    trend: [0],
    tone: "neutral",
  },
  {
    kind: "inBuyZone",
    value: 0,
    helperKey: "metrics.ofWatchlist",
    helperValue: "0%",
    trend: [0],
    tone: "neutral",
  },
  {
    kind: "upcomingEarnings",
    value: 0,
    helperKey: "metrics.nextThirtyDays",
    trend: [0],
    tone: "neutral",
  },
  {
    kind: "alertsTriggered",
    value: 0,
    helperKey: "metrics.thisWeek",
    helperValue: "0",
    trend: [0],
    tone: "neutral",
  },
];

export const emptyWatchlistSidebarSummary: WatchlistSidebarSummary = {
  bestOpportunities: [],
  closestToBuyZone: [],
  upcomingEarnings: [],
  couldReplaceHolding: {
    candidateSymbol: "",
    candidateLogoUrl: null,
    holdingSymbol: "",
    summaryKey: "replaceHolding.empty",
  },
};

export const emptyWatchlistAiInsight: WatchlistInsight = {
  titleKey: "sidebar.aiInsight",
  bodyKey: "insight.emptyBody",
  disclaimerKey: "insight.disclaimer",
};
