import type { ScoreStatus } from "@/data/scoring/scoring.types";

const STATUS_LABEL_KEYS: Record<ScoreStatus, string> = {
  veryStrong: "scoring.status.veryStrong",
  strong: "scoring.status.strong",
  average: "scoring.status.average",
  weak: "scoring.status.weak",
  veryWeak: "scoring.status.veryWeak",
};

export const getScoreLabelKey = (status: ScoreStatus): string =>
  STATUS_LABEL_KEYS[status];
