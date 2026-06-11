"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import styled from "styled-components";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import type { AuthMode } from "@/data/auth/auth.types";

export const AuthWelcomeScreen = () => {
  const tSuccess = useTranslations("auth.success");

  const [mode, setMode] = useState<AuthMode>("signIn");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <Page>
      <TopBar>
        <LanguageSelector />
      </TopBar>

      <Content>
        <MobileHero>
          <AuthHeroPanel />
        </MobileHero>

        <AuthColumn>
          <AuthFormCard
            mode={mode}
            successMessage={successMessage}
            onModeChange={setMode}
            onEmailConfirmationRequired={() => {
              setSuccessMessage(tSuccess("confirmEmail"));
            }}
            onClearSuccess={() => {
              setSuccessMessage(null);
              setMode("signIn");
            }}
          />
        </AuthColumn>

        <HeroColumn>
          <AuthHeroPanel />
        </HeroColumn>
      </Content>
    </Page>
  );
};

const Page = styled.div``;

const TopBar = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  padding: ${({ theme }) => theme.spacing.md};
  z-index: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    padding-inline: ${({ theme }) => theme.spacing.lg};
  }
`;

const Content = styled.main`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.xl};
  min-block-size: 100vh;
  padding: ${({ theme }) => theme.spacing.xxl}
    ${({ theme }) => theme.spacing.md};
  max-inline-size: 76rem;
  margin-inline: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
    padding-block-start: 4.5rem;
    padding-block-end: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    grid-template-columns: minmax(0, 1.12fr) minmax(22rem, 0.88fr);
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xxl};
    padding-block: ${({ theme }) => theme.spacing.xxl};
  }
`;

const HeroColumn = styled.div`
  display: none;
  order: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    display: block;
  }
`;

const MobileHero = styled.div`
  display: block;
  order: 1;
  inline-size: 100%;
  max-inline-size: 34rem;
  justify-self: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    display: none;
  }
`;

const AuthColumn = styled.div`
  order: 2;
  inline-size: 100%;
  max-inline-size: 28rem;
  justify-self: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    justify-self: end;
    max-inline-size: 29rem;
    order: 2;
  }
`;
