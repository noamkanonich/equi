"use client";

import styled from "styled-components";
import type {
  RecommendationReason,
  SmartReplaceAiNote,
  SwapImpactMetric,
} from "@/data/smart-replace/smart-replace.types";
import { SmartReplaceAiNoteCard } from "./SmartReplaceAiNoteCard";
import { SmartReplaceHowItWorksCard } from "./SmartReplaceHowItWorksCard";
import { SmartReplaceImpactCard } from "./SmartReplaceImpactCard";
import { SmartReplaceReasonsCard } from "./SmartReplaceReasonsCard";

type SmartReplaceSidebarProps = {
  reasons: RecommendationReason[];
  impactMetrics: SwapImpactMetric[];
  aiNote: SmartReplaceAiNote;
  locale: string;
  isPreviewActive: boolean;
  replayKey: number;
};

export const SmartReplaceSidebar = ({
  reasons,
  impactMetrics,
  aiNote,
  locale,
  isPreviewActive,
  replayKey,
}: SmartReplaceSidebarProps) => {
  return (
    <Sidebar>
      <SmartReplaceReasonsCard reasons={reasons} />
      <SmartReplaceImpactCard
        metrics={impactMetrics}
        locale={locale}
        isPreviewActive={isPreviewActive}
        replayKey={replayKey}
      />
      <SmartReplaceAiNoteCard note={aiNote} />
      <SmartReplaceHowItWorksCard />
    </Sidebar>
  );
};

const Sidebar = styled.aside`
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;
