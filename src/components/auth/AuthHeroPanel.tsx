"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { AuthFeatureList } from "@/components/auth/AuthFeatureList";
import { AuthPreviewCards } from "@/components/auth/AuthPreviewCards";
import { authHeroReveal } from "@/components/auth/authMotion";
import { AppBrand } from "@/components/ui/AppBrand";

export const AuthHeroPanel = () => {
  const t = useTranslations("authWelcome");

  return (
    <Panel>
      <BrandWrap>
        <AppBrand />
      </BrandWrap>
      <Title>{t("title")}</Title>
      <Subtitle>{t("subtitle")}</Subtitle>
      <AuthFeatureList />
      <AuthPreviewCards />
    </Panel>
  );
};

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  inline-size: 100%;
  max-inline-size: 36rem;
  text-align: start;
`;

const BrandWrap = styled.div`
  ${authHeroReveal("0s")};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  text-wrap: balance;
  ${authHeroReveal("0.04s")};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-inline-size: 30rem;
  text-wrap: pretty;
  ${authHeroReveal("0.06s")};
`;
