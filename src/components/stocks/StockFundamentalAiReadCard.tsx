"use client";

import { CheckCircle2, Eye, Sparkles, TriangleAlert } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import styled, { type DefaultTheme } from "styled-components";
import type { FundamentalAiRead } from "@/data/stocks/stock-analysis.types";
import { fadeUpVariants, getCardRevealTransition } from "@/utils/motion/transitions";

type StockFundamentalAiReadCardProps = {
  aiRead: FundamentalAiRead;
};

export const StockFundamentalAiReadCard = ({ aiRead }: StockFundamentalAiReadCardProps) => {
  const t = useTranslations("stockAnalysis");
  const prefersReducedMotion = useReducedMotion();

  const reveal = (index: number) => ({
    initial: prefersReducedMotion ? false : ("hidden" as const),
    animate: "show" as const,
    variants: fadeUpVariants,
    transition: getCardRevealTransition(index, prefersReducedMotion),
  });

  const sections = [
    {
      icon: <CheckCircle2 size={16} />,
      variant: "positive" as const,
      labelKey: "fundamentals.aiRead.whatsStrong",
      textKey: aiRead.whatsStrongKey,
    },
    {
      icon: <TriangleAlert size={16} />,
      variant: "warning" as const,
      labelKey: "fundamentals.aiRead.riskToWatch",
      textKey: aiRead.riskToWatchKey,
    },
    {
      icon: <Eye size={16} />,
      variant: "brand" as const,
      labelKey: "fundamentals.aiRead.whatToMonitor",
      textKey: aiRead.whatToMonitorKey,
    },
  ];

  return (
    <Card
      as={motion.section}
      {...reveal(0)}
    >
      <CardHeader>
        <TitleRow>
          <TitleIcon>
            <Sparkles size={18} />
          </TitleIcon>
          <CardTitle>{t("fundamentals.aiRead.title")}</CardTitle>
        </TitleRow>
      </CardHeader>

      <SectionsGrid>
        {sections.map((section) => (
          <SectionColumn key={section.labelKey} $variant={section.variant}>
            <SectionHeader>
              <SectionIconWrap $variant={section.variant}>
                {section.icon}
              </SectionIconWrap>
              <SectionLabel>{t(section.labelKey)}</SectionLabel>
            </SectionHeader>
            <SectionBody>{t(section.textKey)}</SectionBody>
          </SectionColumn>
        ))}
      </SectionsGrid>

      <CardFooter>
        <Disclaimer>{t("fundamentals.aiRead.disclaimer")}</Disclaimer>
        <PoweredBy>{t("fundamentals.aiRead.poweredBy")}</PoweredBy>
      </CardFooter>
    </Card>
  );
};

const Card = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const CardHeader = styled.div`
  margin-block-end: ${({ theme }) => theme.spacing.lg};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TitleIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const CardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.cardTitle.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.cardTitle.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.cardTitle.lineHeight};
`;

const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-block-end: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    grid-template-columns: 1fr;
  }
`;

type ColumnVariant = "positive" | "warning" | "brand";

const variantBorderColor = ({ $variant, theme }: { $variant: ColumnVariant; theme: DefaultTheme }) => {
  if ($variant === "positive") return theme.colors.status.positive;
  if ($variant === "warning") return theme.colors.status.warning;
  return theme.colors.brand.primary;
};

const variantIconColor = ({ $variant, theme }: { $variant: ColumnVariant; theme: DefaultTheme }) => {
  if ($variant === "positive") return theme.colors.status.positive;
  if ($variant === "warning") return theme.colors.status.warning;
  return theme.colors.brand.primary;
};

const variantIconBg = ({ $variant, theme }: { $variant: ColumnVariant; theme: DefaultTheme }) => {
  if ($variant === "positive") return theme.colors.status.positiveSoft;
  if ($variant === "warning") return theme.colors.status.warningSoft;
  return theme.colors.brand.primarySoft;
};

const SectionColumn = styled.div<{ $variant: ColumnVariant }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-inline-start: ${({ theme }) => theme.spacing.md};
  border-inline-start: 2px solid ${variantBorderColor};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectionIconWrap = styled.span<{ $variant: ColumnVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${variantIconColor};
  background: ${variantIconBg};
`;

const SectionLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const SectionBody = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-block-start: ${({ theme }) => theme.spacing.md};
  border-block-start: 1px solid ${({ theme }) => theme.colors.border.subtle};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Disclaimer = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const PoweredBy = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  white-space: nowrap;
`;
