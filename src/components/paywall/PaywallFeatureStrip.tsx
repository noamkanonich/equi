"use client";

import { Brain, LineChart, Bell, RefreshCw, FileBarChart } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

const FEATURE_ICONS = [LineChart, Brain, Bell, RefreshCw, FileBarChart];

export const PaywallFeatureStrip = () => {
  const t = useTranslations("paywall.featureStrip");
  const keys = ["portfolioTracking", "aiInsights", "smartAlerts", "smartReplace", "reports"] as const;

  return (
    <Strip>
      {keys.map((key, i) => {
        const Icon = FEATURE_ICONS[i];
        return (
          <StripItem key={key}>
            <StripIcon aria-hidden>
              <Icon size={16} strokeWidth={1.8} />
            </StripIcon>
            <StripLabel>{t(key)}</StripLabel>
          </StripItem>
        );
      })}
    </Strip>
  );
};

const Strip = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1.5rem;
`;

const StripItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const StripIcon = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const StripLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
`;
