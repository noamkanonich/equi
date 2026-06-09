"use client";

import type { ReactNode } from "react";

type ReplacementReasoningProps = {
  children?: ReactNode;
};

export const ReplacementReasoning = ({ children = null }: ReplacementReasoningProps) => {
  return <>{children}</>;
};
