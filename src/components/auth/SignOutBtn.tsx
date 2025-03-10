import React from "react";
import { Button } from "..";
import { useLocalization } from "../../hooks";
import { authController } from "../../controllers";
import { googleLogout } from "@react-oauth/google";
import { useAuth } from "../../contexts";

const SignOutBtn: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const { AppLocales } = useLocalization();

  const handleLogout = async () => {
    await authController.signOut();
    if (currentUser?.provider === "google") {
      googleLogout();
    }
    logout();
    console.log("logged out successfully.");
  };

  return (
    <Button
      variant="primary"
      onClick={handleLogout}
      label={AppLocales.AUTH.SIGN_OUT}
    />
  );
};

export default SignOutBtn;
