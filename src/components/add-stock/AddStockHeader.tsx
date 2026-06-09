"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

type AddStockHeaderProps = {
  titleId: string;
  descriptionId: string;
  onClose: () => void;
};

export const AddStockHeader = ({
  titleId,
  descriptionId,
  onClose,
}: AddStockHeaderProps) => {
  const t = useTranslations("addStock");

  return (
    <Header>
      <TitleGroup>
        <Title id={titleId}>{t("title")}</Title>
        <Subtitle id={descriptionId}>{t("subtitle")}</Subtitle>
      </TitleGroup>
      <CloseButton type="button" onClick={onClose} aria-label={t("actions.close")}>
        <X size={20} strokeWidth={1.75} aria-hidden />
      </CloseButton>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  letter-spacing: -0.03em;
  text-align: start;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
  text-align: start;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.primary};
    border-color: ${({ theme }) => theme.colors.border.strong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
