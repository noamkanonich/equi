"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { Card } from "@/components/ui/Card";
import { scoringRanges } from "@/data/settings/settings.mock";
import type { ScoringRangeTone } from "@/data/settings/settings.types";

const rangeDotTone = {
  positive: css`
    background: ${({ theme }) => theme.colors.status.positive};
  `,
  positiveSoft: css`
    background: ${({ theme }) => theme.colors.status.positive};
    opacity: 0.65;
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.status.warning};
  `,
  warningSoft: css`
    background: ${({ theme }) => theme.colors.status.warning};
    opacity: 0.65;
  `,
  negative: css`
    background: ${({ theme }) => theme.colors.status.negative};
  `,
};

export const ScoringModelAboutCard = () => {
  const t = useTranslations("settings.scoringModel.about");

  return (
    <StyledCard $padding="md">
      <Header>
        <IconWrap aria-hidden>
          <Info size={18} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Title>{t("title")}</Title>
          <Description>{t("description")}</Description>
          <RangeDescription>{t("rangeDescription")}</RangeDescription>
        </Copy>
      </Header>
      <BandList>
        {scoringRanges.map((range) => (
          <BandRow key={range.key}>
            <BandDot $tone={range.tone} aria-hidden />
            <BandLabel>{t(`bands.${range.key}`)}</BandLabel>
          </BandRow>
        ))}
      </BandList>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Copy = styled.div`
  min-inline-size: 0;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Description = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const RangeDescription = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const BandList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const BandRow = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BandDot = styled.span<{ $tone: ScoringRangeTone }>`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  ${({ $tone }) => rangeDotTone[$tone]}
`;

const BandLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
