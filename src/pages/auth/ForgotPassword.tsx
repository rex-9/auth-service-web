import React, { useState } from "react";
import { api } from "../../services/api";
import AppRoutes from "../../AppRoutes";
import {
  AlertMessage,
  FormContainer,
  PrimaryBtn,
  TextInput,
} from "../../components";
import { useCountdown } from "../../utils";
import { PageLayout } from "..";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { countdown, isCooldown, startCountdown } = useCountdown(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await api.post<{
      status: {
        code: number;
        success: boolean;
        message: string;
        error?: string;
      };
    }>(AppRoutes.server.public.FORGOT_PASSWORD, { email });
    const { status } = response.data || {};
    if (status?.success) {
      setError("");
      setMessage(status.message);
      startCountdown();
    } else {
      setError(status?.error ?? "Failed to send password reset email.");
    }
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
