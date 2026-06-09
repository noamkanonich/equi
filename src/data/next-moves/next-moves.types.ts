export type NextMoveType =
  | "needsAction"
  | "opportunity"
  | "risk"
  | "earnings"
  | "monitor";

export type NextMovePriority = "high" | "medium" | "low";

export type NextMoveStatus = "active" | "dismissed";

export type NextMovesTab =
  | "allActions"
  | "needsAction"
  | "opportunities"
  | "risks"
  | "earnings"
  | "dismissed";

export type NextMoveAction =
  | "reviewStock"
  | "viewAllocation"
  | "analyze"
  | "setAlert";

export type NextMoveMetricTrend = "up" | "down" | "neutral" | "warning";

export type NextMoveMetricChip = {
  id: string;
  labelKey: string;
  value: string;
  valueKey?: string;
  trend?: NextMoveMetricTrend;
};

export type NextMoveItem = {
  id: string;
  type: NextMoveType;
  priority: NextMovePriority;
  status: NextMoveStatus;
  symbol?: string;
  entityKey?: string;
  companyName?: string;
  logoUrl?: string | null;
  titleKey: string;
  descriptionKey: string;
  action: NextMoveAction;
  metrics: NextMoveMetricChip[];
};

export type PortfolioHealthLegendItem = {
  key: "great" | "good" | "watch" | "avoid";
  value: number;
};

export type PortfolioHealthSummary = {
  score: number;
  maxScore: number;
  legend: PortfolioHealthLegendItem[];
  titleKey: string;
  subtitleKey: string;
};

export type RiskFactor = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  priority: NextMovePriority;
};

export type UpcomingPortfolioEventTiming = "beforeMarket" | "afterMarket";

export type UpcomingPortfolioEvent = {
  id: string;
  symbol: string;
  companyName: string;
  logoUrl?: string | null;
  eventKey: string;
  date: string;
  timing: UpcomingPortfolioEventTiming;
};

export type NextMovesAiSummary = {
  titleKey: string;
  summaryKey: string;
  disclaimerKey: string;
};

export type NextMovesData = {
  moves: NextMoveItem[];
  portfolioHealth: PortfolioHealthSummary;
  riskFactors: RiskFactor[];
  upcomingEvents: UpcomingPortfolioEvent[];
  aiSummary: NextMovesAiSummary;
};

