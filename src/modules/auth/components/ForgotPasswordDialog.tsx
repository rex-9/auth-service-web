// src/design/components/auth/ForgotPasswordDialog.tsx

import React, { useState } from "react";
import { useCountdown, useTranslate } from "../../../hooks";
import {
  Button,
  Dialog,
  TextInput,
  TextLink,
  FormContainer,
} from "../../../design/components";
import { useToast, useLoading } from "../../../contexts";
import { DialogAuthSteps, TAuthStep } from "..";
import { AuthController } from "..";
import { AppLocales } from "../../../locales/app_locales";
import { ButtonVariants } from "../../../design";

interface IForgotPasswordDialogProps {
  email: string;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  updateUrl: (params: Record<string, string | null>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const ForgotPasswordDialog: React.FC<IForgotPasswordDialogProps> = ({
  email,
  navigateToStep,
  updateUrl,
  onClose,
  onBack,
}) => {
  const t = useTranslate();
  const { success } = useToast();
  const { isLoading, setLoading } = useLoading();
  const [localEmail, setLocalEmail] = useState(email);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const cooldown = useCountdown(0);
  const isCooldown = cooldown.isActive;
  const secondsLeft = cooldown.secondsLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = await AuthController.sendForgotPasswordMail(localEmail);
    setLoading(false);

    if (result.success) {
      setMessage(result.message || "");
      cooldown.start(60);
      success(t(AppLocales.Auth.ForgotPasscode.ResetLinkSent));
    } else {
      setError(result.error || "Failed to send password reset email.");
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={t(AppLocales.Auth.ForgotPasscode.Title)}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-4">
        {t(AppLocales.Auth.ForgotPasscode.Description)}
      </p>
      <FormContainer onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          id="forgot-email"
          type="email"
          value={localEmail}
          onChange={(e) => {
            setLocalEmail(e.target.value);
            updateUrl({ email: e.target.value });
          }}
          placeholder={t(AppLocales.Auth.Shared.EmailPlaceholder)}
          label={t(AppLocales.Auth.Shared.EmailLabel)}
          required
          fullWidth
          disabled={isLoading}
        />
        <Button
          variant={ButtonVariants.PRIMARY}
          type="submit"
          fullWidth
          disabled={isLoading || isCooldown}
        >
          {isCooldown
            ? t(AppLocales.Auth.ForgotPasscode.ResendIn, {
                seconds: secondsLeft,
              })
            : isLoading
              ? t(AppLocales.Auth.ForgotPasscode.Sending)
              : t(AppLocales.Auth.ForgotPasscode.SendResetLink)}
        </Button>
        <div className="text-center text-sm">
          <TextLink
            label={t(AppLocales.Auth.ForgotPasscode.BackToSignIn)}
            onClick={() =>
              navigateToStep(DialogAuthSteps.SIGNIN_PASSWORD, {
                email: localEmail,
              })
            }
          />
        </div>
      </FormContainer>
      {message && (
        <p className="text-caption text-success text-center">{message}</p>
      )}
      {error && <p className="text-caption text-error text-center">{error}</p>}
    </Dialog>
  );
};
