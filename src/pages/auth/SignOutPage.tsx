import React, { useEffect } from "react";
import { useAuth } from "../../contexts";
import { googleLogout } from "@react-oauth/google";
import authController from "../../controllers/auth.controller";
import { useToast } from "../../hooks";
const SignOutPage: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    await authController.signOut(
      () => {
        if (currentUser?.provider === "google") {
          googleLogout();
        }
        logout();
        toast.success("logged out successfully.");
      },
      (error) => {
        toast.error(`sign out failed: ${error}`);
      }
    );
  };

  useEffect(() => {
    handleLogout();
  }, [logout]);

  return null; // No UI
};

export default SignOutPage;
