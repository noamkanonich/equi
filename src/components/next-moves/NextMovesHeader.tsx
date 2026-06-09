"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

export const NextMovesHeader = () => {
  const t = useTranslations("nextMoves");

  return (
    <Header>
      <TitleGroup>
        <TitleLine>
          <IconWrap aria-hidden>
            <Sparkles size={20} strokeWidth={1.9} />
          </IconWrap>
          <Title>{t("title")}</Title>
        </TitleLine>
        <Subtitle>{t("subtitle")}</Subtitle>
      </TitleGroup>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TitleGroup = styled.div`
  min-inline-size: 0;
`;

const TitleLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.pageTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.pageTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.pageTitle.lineHeight};
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  margin-block-start: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;
