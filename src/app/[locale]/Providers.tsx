"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import type { ReactNode } from "react";
import { AppDataProvider } from "@/providers/AppDataProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppThemeProvider } from "@/lib/theme/AppThemeProvider";
import { GlobalStyles } from "@/lib/theme/GlobalStyles";
import { StyledComponentsRegistry } from "@/lib/theme/StyledComponentsRegistry";

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export const Providers = ({ children, locale, messages }: ProvidersProps) => (
  <StyledComponentsRegistry>
    <AppThemeProvider>
      <GlobalStyles />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </AuthProvider>
      </NextIntlClientProvider>
    </AppThemeProvider>
  </StyledComponentsRegistry>
);
