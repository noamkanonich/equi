"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Link } from "@/i18n/routing";

type StockBreadcrumbProps = {
  symbol: string;
};

export const StockBreadcrumb = ({ symbol }: StockBreadcrumbProps) => {
  const t = useTranslations("stockAnalysis.breadcrumb");

  return (
    <Nav aria-label={t("label")}>
      <CrumbLink href="/portfolio">{t("portfolio")}</CrumbLink>
      <Separator aria-hidden>
        <ChevronRight size={14} strokeWidth={2} />
      </Separator>
      <CrumbText dir="ltr">{symbol}</CrumbText>
      <Separator aria-hidden>
        <ChevronRight size={14} strokeWidth={2} />
      </Separator>
      <Current>{t("analysis")}</Current>
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CrumbLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
  }
`;

const CrumbText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Current = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Separator = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.muted};

  [dir="rtl"] & svg {
    transform: scaleX(-1);
  }
`;
