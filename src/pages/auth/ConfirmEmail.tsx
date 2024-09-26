import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { api } from "../../services/api";
import { useCountdown } from "../../utils";
import { AlertMessage } from "../../components";
import PageLayout from "../PageLayout";

const ConfirmEmail: React.FC = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { countdown, isCooldown, startCountdown } = useCountdown(30);

  const handleResendEmail = async () => {
    if (email && !isCooldown) {
      const { data, error } = await api.get<{ message: string }>(
        `${AppRoutes.server.public.RESEND_VERIFY_EMAIL}?email=${email}`
      );
      if (error) {
        setError(error);
      } else {
        setError("");
        setMessage(data!.message);
        startCountdown();
      }
    }
  };

  return (
    <PageLayout>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Verify Email</h2>
        {message && <AlertMessage type="success" message={message} />}
        {error && <AlertMessage type="error" message={error} />}
        <p className="mb-4">
          We have sent a verification email to {email}. Click the link in your
          email to verify your account. If you can't find the email, check your
          spam folder or{" "}
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
          <Link
            to={AppRoutes.client.public.SIGN_UP}
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            Go back
          </Link>
        </p>
      </div>
    </PageLayout>
  );
};

export default ConfirmEmail;
