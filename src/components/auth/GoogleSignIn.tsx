import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AlertMessage, Button } from "../../components";
import { useLocalization, useToast } from "../../hooks";
import { authController } from "../../controllers";
import { User } from "../../models";

interface GoogleSignInProps {
  login: (token: string, user: User) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ login }) => {
  const { t, AppLocales } = useLocalization();
  const toast = useToast();
  const [isBlocked, setIsBlocked] = useState(false);

  const handleGoogleSuccess = async (response: any) => {
    if (response.credential) {
      await authController.signInWithGoogle(
        response.credential,
        (response) => {
          login(response.data!.token, response.data!.user);
          toast.success("Sign in successful");
        },
        (error) => toast.error(`Sign in failed: ${error}`)
      );
    }
  };

  const handleGoogleFailure = () => {
    toast.error(t(AppLocales.AUTH.SIGN_IN.GOOGLE_FAILURE));
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
          <Button
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
