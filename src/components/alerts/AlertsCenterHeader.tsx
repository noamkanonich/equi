"use client";

import { Bell, Settings, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { SearchInput } from "@/components/ui/SearchInput";
import { Link } from "@/i18n/routing";

type AlertsCenterHeaderProps = {
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
};

export const AlertsCenterHeader = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  onFilterClick,
}: AlertsCenterHeaderProps) => {
  const t = useTranslations("alerts");

  return (
    <Header>
      <TitleGroup>
        <IconWrap aria-hidden>
          <Bell size={20} strokeWidth={1.9} />
        </IconWrap>
        <Copy>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Copy>
      </TitleGroup>
      <Actions>
        <SearchWrap>
          <SearchInput
            label={t("actions.search")}
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </SearchWrap>
        <FilterButton type="button" aria-label={t("actions.filter")} onClick={onFilterClick}>
          <SlidersHorizontal size={16} strokeWidth={1.9} aria-hidden />
        </FilterButton>
        <SettingsLink href="/settings?tab=alerts">
          <Settings size={16} strokeWidth={1.9} aria-hidden />
          {t("alertSettings")}
        </SettingsLink>
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
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`;

const SearchWrap = styled.div`
  inline-size: 16rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    flex: 1 1 100%;
    inline-size: 100%;
  }
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.card};
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.elevated};
  }
`;

const SettingsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: 1px solid ${({ theme }) => theme.colors.brand.primary};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primaryDark};
    border-color: ${({ theme }) => theme.colors.brand.primaryDark};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
