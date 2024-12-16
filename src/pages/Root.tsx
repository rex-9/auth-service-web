import React from "react";
import PageLayout from "./PageLayout";
import { useAuth } from "../contexts";
import { TextButton, SignOutBtn } from "../components";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import { AppLocales } from "../locales/app_locales";

const Root: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <PageLayout>
      Landing Page
      <div className="w-48 flex flex-col justify-center items-center">
        {isAuthenticated ? (
          <SignOutBtn />
        ) : (
          <TextButton
            variant="primary"
            onClick={() => navigate(AppRoutes.client.public.SIGN_IN)}
            label={AppLocales.SignInButton}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Root;
