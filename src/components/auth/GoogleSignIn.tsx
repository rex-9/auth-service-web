import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AlertMessage, PrimaryBtn } from "../../components";

interface GoogleSignInProps {
  onSuccess: (response: any) => void;
  onFailure: () => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onSuccess,
  onFailure,
}) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const handleLoginError = () => {
    setIsBlocked(true);
    onFailure();
  };

  return (
    <div>
      {isBlocked ? (
        <div>
          <AlertMessage
            type="error"
            message="It looks like an ad blocker or privacy extension is blocking the Google login. Please disable it and try again."
          />
          <PrimaryBtn onClick={() => window.location.reload()}>
            Retry
          </PrimaryBtn>
        </div>
      ) : (
        <GoogleLogin onSuccess={onSuccess} onError={handleLoginError} />
      )}
    </div>
  );
};

export default GoogleSignIn;