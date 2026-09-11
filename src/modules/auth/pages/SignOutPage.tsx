import React, { useEffect } from "react";
import { useAuth } from "../../../contexts";
import { googleLogout } from "@react-oauth/google";
import { AuthController } from "../../../modules/auth";
import { AnalyticsService } from "../../../services";

let isSignOutInProgress = false;

export const SignOutPage: React.FC = () => {
  const { signout, currentUser, token } = useAuth();

  const handleSignout = React.useCallback(async () => {
    await AnalyticsService.logSignOut();
    if (token) {
      await AuthController.signOut();
    }

    if (currentUser?.provider === "google") {
      googleLogout();
    }

    signout();
  }, [token, currentUser, signout]);

  useEffect(() => {
    if (isSignOutInProgress) return;

    isSignOutInProgress = true;
    void handleSignout().finally(() => {
      isSignOutInProgress = false;
    });
  }, [handleSignout]);

  return null; // No UI
};
