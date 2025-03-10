import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AlertMessage, TextButton } from "../../components";
import { useLocalization } from "../../hooks";
import { authController } from "../../controllers";
import { User } from "../../models";

interface GoogleSignInProps {
  setError: (message: string) => void;
  login: (token: string, user: User) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ setError, login }) => {
  const { t, AppLocales } = useLocalization();
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
