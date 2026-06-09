import { css } from "styled-components";
import { authGlowPulse } from "@/components/auth/authMotion";

export const authPageBackground = css`
  position: relative;
  min-block-size: 100vh;
  background: ${({ theme }) => theme.colors.background.app};
  overflow-x: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      145deg,
      ${({ theme }) => theme.colors.background.soft} 0%,
      ${({ theme }) => theme.colors.background.app} 55%,
      ${({ theme }) => theme.colors.background.app} 100%
    );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inline-size: min(36rem, 80vw);
    block-size: min(36rem, 80vw);
    inset-block-start: -8rem;
    inset-inline-start: -6rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.brand.primarySoft};
    opacity: 0.35;
    filter: blur(48px);
    pointer-events: none;
    ${authGlowPulse("0s")};
  }
`;
