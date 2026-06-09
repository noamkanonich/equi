"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  HelpCircle,
  Target,
  Upload,
} from "lucide-react";
import { DirectionalChevron } from "@/components/ui/DirectionalChevron";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { settingsQuickActions } from "@/data/settings/settings.mock";
import type {
  SettingsImportErrorReason,
  SettingsQuickActionKey,
} from "@/data/settings/settings.types";
import { HelpSupportModal } from "./HelpSupportModal";
import { HowScoringWorksModal } from "./HowScoringWorksModal";
import { SettingsInfoBox } from "./SettingsInfoBox";

type SettingsQuickActionsCardProps = {
  onExportSettings: () => void;
  onImportSettingsFile: (file: File) => void;
  exportStatus: "idle" | "success";
  importStatus: "idle" | "success" | "error";
  importErrorReason?: SettingsImportErrorReason;
};

const actionIcons: Record<SettingsQuickActionKey, typeof Download> = {
  exportSettings: Download,
  importSettings: Upload,
  howScoringWorks: Target,
  helpSupport: HelpCircle,
};

export const SettingsQuickActionsCard = ({
  onExportSettings,
  onImportSettingsFile,
  exportStatus,
  importStatus,
  importErrorReason,
}: SettingsQuickActionsCardProps) => {
  const t = useTranslations("settings.quickActions");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleAction = (key: SettingsQuickActionKey) => {
    if (key === "exportSettings") {
      onExportSettings();
      return;
    }

    if (key === "importSettings") {
      fileInputRef.current?.click();
      return;
    }

    if (key === "howScoringWorks") {
      setIsScoringModalOpen(true);
      return;
    }

    if (key === "helpSupport") {
      setIsHelpModalOpen(true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    onImportSettingsFile(file);
  };

  const showExportSuccess = exportStatus === "success";
  const showImportSuccess = importStatus === "success";
  const showImportError = importStatus === "error" && importErrorReason;

  return (
    <>
      <StyledCard $padding="md">
        <Title>{t("title")}</Title>
        <List>
          {settingsQuickActions.map((action) => {
            const Icon = actionIcons[action.key];

            return (
              <ActionRow
                key={action.key}
                type="button"
                onClick={() => handleAction(action.key)}
              >
                <RowStart>
                  <IconWrap aria-hidden>
                    <Icon size={16} strokeWidth={1.9} />
                  </IconWrap>
                  <Label>{t(action.key)}</Label>
                </RowStart>
                <DirectionalChevron />
              </ActionRow>
            );
          })}
        </List>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          tabIndex={-1}
          aria-hidden
        />

        {(showExportSuccess || showImportSuccess || showImportError) && (
          <Feedback aria-live="polite">
            {showExportSuccess ? (
              <SettingsInfoBox variant="positive" icon={CheckCircle2}>
                {t("exportSuccess")}
              </SettingsInfoBox>
            ) : null}
            {showImportSuccess ? (
              <SettingsInfoBox variant="positive" icon={CheckCircle2}>
                {t("importSuccess")}
              </SettingsInfoBox>
            ) : null}
            {showImportError ? (
              <SettingsInfoBox variant="info" icon={AlertCircle}>
                {t(`importErrors.${importErrorReason}`)}
              </SettingsInfoBox>
            ) : null}
          </Feedback>
        )}
      </StyledCard>

      <HowScoringWorksModal
        isOpen={isScoringModalOpen}
        onClose={() => setIsScoringModalOpen(false)}
      />
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  inline-size: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  text-align: start;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  svg:last-child {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text.muted};

    [dir="rtl"] & {
      transform: scaleX(-1);
    }
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background.soft};
    border-color: ${({ theme }) => theme.colors.border.subtle};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;

const RowStart = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-inline-size: 0;
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  background: ${({ theme }) => theme.colors.background.elevated};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const HiddenFileInput = styled.input`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Feedback = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;
