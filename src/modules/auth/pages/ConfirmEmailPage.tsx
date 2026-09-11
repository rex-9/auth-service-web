// src/design/pages/auth/ConfirmEmail.tsx

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useToast } from "../../../contexts";
import AppRoutes from "../../../AppRoutes";
import { AuthController } from "../../../modules/auth";
import { AppLocales, useTranslate } from "../../../locales";
import { DialogAuthSteps } from "..";
import { AnalyticsService } from "../../../services";
import { ANALYTICS_AUTH_METHODS } from "../../../constants";

export const ConfirmEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();
  const t = useTranslate();
  const { success } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authToken = params.get("auth_token");
    const error = params.get("error");
    const email = params.get("email") || params.get("signin_key");

    // Handle auth_token from email confirmation link
    if (authToken) {
      (async () => {
        const result = await AuthController.signInWithToken(authToken);
        if (result.success && result.token && result.user) {
          signin(result.token, result.user);
          void AnalyticsService.logCompleteOnboarding(
            ANALYTICS_AUTH_METHODS.EMAIL,
          );
          success(t(AppLocales.Auth.ConfirmEmail.LinkConfirmed));
          navigate(AppRoutes.client.protected.HOME, { replace: true });
        } else {
          console.error("error", `Confirmation failed: ${result.error}`);
          const url = AppRoutes.client.public.SIGN_IN;
          navigate(url, { replace: true });
        }
      })();
      return;
    }

    // Handle error from confirmation link
    if (error) {
      console.error("error", `Confirmation failed: ${error}`);
      const url = AppRoutes.client.public.SIGN_IN;
      navigate(url, { replace: true });
      return;
    }

    // If email is provided, open confirm email dialog
    if (email) {
      navigate(
        AppRoutes.buildDialogUrl(DialogAuthSteps.CONFIRM_EMAIL, {
          email,
        }),
        { replace: true },
      );
      return;
    }

    // Fallback: go to initial auth dialog
    const url = AppRoutes.client.public.SIGN_IN;
    navigate(url, { replace: true });
  }, [navigate, location, signin, success, t]);

  return null;
};
