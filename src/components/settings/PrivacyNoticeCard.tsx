"use client";

import { Lock, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

export const PrivacyNoticeCard = () => {
  const t = useTranslations("settings.general.privacy");

  return (
    <Notice>
      <Content>
        <IconWrap aria-hidden>
          <Shield size={20} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Title>{t("title")}</Title>
          <Description>{t("description")}</Description>
        </Copy>
      </Content>
      <LockWrap aria-hidden>
        <Lock size={18} strokeWidth={1.75} />
      </LockWrap>
    </Notice>
  );
};

const Notice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 16%, transparent);
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  min-inline-size: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
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

const LockWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  opacity: 0.7;
`;
