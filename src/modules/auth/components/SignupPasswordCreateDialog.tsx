// src/design/components/auth/SignupPasswordCreateDialog.tsx

import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Dialog,
  PasswordInput,
  TextLink,
  FormContainer,
} from "../../../design/components";
import { AppLocales, useTranslate } from "../../../locales";
import { DialogAuthSteps, TAuthStep } from "..";
import { ButtonVariants } from "../../../design";

interface ISignupPasswordCreateDialogProps {
  email: string;
  password?: string;
  setPassword?: (value: string) => void;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SignupPasswordCreateDialog: React.FC<
  ISignupPasswordCreateDialogProps
> = ({
  email,
  password = "",
  setPassword = () => {},
  navigateToStep,
  onClose,
  onBack,
}) => {
  const t = useTranslate();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  // Check if this is a password reset flow
  const resetPasswordToken = searchParams.get("reset_password_token");

  const submitCreate = (passwordValue?: string) => {
    const value = typeof passwordValue === "string" ? passwordValue : password;
    if (value.length !== 6) {
      setError(t(AppLocales.Auth.Shared.PasscodeLength));
      return;
    }

    const extra: Record<string, string> = { email, password: value };

    // Pass reset token to confirm step if present
    if (resetPasswordToken) {
      extra.reset_password_token = resetPasswordToken;
    }

    navigateToStep(DialogAuthSteps.SIGNUP_PASSWORD_CONFIRM, extra);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCreate();
  };

  // Show different subtitle for reset password flow
  const isResetFlow = !!resetPasswordToken;
  const subtitle = isResetFlow
    ? t(AppLocales.Auth.SignUpPasscodeCreate.ResetDescription)
    : t(AppLocales.Auth.SignUpPasscodeCreate.SignUpDescription);

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={
        isResetFlow
          ? t(AppLocales.Auth.SignUpPasscodeCreate.ResetTitle)
          : t(AppLocales.Auth.SignUpPasscodeCreate.SignUpTitle)
      }
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-4">
        {subtitle}
      </p>
      <FormContainer
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="text-center">
          <p className="text-body-m text-base-content">
            {isResetFlow
              ? t(AppLocales.Auth.SignUpPasscodeCreate.ResetPrompt)
              : t(AppLocales.Auth.SignUpPasscodeCreate.SignUpPrompt, { email })}
          </p>
          <p className="text-body-s text-base-content opacity-70 mt-1">
            {t(AppLocales.Auth.SignUpPasscodeCreate.Instruction)}
          </p>
        </div>
        <PasswordInput
          idPrefix="create-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setError("");
          }}
          onComplete={(completed) => {
            submitCreate(completed);
          }}
          label={t(AppLocales.Auth.SignUpPasscodeCreate.FieldLabel)}
          helperText={t(AppLocales.Auth.SignUpPasscodeCreate.FieldHelper)}
          error={error}
          disabled={false}
        />
        <Button
          variant={ButtonVariants.PRIMARY}
          type="submit"
          fullWidth
          disabled={password.length !== 6}
        >
          {t(AppLocales.Auth.Shared.Continue)}
        </Button>
        <div className="text-center text-sm">
          <TextLink
            label={t(AppLocales.Auth.Shared.UseDifferentEmail)}
            onClick={() => navigateToStep(DialogAuthSteps.INITIAL)}
          />
        </div>
      </FormContainer>
    </Dialog>
  );
};
