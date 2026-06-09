"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";

type DashboardHeaderProps = {
  onAddStockClick?: () => void;
};

export const DashboardHeader = ({ onAddStockClick }: DashboardHeaderProps) => {
  const t = useTranslations("dashboard");

  return (
    <Header>
      <TitleGroup>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
      </TitleGroup>
      <Button $size="md" aria-label={t("actions.addStock")} onClick={onAddStockClick}>
        <Plus size={18} strokeWidth={1.8} />
        {t("actions.addStock")}
      </Button>
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
    align-items: stretch;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

