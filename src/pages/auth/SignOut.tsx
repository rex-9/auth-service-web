import React, { useEffect } from "react";
import { useAuth } from "../../contexts";
import { googleLogout } from "@react-oauth/google";
import authService from "../../services/authService";

const SignOut: React.FC = () => {
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    await authService.signOut();
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

export default SignOut;
