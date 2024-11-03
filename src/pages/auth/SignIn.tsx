import React, { useEffect, useState } from "react";
import AppRoutes from "../../AppRoutes";
import { useAuth } from "../../contexts";
import {
  GoogleSignIn,
  TextInput,
  AlertMessage,
  TextButton,
  FormContainer,
  TextLink,
} from "../../components";
import PageLayout from "../PageLayout";
import { useTranslation } from "react-i18next";
import { AppLocales } from "../../locales/app_locales";
import authController from "../../controllers/authController";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loginKey, setLoginKey] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthToken = async () => {
      const params = new URLSearchParams(location.search);
      const authToken = params.get("auth_token");
      const errorParam = params.get("error");
      if (authToken) {
        await authController.signInWithToken(authToken, setError, login);
      } else if (errorParam) {
        setError(errorParam);
      }
    };

    handleAuthToken();
  }, [location, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authController.signInWithEmailOrUsername(
      loginKey,
      password,
      setError,
      setMessage,
      login,
      navigate
    );
  };

  return (
    <PageLayout>
      <FormContainer title={AppLocales.SignInTitle} onSubmit={handleSubmit}>
        {message && <AlertMessage type="success" message={message} />}
        {error && <AlertMessage type="error" message={error} />}
        <TextInput
          id="email-or-username"
          label={AppLocales.SignInEmailOrUsernameLabel}
          type="text"
          value={loginKey}
          onChange={(e) => setLoginKey(e.target.value.toLowerCase())}
          required
        />
        <TextInput
          id="password"
          label={AppLocales.SignInPasswordLabel}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextButton
          variant="primary"
          type="submit"
          label={AppLocales.SignInButton}
        />
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {t(AppLocales.SignInSignUpPrompt)}{" "}
          <TextLink
            to={AppRoutes.client.public.SIGN_UP}
            label={AppLocales.SignInSignUpLink}
          />
        </p>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t(AppLocales.SignInForgotPasswordPrompt)}{" "}
          <TextLink
            to={AppRoutes.client.public.FORGOT_PASSWORD}
            label={AppLocales.SignInForgotPasswordLink}
          />
        </p>
        <div className="mt-6">
          <GoogleSignIn setError={setError} login={login} />
        </div>
      </FormContainer>
    </PageLayout>
  );
};

export default SignIn;
