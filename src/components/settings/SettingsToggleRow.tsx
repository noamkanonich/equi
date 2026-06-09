"use client";

import styled from "styled-components";

type SettingsToggleRowProps = {
  title: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export const SettingsToggleRow = ({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: SettingsToggleRowProps) => {
  return (
    <Row $disabled={disabled}>
      <Copy>
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
      </Copy>
      <SwitchButton
        type="button"
        $active={checked}
        $disabled={disabled}
        aria-pressed={checked}
        aria-disabled={disabled}
        aria-label={title}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            onChange(!checked);
          }
        }}
      >
        <SwitchThumb $active={checked} />
      </SwitchButton>
    </Row>
  );
};

const Row = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.card};
  opacity: ${({ $disabled }) => ($disabled ? 0.85 : 1)};
`;

const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-inline-size: 0;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const Description = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.preset.caption.fontWeight};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;

const SwitchButton = styled.button<{ $active: boolean; $disabled?: boolean }>`
  inline-size: 3.25rem;
  block-size: 1.75rem;
  flex-shrink: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.brand.primary : theme.colors.border.strong};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
  transition: background 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const SwitchThumb = styled.span<{ $active: boolean }>`
  display: block;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.card};
  transition: margin-inline-start 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  margin-inline-start: ${({ $active }) => ($active ? "1.5rem" : "0")};
`;
