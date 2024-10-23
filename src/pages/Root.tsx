import React from "react";
import PageLayout from "./PageLayout";
import { useAuth } from "../contexts";
import { Button, SignOutBtn } from "../components";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";

const Root: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <PageLayout>
      Landing Page
      <div className="w-48">
        {isAuthenticated ? (
          <SignOutBtn />
        ) : (
          <Button
            variant="primary"
            onClick={() => navigate(AppRoutes.client.public.SIGN_IN)}
          >
            Sign In
          </Button>
        )}
      </div>
    </PageLayout>
  );
};

export default Root;
