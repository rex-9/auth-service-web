import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../../contexts";
import authService from "../../services/auth.service";
import { TextButton } from "..";
import { useLocalization } from "../../hooks";

const SignOutBtn: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const { AppLocales } = useLocalization();

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
