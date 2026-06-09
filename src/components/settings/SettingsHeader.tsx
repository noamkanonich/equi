"use client";

import { RotateCcw, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

type SettingsHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onResetToDefaults: () => void;
};

export const SettingsHeader = ({
  searchQuery,
  onSearchChange,
  onResetToDefaults,
}: SettingsHeaderProps) => {
  const t = useTranslations("settings");

  return (
    <Header>
      <TitleGroup>
        <IconWrap aria-hidden>
          <Settings size={20} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Title>{t("title")}</Title>
          <Subtitle>{t("subtitle")}</Subtitle>
        </Copy>
      </TitleGroup>
      <Actions>
        <SearchWrap>
          <SearchInput
            label={t("searchPlaceholder")}
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </SearchWrap>
        <Button $variant="secondary" onClick={onResetToDefaults}>
          <RotateCcw size={16} strokeWidth={1.9} aria-hidden />
          {t("resetToDefaults")}
        </Button>
      </Actions>
    </Header>
  );
};

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-block-start: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.brand.primary} 12%, transparent);
`;

const Copy = styled.div`
  min-inline-size: 0;
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
  max-inline-size: 42rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
    flex-direction: column;
    align-items: stretch;

    button {
      inline-size: 100%;
      justify-content: center;
    }
  }
`;

const SearchWrap = styled.div`
  inline-size: 16rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    inline-size: 100%;
  }
`;
