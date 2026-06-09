"use client";

import { BarChart3, Briefcase, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { authHeroReveal } from "@/components/auth/authMotion";

const featureConfig = [
  { key: "featurePortfolio", icon: Briefcase, delay: "0.08s" },
  { key: "featureWatchlist", icon: Layers, delay: "0.14s" },
  { key: "featureAnalysis", icon: BarChart3, delay: "0.2s" },
] as const;

export const AuthFeatureList = () => {
  const t = useTranslations("authWelcome");

  return (
    <List>
      {featureConfig.map(({ key, icon: Icon, delay }) => (
        <Item key={key} $delay={delay}>
          <IconWrap aria-hidden>
            <Icon size={16} strokeWidth={1.75} />
          </IconWrap>
          <ItemText>{t(key)}</ItemText>
        </Item>
      ))}
    </List>
  );
};

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
  inline-size: 100%;
`;

const Item = styled.li<{ $delay: string }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  ${({ $delay }) => authHeroReveal($delay)};
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  flex-shrink: 0;
`;

const ItemText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  text-align: start;
`;
