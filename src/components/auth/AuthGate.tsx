"use client";

import type { ReactNode } from "react";
import { AuthLoadingScreen } from "@/components/auth/AuthLoadingScreen";
import { AuthWelcomeScreen } from "@/components/auth/AuthWelcomeScreen";
import { useAuth } from "@/providers/useAuth";

type AuthGateProps = {
  children: ReactNode;
};

export const AuthGate = ({ children }: AuthGateProps) => {
  const { isAuthLoading, isAuthenticated } = useAuth();

  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthWelcomeScreen />;
  }

  return children;
};
