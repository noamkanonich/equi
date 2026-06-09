"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/states/EmptyState";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { StockLogo } from "@/components/ui/StockLogo";
import type { WeakPosition } from "@/data/smart-replace/smart-replace.types";
import { mapScoreToTone } from "@/utils/scoring/mappers";

type SmartReplaceOtherWeakPositionsCardProps = {
  positions: WeakPosition[];
  onReviewPosition?: (positionId: string) => void;
};

export const SmartReplaceOtherWeakPositionsCard = ({
  positions,
  onReviewPosition,
}: SmartReplaceOtherWeakPositionsCardProps) => {
  const t = useTranslations("smartReplace");
  const tStates = useTranslations("states");

  if (positions.length === 0) {
    return (
      <Card>
        <EmptyState
          title={tStates("empty.title")}
          description={t("sidebar.otherWeakPositions")}
          $compact
        />
      </Card>
    );
  }

  return (
    <Card>
      <Title>{t("sidebar.otherWeakPositions")}</Title>
      <List>
        {positions.map((position) => {
          const scoreTone = mapScoreToTone(position.score);
          const badgeTone = scoreTone === "neutral" ? "warning" : scoreTone;

          return (
            <Row key={position.id}>
              <Identity>
                <StockLogo
                  symbol={position.symbol}
                  companyName={position.companyName}
                  logoUrl={position.logoUrl}
                  size="sm"
                />
                <Copy>
                  <Symbol dir="ltr">{position.symbol}</Symbol>
                  <Company>{position.companyName}</Company>
                </Copy>
              </Identity>
              <ScoreBadge score={position.score} $tone={badgeTone} />
              <Button
                $variant="secondary"
                $size="sm"
                onClick={() => onReviewPosition?.(position.id)}
              >
                {t("actions.review")}
              </Button>
            </Row>
          );
        })}
      </List>
    </Card>
  );
};

const Card = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-block: ${({ theme }) => theme.spacing.sm};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const Identity = styled.div`
  min-inline-size: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Copy = styled.div`
  min-inline-size: 0;
`;

const Symbol = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Company = styled.span`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;
