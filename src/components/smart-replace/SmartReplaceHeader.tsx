"use client";

import { ArrowLeftRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

export const SmartReplaceHeader = () => {
  const t = useTranslations("smartReplace");

  return (
    <Header>
      <TitleGroup>
        <IconWrap aria-hidden>
          <ArrowLeftRight size={20} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Eyebrow>
            <Sparkles size={14} strokeWidth={1.9} aria-hidden />
            {t("eyebrow")}
          </Eyebrow>
          <Title>{t("title")}</Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Copy>
      </TitleGroup>
      <PreviewPill>{t("main.previewOnly")}</PreviewPill>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TitleGroup = styled.div`
  min-inline-size: 0;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrap = styled.span`
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 14%, transparent),
      color-mix(in srgb, ${({ theme }) => theme.colors.chart.green} 10%, transparent)
    ),
    ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Copy = styled.div`
  min-inline-size: 0;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin-block-end: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  letter-spacing: -0.04em;
`;

const Subtitle = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const PreviewPill = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.status.neutral};
  background: ${({ theme }) => theme.colors.status.neutralSoft};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  white-space: nowrap;
`;
