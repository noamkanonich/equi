"use client";

import { Activity, CircleGauge, Layers3 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";
import styled, { css } from "styled-components";
import type { RiskFactor } from "@/data/next-moves/next-moves.types";
import { getNextMovePriorityTone } from "@/utils/next-moves/getNextMoveStatusColor";

type TopRiskFactorsCardProps = {
  riskFactors: RiskFactor[];
};

const riskIcons = [Layers3, Activity, CircleGauge];

export const TopRiskFactorsCard = ({ riskFactors }: TopRiskFactorsCardProps) => {
  const t = useTranslations("nextMoves");
  const tCommon = useTranslations("common");
  const tInteractions = useTranslations("interactions");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <Card>
      <Header>
        <Title>{t("cards.riskFactors.title")}</Title>
        <ViewButton type="button" onClick={() => setIsOpen(true)}>
          {t("actions.viewAll")}
        </ViewButton>
      </Header>
      <List>
        {riskFactors.map((riskFactor, index) => {
          const Icon = riskIcons[index % riskIcons.length];
          const tone = getNextMovePriorityTone(riskFactor.priority);

          return (
            <RiskRow key={riskFactor.id}>
              <IconWrap $tone={tone}>
                <Icon size={15} strokeWidth={1.9} aria-hidden />
              </IconWrap>
              <RiskText>
                <RiskTitle>{t(riskFactor.titleKey)}</RiskTitle>
                <RiskDescription>{t(riskFactor.descriptionKey)}</RiskDescription>
              </RiskText>
              <PriorityBadge $tone={tone}>
                {tCommon(riskFactor.priority)}
              </PriorityBadge>
            </RiskRow>
          );
        })}
      </List>
    </Card>

    <PlaceholderModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={tInteractions("features.riskFactorsTitle")}
      description={tInteractions("features.riskFactorsDescription")}
    />
    </>
  );
};

const toneStyles = {
  negative: css`
    color: ${({ theme }) => theme.colors.status.negative};
    background: ${({ theme }) => theme.colors.status.negativeSoft};
  `,
  warning: css`
    color: ${({ theme }) => theme.colors.status.warning};
    background: ${({ theme }) => theme.colors.status.warningSoft};
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.status.neutral};
    background: ${({ theme }) => theme.colors.status.neutralSoft};
  `,
  positive: css`
    color: ${({ theme }) => theme.colors.status.positive};
    background: ${({ theme }) => theme.colors.status.positiveSoft};
  `,
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-block-end: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const ViewButton = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RiskRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrap = styled.span<{ $tone: keyof typeof toneStyles }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ $tone }) => toneStyles[$tone]}
`;

const RiskText = styled.div`
  min-inline-size: 0;
`;

const RiskTitle = styled.h3`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RiskDescription = styled.p`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PriorityBadge = styled.span<{ $tone: keyof typeof toneStyles }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  ${({ $tone }) => toneStyles[$tone]}
`;
