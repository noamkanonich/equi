"use client";

import { Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";

export const SettingsComingSoon = () => {
  const t = useTranslations("settings.tabs");

  return (
    <PlaceholderCard $padding="lg">
      <IconWrap aria-hidden>
        <Clock3 size={24} strokeWidth={1.75} />
      </IconWrap>
      <Title>{t("comingSoonTitle")}</Title>
      <Description>{t("comingSoonDescription")}</Description>
    </PlaceholderCard>
  );
};

const PlaceholderCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-block-size: 16rem;
  text-align: center;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.colors.text.muted};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.sectionTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.sectionTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.sectionTitle.lineHeight};
`;

const Description = styled.p`
  max-inline-size: 24rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
