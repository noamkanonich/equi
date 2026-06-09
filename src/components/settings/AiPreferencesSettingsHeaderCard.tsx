"use client";

import { Eye, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AiPreferencesSettingsHeaderCardProps = {
  onPreview: () => void;
};

export const AiPreferencesSettingsHeaderCard = ({
  onPreview,
}: AiPreferencesSettingsHeaderCardProps) => {
  const t = useTranslations("settings.aiPreferences.header");

  return (
    <StyledCard $padding="md">
      <Row>
        <TitleGroup>
          <IconWrap aria-hidden>
            <Sparkles size={20} strokeWidth={1.9} />
          </IconWrap>
          <Copy>
            <Title>{t("title")}</Title>
            <Description>{t("description")}</Description>
          </Copy>
        </TitleGroup>
        <Button $variant="secondary" onClick={onPreview}>
          <Eye size={16} strokeWidth={1.9} aria-hidden />
          {t("previewAiResponse")}
        </Button>
      </Row>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
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
