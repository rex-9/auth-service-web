import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../../contexts";
import { useTranslation } from "react-i18next";
import { LocaleKeys } from "../../locales/locales";
import authService from "../../services/authService";
import { Button } from "..";

const SignOutBtn: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await authService.signOut();
    if (currentUser?.provider === "google") {
      googleLogout();
    }
    logout();
    console.log("logged out successfully.");
  };

  return <Button onClick={handleLogout}>{t(LocaleKeys.SignOutButton)}</Button>;
};

export default SignOutBtn;
