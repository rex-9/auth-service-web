import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AlertMessage, TextButton } from "../../components";
import { useTranslation } from "react-i18next";
import { AppLocales } from "../../locales/app_locales";
import authController from "../../controllers/authController";
import { IUser } from "../../types";

interface GoogleSignInProps {
  setError: (message: string) => void;
  login: (token: string, user: IUser) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ setError, login }) => {
  const { t } = useTranslation();
  const [isBlocked, setIsBlocked] = useState(false);

  const handleGoogleSuccess = async (response: any) => {
    if (response.credential) {
      await authController.signInWithGoogle(
        response.credential,
        setError,
        login
      );
    }
  };

  const handleGoogleFailure = () => {
    setError(t(AppLocales.SignInGoogleFailure));
  };

  const handleLoginError = () => {
    setIsBlocked(true);
    handleGoogleFailure();
  };

  return (
    <div>
      {isBlocked ? (
        <div>
          <AlertMessage
            type="error"
            message="It looks like an ad blocker or privacy extension is blocking the Google login. Please disable it and try again."
          />
          <TextButton
            variant="primary"
            onClick={() => window.location.reload()}
            label="Retry"
          />
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleLoginError}
        />
      )}
    </div>
  );
};

export default GoogleSignIn;
