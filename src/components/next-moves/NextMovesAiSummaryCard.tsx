"use client";

import { Sparkles } from "lucide-react";
import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import styled from "styled-components";
import type { NextMovesAiSummary } from "@/data/next-moves/next-moves.types";

type NextMovesAiSummaryCardProps = {
  summary: NextMovesAiSummary;
};

export const NextMovesAiSummaryCard = ({ summary }: NextMovesAiSummaryCardProps) => {
  const t = useTranslations("nextMoves");
  const tInteractions = useTranslations("interactions");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <Card>
      <Header>
        <IconWrap aria-hidden>
          <Sparkles size={16} strokeWidth={1.9} />
        </IconWrap>
        <Title>{t(summary.titleKey)}</Title>
      </Header>
      <Summary>{t(summary.summaryKey)}</Summary>
      <Disclaimer>{t(summary.disclaimerKey)}</Disclaimer>
      <ActionButton type="button" onClick={() => setIsOpen(true)}>
        {t("actions.viewFullAiAnalysis")}
        <DirectionalChevron />
      </ActionButton>
    </Card>

    <PlaceholderModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={tInteractions("features.aiAnalysisTitle")}
      description={tInteractions("features.aiAnalysisDescription")}
    />
    </>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 7%, transparent),
      transparent 58%
    ),
    ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const Summary = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Disclaimer = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  margin-block-start: ${({ theme }) => theme.spacing.lg};
  min-block-size: 2.65rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.brand.primary};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

