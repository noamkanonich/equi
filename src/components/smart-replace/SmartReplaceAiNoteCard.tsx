"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import type { SmartReplaceAiNote } from "@/data/smart-replace/smart-replace.types";
import { getSmartReplaceTranslationKey } from "@/utils/smart-replace/getSmartReplaceTranslationKey";

type SmartReplaceAiNoteCardProps = {
  note: SmartReplaceAiNote;
};

export const SmartReplaceAiNoteCard = ({ note }: SmartReplaceAiNoteCardProps) => {
  const t = useTranslations("smartReplace");

  return (
    <Card>
      <Header>
        <IconWrap>
          <Sparkles size={16} strokeWidth={1.9} aria-hidden />
        </IconWrap>
        <Title>{t("sidebar.aiNote")}</Title>
      </Header>
      <Body>{t(getSmartReplaceTranslationKey(note.bodyKey))}</Body>
      <Disclaimer>{t(getSmartReplaceTranslationKey(note.disclaimerKey))}</Disclaimer>
    </Card>
  );
};

const Card = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 7%, transparent),
      transparent
    ),
    ${({ theme }) => theme.colors.background.card};
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

const Body = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Disclaimer = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
