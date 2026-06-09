"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { EquiMark } from "./EquiMark";

type AppBrandProps = {
  $compact?: boolean;
};

export const AppBrand = ({ $compact = false }: AppBrandProps) => {
  const tApp = useTranslations("app");
  const appName = tApp("name");

  if ($compact) {
    return (
      <CompactWrap>
        <EquiMark $size={24} title={appName} decorative={false} />
      </CompactWrap>
    );
  }

  return (
    <BrandRow>
      <EquiMark $size={24} decorative />
      <Wordmark>{appName}</Wordmark>
    </BrandRow>
  );
};

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CompactWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Wordmark = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.brandWordmark.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.brandWordmark.fontWeight};
  letter-spacing: ${({ theme }) => theme.typography.preset.brandWordmark.letterSpacing};
  line-height: ${({ theme }) => theme.typography.preset.brandWordmark.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
`;
