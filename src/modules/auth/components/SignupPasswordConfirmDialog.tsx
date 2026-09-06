// src/design/components/auth/SignupPasswordConfirmDialog.tsx

import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Dialog,
  PasswordInput,
  TextLink,
  FormContainer,
} from "../../../design/components";
import { DialogAuthSteps, TAuthStep } from "..";
import { useAuth, useToast, useLoading } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { AuthController } from "..";
import { AppLocales, useTranslate } from "../../../locales";
import { ButtonVariants } from "../../../design";

interface ISignupPasswordConfirmDialogProps {
  email: string;
  password?: string;
  confirmPassword?: string;
  setConfirmPassword?: (value: string) => void;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  onClose: () => void;
  onBack: () => void;
}

export const SignupPasswordConfirmDialog: React.FC<
  ISignupPasswordConfirmDialogProps
> = ({
  email,
  password = "",
  confirmPassword = "",
  setConfirmPassword = () => {},
  navigateToStep,
  onClose,
  onBack,
}) => {
  const { signin, googleChallengeToken, setGoogleChallengeToken } = useAuth();
  const { isLoading, setLoading } = useLoading();
  const t = useTranslate();
  const navigate = useNavigate();
  const { success } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  // Check if this is a password reset flow
  const resetPasswordToken = searchParams.get("reset_password_token");

  const submitConfirmation = async (confirmValueToSubmit?: string) => {
    const value =
      typeof confirmValueToSubmit === "string"
        ? confirmValueToSubmit
        : confirmPassword;
    if (value.length !== 6) {
      setError(t(AppLocales.Auth.Shared.PasscodeLength));
      return;
    }
    if (value !== password) {
      setError(t(AppLocales.Auth.SignUpPasscodeConfirm.PasscodesMismatch));
      setConfirmPassword("");
      return;
    }

    // If this is a password reset flow
    if (resetPasswordToken) {
      setLoading(true);
      setError("");

      const result = await AuthController.resetPassword(
        resetPasswordToken,
        password,
        value,
      );
      setLoading(false);

      if (result.success) {
        success(t(AppLocales.Auth.SignUpPasscodeConfirm.ResetSuccess));
        navigate(
          AppRoutes.buildDialogUrl(DialogAuthSteps.INITIAL, {
            message: t(
              AppLocales.Auth.SignUpPasscodeConfirm.SignInWithNewPasscode,
            ),
          }),
        );
      } else {
        setError(
          result.error || t(AppLocales.Auth.SignUpPasscodeConfirm.ResetFailed),
        );
      }
      return;
    }

    // If this is a Google sign-up with challenge token
    if (googleChallengeToken) {
      setLoading(true);
      try {
        const result = await AuthController.completeGoogleSignIn(
          password,
          googleChallengeToken,
        );
        if (result.success && result.token && result.user) {
          signin(result.token, result.user);
          success(
            t(AppLocales.Auth.SignUpPasscodeConfirm.GoogleSignInComplete),
          );
          setGoogleChallengeToken(null);
          navigate(AppRoutes.client.protected.HOME);
        } else {
          setError(
            result.errorMessage ||
              t(AppLocales.Auth.SignUpPasscodeConfirm.GoogleSignInFailed),
          );
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : t(AppLocales.Auth.SignUpPasscodeConfirm.GoogleSignInFailed),
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal email sign-up - go to info page
    navigateToStep(DialogAuthSteps.SIGNUP_INFO, {
      email,
      password,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitConfirmation();
  };

  // Show different title for reset password flow
  const isResetFlow = !!resetPasswordToken;

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      onBack={onBack}
      title={
        isResetFlow
          ? t(AppLocales.Auth.SignUpPasscodeConfirm.ResetTitle)
          : t(AppLocales.Auth.SignUpPasscodeConfirm.SignUpTitle)
      }
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-4">
        {isResetFlow
          ? t(AppLocales.Auth.SignUpPasscodeConfirm.ResetDescription)
          : t(AppLocales.Auth.SignUpPasscodeConfirm.SignUpDescription)}
      </p>
      <FormContainer
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="text-center">
          <p className="text-body-m text-base-content">
            {isResetFlow
              ? t(AppLocales.Auth.SignUpPasscodeConfirm.ResetPrompt)
              : t(AppLocales.Auth.SignUpPasscodeConfirm.SignUpPrompt)}
          </p>
          <p className="text-body-s text-base-content opacity-70 mt-1">
            {t(AppLocales.Auth.SignUpPasscodeConfirm.Instruction)}
          </p>
        </div>
        <PasswordInput
          idPrefix="confirm-password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setError("");
          }}
          onComplete={(completed) => {
            void submitConfirmation(completed);
          }}
          label={t(AppLocales.Auth.SignUpPasscodeConfirm.FieldLabel)}
          helperText={t(AppLocales.Auth.SignUpPasscodeConfirm.FieldHelper)}
          error={error}
          disabled={false}
        />
        <Button
          variant={ButtonVariants.PRIMARY}
          type="submit"
          fullWidth
          disabled={isLoading || confirmPassword.length !== 6}
        >
          {isLoading
            ? t(AppLocales.Auth.SignUpPasscodeConfirm.Resetting)
            : t(AppLocales.Auth.Shared.Continue)}
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
