import React, { useState } from "react";
import {
  AlertMessage,
  FormContainer,
  TextButton,
  TextInput,
  TextLink,
} from "../../components";
import { useCountdown } from "../../hooks";
import { PageLayout } from "..";
import { authController } from "../../controllers";
import AppRoutes from "../../AppRoutes";
import { useLocalization } from "../../hooks";

const ForgotPasswordPage: React.FC = () => {
  const { t, AppLocales } = useLocalization();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { countdown, isCooldown, startCountdown } = useCountdown(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authController.sendForgotPasswordMail(
      email,
      setError,
      setMessage,
      startCountdown
    );
  };

  return (
    <PageLayout>
      <FormContainer title="Forgot Password" onSubmit={handleSubmit}>
        {message && <AlertMessage type="success" message={message} />}
        {error && <AlertMessage type="error" message={error} />}
        <TextInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextButton
          variant="primary"
          type="submit"
          disabled={isCooldown}
          label={isCooldown ? `Re-send (${countdown}s)` : t(AppLocales.Submit)}
        />
        <TextLink
          className="mt-4"
          to={AppRoutes.client.public.SIGN_IN}
          label={AppLocales.GoBack}
        />
      </FormContainer>
    </PageLayout>
  );
};

export default ForgotPasswordPage;
