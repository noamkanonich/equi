"use client";

import styled from "styled-components";
import { Link } from "@/i18n/routing";

type NewsSymbolChipProps = {
  symbol: string;
  onNavigate?: () => void;
};

export const NewsSymbolChip = ({ symbol, onNavigate }: NewsSymbolChipProps) => {
  return (
    <Chip href={`/stocks/${symbol}`} dir="ltr" onClick={onNavigate}>
      {symbol}
    </Chip>
  );
};

const Chip = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.brand.primarySoft};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: 1;
  text-decoration: none;
  transition: background 0.16s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`;
