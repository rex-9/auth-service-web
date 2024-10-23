import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../../contexts";
import { AppLocales } from "../../locales/app_locales";
import authService from "../../services/authService";
import { TextButton } from "..";

const SignOutBtn: React.FC = () => {
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    await authService.signOut();
    if (currentUser?.provider === "google") {
      googleLogout();
    }
    logout();
    console.log("logged out successfully.");
  };

  return <TextButton onClick={handleLogout} label={AppLocales.SignOutButton} />;
};

export default SignOutBtn;
