"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import type { AiPreferencesState } from "@/data/settings/settings.types";
import { getAiPreviewContent } from "@/utils/settings/getAiPreviewText";

type AiPreferencesResponsePreviewCardProps = {
  settings: AiPreferencesState;
};

export const AiPreferencesResponsePreviewCard = ({
  settings,
}: AiPreferencesResponsePreviewCardProps) => {
  const t = useTranslations("settings.aiPreferences.preview");
  const prefersReducedMotion = useReducedMotion();
  const preview = getAiPreviewContent(settings);
  const previewKey = `${settings.detailLevel}_${settings.tone}`;

  return (
    <StyledCard $padding="md">
      <Header>
        <Title>{t("title")}</Title>
        <Subtitle>{t("subtitle")}</Subtitle>
      </Header>

      <PreviewCard>
        <PreviewHeader>
          <Sparkles size={16} strokeWidth={1.9} aria-hidden />
          <Symbol dir="ltr">{t("symbol")}</Symbol>
        </PreviewHeader>

        <AnimatePresence mode="wait">
          <PreviewBody
            key={previewKey}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {preview.mode === "detailed" ? (
              <>
                <InsightText>
                  {t(`mock.${preview.variantKey}.intro` as "mock.detailed_balanced.intro")}
                </InsightText>
                {preview.bulletKeys.map((bulletKey) => (
                  <Bullet key={bulletKey}>
                    {t(
                      `mock.${preview.variantKey}.${bulletKey}` as "mock.detailed_balanced.bullet1",
                    )}
                  </Bullet>
                ))}
              </>
            ) : (
              <InsightText>
                {t(`mock.${preview.variantKey}.text` as "mock.balanced_balanced.text")}
              </InsightText>
            )}
          </PreviewBody>
        </AnimatePresence>
      </PreviewCard>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const PreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 16%, transparent);
  background: ${({ theme }) => theme.colors.brand.primarySoft};
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.brand.primary};
`;

const Symbol = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const PreviewBody = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InsightText = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Bullet = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  padding-inline-start: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: "•";
    margin-inline-end: ${({ theme }) => theme.spacing.xs};
  }
`;
