import type {
  ReplacementCandidate,
  SwapSimulationState,
} from "@/data/smart-replace/smart-replace.types";

export const buildSwapSimulationFromCandidate = (
  candidate: ReplacementCandidate,
): SwapSimulationState => ({
  ...candidate.simulation,
  candidateId: candidate.id,
});

export const calculateSwapImpact = (
  candidate: ReplacementCandidate,
): SwapSimulationState => buildSwapSimulationFromCandidate(candidate);
