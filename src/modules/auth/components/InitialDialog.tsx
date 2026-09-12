// src/design/components/auth/InitialDialog.tsx

import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, useToast, useLoading } from "../../../contexts";
import {
  Button,
  GoogleButton,
  TextInput,
  Dialog,
  FormContainer,
} from "../../../design/components";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps, TAuthStep } from "..";
import { AuthController } from "..";
import { UserController, USER_PEEK_STATUS } from "../../user";
import { AppLocales, useTranslate } from "../../../locales";
import { AnalyticsService } from "../../../services";
import { ANALYTICS_AUTH_METHODS } from "../../../constants";

interface IInitialDialogProps {
  email: string;
  navigateToStep: (step: TAuthStep, extra?: Record<string, string>) => void;
  updateUrl: (params: Record<string, string | null>) => void;
  onClose: () => void;
}

export const InitialDialog: React.FC<IInitialDialogProps> = ({
  email,
  navigateToStep,
  updateUrl,
  onClose,
}) => {
  const { signin, setGoogleChallengeToken } = useAuth();
  const t = useTranslate();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success } = useToast();
  const { isLoading, setLoading } = useLoading();

  const [localEmail, setLocalEmail] = useState(email);
  const [emailError, setEmailError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");

  // Read session message from URL params
  const message = searchParams.get("message");
  const [dismissedMessage, setDismissedMessage] = useState<string | null>(
    null,
  );
  const displayMessage = dismissedMessage === message ? "" : message || "";

  // Clear message param when dialog closes or user interacts
  const clearMessageParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("message");
    window.history.replaceState({}, "", url.toString());
  };

  // Clear message when user starts typing or interacts
  const handleEmailChange = (value: string) => {
    setLocalEmail(value);
    setEmailError("");
    updateUrl({ email: value });
    if (displayMessage) {
      setDismissedMessage(message);
      clearMessageParam();
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError(t(AppLocales.Auth.Initial.InvalidEmail));
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(localEmail)) return;
    setLoading(true);
    try {
      const result = await UserController.peekUser(localEmail);

      switch (result) {
        case USER_PEEK_STATUS.EXISTS_CONFIRMED:
          // Existing confirmed user
          navigateToStep(DialogAuthSteps.SIGNIN_PASSWORD, {
            email: localEmail,
          });
          break;

        case USER_PEEK_STATUS.EXISTS_UNCONFIRMED:
          // Existing unconfirmed user - send new OTP and go to confirm
          await AuthController.sendConfirmationEmail(localEmail);

          navigateToStep(DialogAuthSteps.CONFIRM_EMAIL, {
            email: localEmail,
          });
          break;

        case USER_PEEK_STATUS.NOT_EXISTS:
          // New user
          navigateToStep(DialogAuthSteps.SIGNUP_PASSWORD_CREATE, {
            email: localEmail,
          });
          break;

        case USER_PEEK_STATUS.DISCARDED:
          setEmailError(t(AppLocales.Auth.Initial.AccountDiscarded));
          break;
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : t(AppLocales.Auth.Initial.UserCheckFailed),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");

      try {
        const result = await AuthController.signInWithGoogle(
          tokenResponse.access_token,
        );

        if (result.success && result.token && result.user) {
          // Existing user - sign in directly
          signin(result.token, result.user);
          void AnalyticsService.logSignIn(ANALYTICS_AUTH_METHODS.GOOGLE);
          success(t(AppLocales.Auth.Initial.GoogleSignInSuccess));
          onClose();
          navigate(AppRoutes.client.protected.HOME);
        } else if (result.passwordRequired && result.challengeToken) {
          // New user - show password setup
          setGoogleChallengeToken(result.challengeToken);
          void AnalyticsService.logBeginOnboarding(
            ANALYTICS_AUTH_METHODS.GOOGLE,
          );

          navigateToStep(DialogAuthSteps.SIGNUP_PASSWORD_CREATE, {
            email: result.user?.email || "",
          });
        } else {
          setError(
            result.errorMessage ||
              t(AppLocales.Auth.Initial.GoogleSignInFailed),
          );
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : t(AppLocales.Auth.Initial.GoogleSignInFailed),
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setIsBlocked(true);
      setError(t(AppLocales.Auth.Initial.GoogleSignInRetry));
    },
  });

  const handleClose = () => {
    clearMessageParam();
    onClose();
  };

  return (
    <Dialog
      isOpen={true}
      onClose={handleClose}
      title={t(AppLocales.Auth.Initial.Title)}
      className="max-w-md"
    >
      <p className="text-body-s text-base-content opacity-70 text-center mb-4">
        {t(AppLocales.Auth.Initial.Description)}
      </p>
      <div className="space-y-4">
        <GoogleButton
          onClick={() => handleGoogleSignIn()}
          isLoading={isLoading}
        >
          {t(AppLocales.Auth.Initial.ContinueWithGoogle)}
        </GoogleButton>
        {isBlocked && (
          <div className="space-y-4">
            <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-center">
              <p className="text-error font-medium">
                ⚠️ {t(AppLocales.Auth.Initial.AdBlockerTitle)}
              </p>
              <p className="text-body-s text-base-content/70 mt-1">
                {t(AppLocales.Auth.Initial.AdBlockerDescription)}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              fullWidth
            >
              {t(AppLocales.Auth.Initial.Retry)}
            </Button>
          </div>
        )}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-base-300" />
          </div>
          <div className="relative flex justify-center text-body-s">
            <span className="px-3 bg-base-100 text-base-content opacity-60">
              {t(AppLocales.Auth.Initial.Or)}
            </span>
          </div>
        </div>
        <FormContainer onSubmit={handleEmailSubmit} className="space-y-4">
          <TextInput
            id="email"
            type="email"
            value={localEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder={t(AppLocales.Auth.Shared.EmailPlaceholder)}
            label={t(AppLocales.Auth.Shared.EmailLabel)}
            error={emailError}
            helperText={t(AppLocales.Auth.Initial.EmailHelper)}
            required
            fullWidth
            disabled={isLoading}
          />
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading
              ? t(AppLocales.Auth.Initial.Checking)
              : t(AppLocales.Auth.Shared.Continue)}
          </Button>
        </FormContainer>
        {displayMessage && (
          <p className="text-caption text-warning text-center">
            {displayMessage}
          </p>
        )}
        {error && (
          <p className="text-caption text-error text-center">{error}</p>
        )}
      </div>
    </Dialog>
  );
};
