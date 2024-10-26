import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { useCountdown } from "../../utils";
import {
  AlertMessage,
  TextLink,
  TextInput,
  TextButton,
  FormContainer,
} from "../../components";
import PageLayout from "../PageLayout";
import authController from "../../controllers/authController";
import { AppLocales } from "../../locales/app_locales";
import { useAuth } from "../../contexts";

const ConfirmEmail: React.FC = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const { countdown, isCooldown, startCountdown } = useCountdown(30);
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");
    const authToken = params.get("auth_token");
    if (errorParam) {
      setError(errorParam);
    } else if (authToken) {
      setMessage("Email confirmed successfully. You are now signed in.");
    }
  }, [location]);

  const handleResendEmail = async () => {
    if (email && !isCooldown) {
      await authController.resendConfirmationEmail(
        email,
        setError,
        setMessage,
        startCountdown
      );
    }
  };

  const handleConfirmEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && confirmationCode) {
      await authController.confirmEmailWithCode(
        email,
        confirmationCode,
        setError,
        setMessage,
        login
      );
    }
  };

  return (
    <PageLayout>
      <FormContainer title={"Verify Email"} onSubmit={handleConfirmEmail}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
          {message && <AlertMessage type="success" message={message} />}
          {error && <AlertMessage type="error" message={error} />}
          <p className="mb-4">
            We have sent a verification email to {email}. Follow the
            instructions in your email to verify your account. If you can't find
            the email, check your spam folder or{" "}
            <a
              href="#"
              onClick={handleResendEmail}
              className={`text-primary-light dark:text-primary-dark hover:underline ${
                isCooldown
                  ? "pointer-events-none text-gray-500 dark:text-gray-400"
                  : ""
              }`}
            >
              {isCooldown ? `Resend (${countdown}s)` : "click here to resend"}
            </a>
            .
          </p>
          <p>
            Did you enter your email address incorrectly?{" "}
            <TextLink
              to={AppRoutes.client.public.SIGN_UP}
              label={AppLocales.GoBack}
            />
          </p>
          <div className="mt-4">
            <TextInput
              id="confirmation-code"
              label="Confirmation Code"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter 6-digit confirmation code"
            />
            <TextButton
              variant="primary"
              onClick={handleConfirmEmail}
              className="mt-2"
              label={AppLocales.Submit}
              disabled={confirmationCode.length !== 6}
            />
          </div>
        </div>
      </FormContainer>
    </PageLayout>
  );
};

export default ConfirmEmail;
