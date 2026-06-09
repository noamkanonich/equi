# styled-components Guidelines

See [`AGENTS.md`](../../AGENTS.md) — **Non-Negotiable Development Rules** (especially §1, §10).

## Rules

- styled-components is the **only** styling solution
- Place all `styled.*` definitions at the **bottom** of the file
- **All styled-components must use theme colors and typography tokens** from `src/lib/theme/colors.ts` and `src/lib/theme/typography.ts` (composed in `theme.ts`)
- **No random hex values** in component files
- **No hardcoded font sizes or font weights** in component files unless there is a rare, justified reason
- Import theme via `ThemeProvider` and `${({ theme }) => ...}`
- Use **transient props** with `$` prefix for custom styled props (e.g. `$active`, `$variant`)
- Use **logical properties** for RTL/LTR:
  - `margin-inline-start` / `margin-inline-end`
  - `padding-inline-start` / `padding-inline-end`
  - `inset-inline-start` / `inset-inline-end`
  - `border-inline-start` / `border-inline-end`
- Avoid deeply nested selectors — keep styles flat and readable
- Split styled components if a file grows beyond **400–500 lines**

## Pattern

```tsx
"use client";

export const MyComponent = () => {
  return <Wrapper $active>...</Wrapper>;
};

const Wrapper = styled.section<{ $active?: boolean }>`
  padding-inline: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
`;
```

## Forbidden

- Tailwind classes
- CSS Modules
- External UI kits (MUI, Chakra, shadcn)
- Random hex colors or ad-hoc font sizes in component files
- Hardcoded `margin-left` / `padding-right` when logical properties apply
- Inline `style={{}}` except for dynamic values that cannot use styled-components

## Reference

- **Primary SSOT:** `src/lib/theme/` (`colors.ts`, `typography.ts`, `theme.ts`, `GlobalStyles.ts`)
- **Design reference only:** `src/assets/brand/` (not for hardcoding values in components)
