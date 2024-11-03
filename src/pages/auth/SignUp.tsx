import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import {
  AlertMessage,
  FormContainer,
  GoogleSignIn,
  TextButton,
  TextInput,
  TextLink,
} from "../../components";
import { PageLayout } from "..";
import { useTranslation } from "react-i18next";
import { AppLocales } from "../../locales/app_locales";
import authController from "../../controllers/authController";
import { useAuth } from "../../contexts";

const SignUp: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authController.signUpWithEmail(
      username,
      email,
      password,
      passwordConfirmation,
      setError,
      navigate
    );
  };

  return (
    <PageLayout>
      <FormContainer title={AppLocales.SignUpTitle} onSubmit={handleSubmit}>
        {error && <AlertMessage type="error" message={error} />}
        <TextInput
          id="username"
          label={AppLocales.SignUpUsernameLabel}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          required
        />
        <TextInput
          id="email"
          label={AppLocales.SignUpEmailLabel}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextInput
          id="password"
          label={AppLocales.SignUpPasswordLabel}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextInput
          id="passwordConfirmation"
          label={AppLocales.SignUpPasswordConfirmationLabel}
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <TextButton
          variant="primary"
          type="submit"
          label={AppLocales.SignUpButton}
        />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t(AppLocales.SignUpSignInPrompt)}{" "}
          <TextLink
            className="mt-4"
            to={AppRoutes.client.public.SIGN_IN}
            label={AppLocales.SignUpSignInLink}
          />
        </p>
        <div className="mt-6">
          <GoogleSignIn setError={setError} login={login} />
        </div>
      </FormContainer>
    </PageLayout>
  );
};

export default SignUp;
