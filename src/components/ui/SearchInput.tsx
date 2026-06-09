"use client";

import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import styled from "styled-components";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export const SearchInput = ({ label, ...props }: SearchInputProps) => {
  return (
    <Wrapper>
      <SearchIcon size={18} strokeWidth={1.75} aria-hidden />
      <Input type="search" aria-label={label} {...props} />
    </Wrapper>
  );
};

const Wrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  min-block-size: 3rem;
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.strong};
  border-radius: ${({ theme }) => theme.radius.md};
  padding-inline: ${({ theme }) => theme.spacing.md};
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primarySoft};
    background: ${({ theme }) => theme.colors.background.elevated};
  }
`;

const SearchIcon = styled(Search)`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Input = styled.input`
  flex: 1;
  min-inline-size: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.body.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    outline: none;
  }
`;
