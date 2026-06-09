"use client";

import type { ReactNode } from "react";

type ReplacementComparisonProps = {
  children?: ReactNode;
};

export const ReplacementComparison = ({ children = null }: ReplacementComparisonProps) => {
  return <>{children}</>;
};
