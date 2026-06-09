"use client";

import { useTranslations } from "next-intl";
import { PlaceholderModal } from "@/components/ui/PlaceholderModal";

type ReportPlaceholderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  variant: "export" | "download";
};

export const ReportPlaceholderModal = ({
  isOpen,
  onClose,
  variant,
}: ReportPlaceholderModalProps) => {
  const t = useTranslations("reports.modal");

  const title =
    variant === "export" ? t("exportTitle") : t("downloadTitle");

  return (
    <PlaceholderModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={t("placeholderDescription")}
      primaryLabel={t("close")}
    />
  );
};
