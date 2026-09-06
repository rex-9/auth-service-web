// src/design/components/auth/ConfirmEmailDialog.tsx

import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  PasswordInput,
  TextLink,
  FormContainer,
} from "../../../design/components";
import { DialogAuthSteps, TAuthStep } from "..";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { AuthController } from "..";
import { useAuth, useToast, useLoading } from "../../../contexts";
import { useCountdown, useTranslate } from "../../../hooks";
import { AppLocales } from "../../../locales";

interface IConfirmEmailDialogProps {
  email: string;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  updateUrl: (params: Record<string, string | null>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const ConfirmEmailDialog: React.FC<IConfirmEmailDialogProps> = ({
  email,
  navigateToStep,
  updateUrl,
  onClose,
  onBack,
}) => {
  const { signin } = useAuth();
  const { isLoading, setLoading } = useLoading();
  const t = useTranslate();
  const navigate = useNavigate();
  const { success, info } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const cooldown = useCountdown(0);
  const isCooldown = cooldown.isActive;
  const secondsLeft = cooldown.secondsLeft;

  const handleVerify = async (codeToVerify?: string) => {
    const code = typeof codeToVerify === "string" ? codeToVerify : otp;
    if (isLoading || code.length !== 6) return;
    setLoading(true);
    setError("");
    setMessage("");

    const result = await AuthController.confirmEmailWithCode(email, code);
    setLoading(false);

    if (result.success && result.token && result.user) {
      setMessage(result.message || "");
      success(t(AppLocales.Auth.ConfirmEmail.Verified));
      signin(result.token, result.user);
      navigate(AppRoutes.client.protected.HOME);
    } else {
      setError(result.error || "Failed to confirm email code.");
    }
  };

  const handleResend = async () => {
    if (isCooldown) return;
    setError("");
    setMessage("");

    const result = await AuthController.sendConfirmationEmail(email);

    if (result.success) {
      setMessage(result.message || "");
      cooldown.start(30);
      info(t(AppLocales.Auth.ConfirmEmail.Resent));
    } else {
      setError(result.error || "Failed to send confirmation email.");
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={t(AppLocales.Auth.ConfirmEmail.Title)}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-4">
        {t(AppLocales.Auth.ConfirmEmail.Description)}
      </p>
      <div className="space-y-4">
        <FormContainer
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            void handleVerify();
          }}
          className="space-y-4"
        >
          <PasswordInput
            idPrefix="confirm-email-otp"
            value={otp}
            onChange={(value: string) => {
              setOtp(value);
              updateUrl({ otp: value });
              setError("");
            }}
            onComplete={(completed: string) => {
              void handleVerify(completed);
            }}
            label={t(AppLocales.Auth.ConfirmEmail.FieldLabel)}
            error={error}
            helperText={t(AppLocales.Auth.ConfirmEmail.FieldHelper)}
            disabled={isLoading}
            mask={false}
          />
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading
              ? t(AppLocales.Auth.ConfirmEmail.Verifying)
              : t(AppLocales.Auth.ConfirmEmail.VerifyEmail)}
          </Button>
        </FormContainer>

        <div className="text-center">
          <p className="text-body-m text-base-content font-semibold">
            {t(AppLocales.Auth.ConfirmEmail.Prompt)}
          </p>
          <p className="text-body-s text-base-content opacity-70 mt-4">
            {t(AppLocales.Auth.ConfirmEmail.SentTo)}
          </p>
          <p className="text-body-m text-base-content font-medium mt-2">
            {email}
          </p>
        </div>

        <div className="text-center">
          <TextLink
            label={
              isCooldown
                ? t(AppLocales.Auth.ConfirmEmail.ResendIn, {
                    seconds: secondsLeft,
                  })
                : t(AppLocales.Auth.ConfirmEmail.Resend)
            }
            onClick={handleResend}
            className={`text-body-s ${isCooldown ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        <div className="text-center space-y-4">
          <p className="text-body-s text-base-content opacity-70">
            {t(AppLocales.Auth.ConfirmEmail.InboxInstruction)}
          </p>
          <TextLink
            label={t(AppLocales.Auth.Shared.UseDifferentEmail)}
            onClick={() => navigateToStep(DialogAuthSteps.INITIAL)}
            className="text-body-s"
          />
        </div>

        {message && (
          <p className="text-caption text-success text-center">{message}</p>
        )}
        {error && (
          <p className="text-caption text-error text-center">{error}</p>
        )}
      </div>
    </Dialog>
  );
};
