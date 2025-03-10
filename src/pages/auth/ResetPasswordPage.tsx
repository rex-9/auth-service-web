import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertMessage, TextButton, TextInput } from "../../components";
import { PageLayout } from "../../pages";
import FormContainer from "../../components/FormContainer";
import { authController } from "../../controllers";
import { useLocalization } from "../../hooks";

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { AppLocales } = useLocalization();

  const token = new URLSearchParams(location.search).get(
    "reset_password_token"
  );
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      await authController.resetPassword(
        token,
        password,
        passwordConfirmation,
        setError,
        setMessage,
        navigate
      );
    } else {
      setError(`Invalid reset password token: ${token}`);
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
        <TextButton variant="primary" type="submit" label={AppLocales.Submit} />
      </FormContainer>
    </PageLayout>
  );
};

export default ResetPasswordPage;
