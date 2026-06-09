"use client";

import { ExternalLink, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Link } from "@/i18n/routing";
import { SettingsInfoBox } from "./SettingsInfoBox";

export const AlertsSettingsCenterBanner = () => {
  const t = useTranslations("settings.alerts.alertsCenterBanner");

  return (
    <BannerWrap>
      <SettingsInfoBox variant="info" icon={Info}>
        <BannerContent>
          <BannerText>{t("message")}</BannerText>
          <BannerLink href="/alerts">
            {t("link")}
            <ExternalLink size={14} strokeWidth={1.9} aria-hidden />
          </BannerLink>
        </BannerContent>
      </SettingsInfoBox>
    </BannerWrap>
  );
};

const BannerWrap = styled.div`
  min-inline-size: 0;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const BannerText = styled.span`
  display: block;
`;

const BannerLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;
