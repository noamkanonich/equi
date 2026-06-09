import { css } from "styled-components";

/** Card surface styles for section/article wrappers that cannot use `<Card />`. */
export const cardSurface = css`
  min-inline-size: 0;
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.card};
`;

export const cardSurfaceOverflowHidden = css`
  ${cardSurface}
  overflow: hidden;
`;
