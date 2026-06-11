import type { NextMovesData } from "@/data/next-moves/next-moves.types";
import { nextMovesMockData } from "@/data/next-moves/next-moves.mock";

export const emptyNextMovesData: NextMovesData = {
  moves: [],
  portfolioHealth: {
    score: 0,
    maxScore: 100,
    titleKey: "nextMoves.cards.portfolioHealth.overallHealthy",
    subtitleKey: "nextMoves.guidanceEmpty.subtitle",
    legend: [
      { key: "great", value: 0 },
      { key: "good", value: 0 },
      { key: "watch", value: 0 },
      { key: "avoid", value: 0 },
    ],
  },
  riskFactors: [],
  upcomingEvents: [],
  aiSummary: {
    titleKey: "nextMoves.cards.aiSummary.title",
    summaryKey: "nextMoves.guidanceEmpty.summary",
    disclaimerKey: "nextMoves.cards.aiSummary.disclaimer",
  },
};

export const getDemoNextMovesData = (): NextMovesData => nextMovesMockData;
