import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../services/api";
import AppRoutes from "../../AppRoutes";
import { AlertMessage, PrimaryBtn, TextInput } from "../../components";
import { PageLayout } from "../../pages";
import FormContainer from "../../components/FormContainer";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get(
    "reset_password_token"
  );
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await api.put<{
      status: {
        code: number;
        success: boolean;
        message: string;
        error?: string;
      };
    }>(AppRoutes.server.public.RESET_PASSWORD, {
      user: {
        reset_password_token: token,
        password,
        password_confirmation: passwordConfirmation,
      },
    });
    const { status } = response.data || {};
    if (status?.success) {
      setError("");
      setMessage(status.message);
      navigate(AppRoutes.client.public.SIGN_IN);
    } else {
      setError(status?.error ?? "An error occurred during resending email.");
    }
  };

  return (
    <PageLayout>
      <FormContainer title="Reset Password" onSubmit={handleSubmit}>
        {message && <AlertMessage type="success" message={message} />}
        {error && <AlertMessage type="error" message={error} />}
        <TextInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextInput
          id="passwordConfirmation"
          label="Password Confirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <PrimaryBtn type="submit">Submit</PrimaryBtn>
      </FormContainer>
    </PageLayout>
  );
};

export default ResetPassword;
