"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useId, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { Button } from "@/components/ui/Button";
import type { AuthMode } from "@/data/auth/auth.types";
import { useAuth } from "@/providers/useAuth";

type AuthFormProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess?: () => void;
  onEmailConfirmationRequired: () => void;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

const MIN_PASSWORD_LENGTH = 6;

export const AuthForm = ({
  mode,
  onModeChange,
  onSuccess,
  onEmailConfirmationRequired,
}: AuthFormProps) => {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const { signIn, signUp, authError, clearAuthError } = useAuth();

  const emailId = useId();
  const passwordId = useId();
  const formErrorId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((): FieldErrors => {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = tErrors("emailRequired");
    }

    if (!password) {
      errors.password = tErrors("passwordRequired");
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = tErrors("passwordTooShort");
    }

    return errors;
  }, [email, password, tErrors]);

  const resolveAuthErrorMessage = useCallback(() => {
    if (!authError) {
      return null;
    }

    if (
      authError.code === "invalid_credentials" ||
      authError.message.toLowerCase().includes("invalid login credentials")
    ) {
      return tErrors("invalidCredentials");
    }

    return tErrors("default");
  }, [authError, tErrors]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearAuthError();

    const errors = validate();
    setFieldErrors(errors);

    if (errors.email || errors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signIn") {
        const success = await signIn(email, password);
        if (success) {
          onSuccess?.();
        }
        return;
      }

      const result = await signUp(email, password);
      if (result.needsEmailConfirmation) {
        onEmailConfirmationRequired();
        return;
      }

      if (result.success) {
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    clearAuthError();
    setFieldErrors({});
    onModeChange(mode === "signIn" ? "signUp" : "signIn");
  };

  const formError = resolveAuthErrorMessage();
  const submitLabel = isSubmitting
    ? mode === "signIn"
      ? t("signingIn")
      : t("signingUp")
    : mode === "signIn"
      ? t("signIn")
      : t("createAccount");

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <ModeTabs role="tablist" aria-label={t("openAuth")}>
        <ModeTab
          type="button"
          role="tab"
          aria-selected={mode === "signIn"}
          $active={mode === "signIn"}
          onClick={() => {
            clearAuthError();
            setFieldErrors({});
            onModeChange("signIn");
          }}
        >
          {t("signIn")}
        </ModeTab>
        <ModeTab
          type="button"
          role="tab"
          aria-selected={mode === "signUp"}
          $active={mode === "signUp"}
          onClick={() => {
            clearAuthError();
            setFieldErrors({});
            onModeChange("signUp");
          }}
        >
          {t("createAccount")}
        </ModeTab>
      </ModeTabs>

      <Field>
        <Label htmlFor={emailId}>{t("email")}</Label>
        <TextInput
          id={emailId}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
        />
        {fieldErrors.email ? (
          <FieldError id={`${emailId}-error`}>{fieldErrors.email}</FieldError>
        ) : null}
      </Field>

      <Field>
        <Label htmlFor={passwordId}>{t("password")}</Label>
        <TextInput
          id={passwordId}
          type="password"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? `${passwordId}-error` : undefined}
        />
        {fieldErrors.password ? (
          <FieldError id={`${passwordId}-error`}>{fieldErrors.password}</FieldError>
        ) : null}
      </Field>

      {formError ? (
        <FormError id={formErrorId} role="alert">
          {formError}
        </FormError>
      ) : null}

      <SubmitButton type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? (
          <SubmitSpinner aria-hidden>
            <Loader2 size={16} strokeWidth={2} />
          </SubmitSpinner>
        ) : null}
        {submitLabel}
      </SubmitButton>

      <ModeHint>
        {mode === "signIn" ? t("noAccount") : t("alreadyHaveAccount")}{" "}
        <ModeLink type="button" onClick={toggleMode}>
          {mode === "signIn" ? t("createAccount") : t("signIn")}
        </ModeLink>
      </ModeHint>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModeTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.background.soft};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ModeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.background.card : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.regular};
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.12s ease,
    box-shadow 0.15s ease;
  box-shadow: ${({ theme, $active }) =>
    $active ? theme.colors.shadow.soft : "none"};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 1px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
`;

const TextInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brand.primarySoft};
  }

  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.status.negative};
  }
`;

const FieldError = styled.span`
  color: ${({ theme }) => theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const FormError = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.status.negativeSoft};
  color: ${({ theme }) => theme.colors.status.negative};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const submitSpin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const submitSpinnerAnimation = css`
  animation: ${submitSpin} 0.75s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const SubmitSpinner = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${submitSpinnerAnimation}
`;

const SubmitButton = styled(Button)`
  inline-size: 100%;
  justify-content: center;
  transition: transform 0.12s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const ModeHint = styled.p`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
`;

const ModeLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: inherit;
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 2px;
  }
`;
