"use client";

import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";

type PortfolioHeaderProps = {
  onAddStockClick?: () => void;
};

export const PortfolioHeader = ({ onAddStockClick }: PortfolioHeaderProps) => {
  const t = useTranslations("portfolio");
  const tInteractions = useTranslations("interactions");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  return (
    <>
    <Header>
      <TitleGroup>
        <TitleLine>
          <Title>{t("title")}</Title>
          <EyeIcon aria-label={t("header.visibilityLabel")}>
            <Eye size={18} strokeWidth={1.8} />
          </EyeIcon>
        </TitleLine>
        <Subtitle>{t("subtitle")}</Subtitle>
      </TitleGroup>
      <Actions>
        <Button
          $variant="secondary"
          $size="sm"
          aria-label={t("actions.addTransaction")}
          onClick={() => setIsAddTransactionOpen(true)}
        >
          <Plus size={16} strokeWidth={1.8} />
          {t("actions.addTransaction")}
        </Button>
        <Button
          $variant="primary"
          $size="sm"
          aria-label={t("actions.addStock")}
          onClick={onAddStockClick}
        >
          <Plus size={16} strokeWidth={1.8} />
          {t("actions.addStock")}
        </Button>
      </Actions>
    </Header>

    <PlaceholderModal
      isOpen={isAddTransactionOpen}
      onClose={() => setIsAddTransactionOpen(false)}
      title={tInteractions("portfolio.addTransactionTitle")}
      description={tInteractions("portfolio.addTransactionDescription")}
    />
    </>
  );
};

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  min-inline-size: 0;
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  letter-spacing: -0.03em;
`;

const EyeIcon = styled.span`
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const Subtitle = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
    justify-content: stretch;

    & > button {
      flex: 1;
      min-block-size: 2.75rem;
    }
  }
`;
