"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

export const SmartReplaceHowItWorksCard = () => {
  const t = useTranslations("smartReplace");

  return (
    <Card>
      <Header>
        <IconWrap>
          <Info size={16} strokeWidth={1.9} aria-hidden />
        </IconWrap>
        <Title>{t("sidebar.howItWorks")}</Title>
      </Header>
      <List>
        <li>{t("howItWorks.simulationOnly")}</li>
        <li>{t("howItWorks.noTradePlaced")}</li>
        <li>{t("howItWorks.description")}</li>
      </List>
    </Card>
  );
};

const Card = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrap = styled.span`
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  list-style-position: inside;
`;
