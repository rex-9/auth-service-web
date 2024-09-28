import React, { useState } from "react";
import {
  AlertMessage,
  FormContainer,
  PrimaryBtn,
  TextInput,
} from "../../components";
import { useCountdown } from "../../utils";
import { PageLayout } from "..";
import authService from "../../services/authService";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { countdown, isCooldown, startCountdown } = useCountdown(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.sendForgotPasswordMail(
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
        <PrimaryBtn type="submit" disabled={isCooldown}>
          {isCooldown ? `Re-send (${countdown}s)` : "Submit"}
        </PrimaryBtn>
      </FormContainer>
    </PageLayout>
  );
};

export default ForgotPassword;
