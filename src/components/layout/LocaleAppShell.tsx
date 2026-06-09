"use client";

import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/AuthGate";
import { AppShell } from "@/components/layout/AppShell";

type LocaleAppShellProps = {
  children: ReactNode;
};

export const LocaleAppShell = ({ children }: LocaleAppShellProps) => (
  <AuthGate>
    <AppShell>{children}</AppShell>
  </AuthGate>
);
