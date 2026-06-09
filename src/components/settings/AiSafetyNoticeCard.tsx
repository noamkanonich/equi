"use client";

import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";

export const AiSafetyNoticeCard = () => {
  const t = useTranslations("settings.aiPreferences.safety");

  return (
    <StyledCard $padding="md">
      <IconWrap aria-hidden>
        <Shield size={20} strokeWidth={1.9} />
      </IconWrap>
      <Copy>
        <Title>{t("title")}</Title>
        <Description>{t("description")}</Description>
      </Copy>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
  border-color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 18%,
    ${({ theme }) => theme.colors.border.subtle}
  );
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.brand.primarySoft} 0%,
    ${({ theme }) => theme.colors.status.warningSoft} 100%
  );
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
  background: ${({ theme }) => theme.colors.background.card};
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
