import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../../contexts";
import LocalStorageService from "../../services/LocalStorageService";
import { User } from "../../models";
import { useTranslation } from "react-i18next";
import { LocaleKeys } from "../../locales/locales";

const SignOutBtn: React.FC = () => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const user: User | null = LocalStorageService.getItem<User>("user");

  const handleGoogleLogout = () => {
    googleLogout();
    logout();
  };

  const handleNormalLogout = () => {
    logout();
  };

  return (
    <button
      onClick={
        user?.provider === "google" ? handleGoogleLogout : handleNormalLogout
      }
      className="text-primary-light dark:text-primary-dark"
    >
      {t(LocaleKeys.SignOutButton)}
    </button>
  );
};

export default SignOutBtn;
