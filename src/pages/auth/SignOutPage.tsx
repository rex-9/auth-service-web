import React, { useEffect } from "react";
import { useAuth } from "../../contexts";
import { googleLogout } from "@react-oauth/google";
import authController from "../../controllers/auth.controller";

const SignOutPage: React.FC = () => {
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    await authController.signOut();
    if (currentUser?.provider === "google") {
      googleLogout();
    }
    logout();
    console.log("logged out successfully.");
  };

  useEffect(() => {
    handleLogout();
  }, [logout]);

  return null; // No UI
};

export default SignOutPage;
