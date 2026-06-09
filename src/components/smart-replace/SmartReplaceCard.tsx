"use client";

import { Card, type CardProps } from "@/components/ui/Card";

export const SmartReplaceCard = ({ children, ...props }: CardProps) => {
  return <Card {...props}>{children}</Card>;
};
