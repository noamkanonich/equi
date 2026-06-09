import { css } from "styled-components";

export const chartCardHover = css`
  transition:
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.2s cubic-bezier(0.22, 1, 0.36, 1);

  @media (hover: hover) {
    &:hover {
      transform: translateY(-0.0625rem);
      border-color: ${({ theme }) => theme.colors.border.strong};
      box-shadow: ${({ theme }) => theme.colors.shadow.card};
    }
  }
`;
