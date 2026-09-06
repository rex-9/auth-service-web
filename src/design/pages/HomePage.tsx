import React from "react";
import { SignOutButton, Button } from "../components";
import { ButtonVariants } from "../constants";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { useAuth } from "../../contexts";
import { hasAdminRole } from "../../modules/admin/role";
import { DevTestButtons } from "../../modules/log/components/DevTestButtons";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const canAccessAdmin = hasAdminRole(currentUser?.role_names);

  return (
    <div className="w-full max-w-sm space-y-4">
      {canAccessAdmin && (
        <Button
          variant={ButtonVariants.PRIMARY}
          fullWidth
          onClick={() => navigate(AppRoutes.client.protected.admin.HOME)}
        >
          🛡️ Admin Dashboard
        </Button>
      )}

      <Button
        variant={ButtonVariants.SECONDARY}
        fullWidth
        onClick={() => navigate(AppRoutes.client.protected.PAYMENT)}
      >
        💳 View Plans & Pricing
      </Button>

      <Button
        variant={ButtonVariants.SECONDARY}
        fullWidth
        onClick={() => navigate(AppRoutes.client.protected.AI)}
      >
        🤖 AI Assistant
      </Button>

      <DevTestButtons />

      <SignOutButton />
    </div>
  );
};

export default HomePage;
