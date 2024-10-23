import React, { useEffect, useState } from "react";
import AppRoutes from "../../AppRoutes";
import { useAuth } from "../../contexts";
import {
  GoogleSignIn,
  TextInput,
  AlertMessage,
  Button,
  FormContainer,
  LinkText,
} from "../../components";
import PageLayout from "../PageLayout";
import { useTranslation } from "react-i18next";
import { LocaleKeys } from "../../locales/locales";
import authService from "../../services/authService";

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthToken = async () => {
      const params = new URLSearchParams(location.search);
      const authToken = params.get("auth_token");
      const errorParam = params.get("error");
      if (authToken) {
        await authService.signInWithToken(authToken, setError, login);
      } else if (errorParam) {
        setError(errorParam);
      }
    };

    handleAuthToken();
  }, [location, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.signInWithEmail(email, password, setError, login);
  };

  const handleGoogleSuccess = async (response: any) => {
    if (response.credential) {
      await authService.signInWithGoogle(response.credential, setError, login);
    }
  };

  const handleGoogleFailure = () => {
    setError(t(LocaleKeys.SignInGoogleFailure));
  };

  return (
    <PageLayout>
      <FormContainer title={t(LocaleKeys.SignInTitle)} onSubmit={handleSubmit}>
        {error && <AlertMessage type="error" message={error} />}
        <TextInput
          id="email"
          label={t(LocaleKeys.SignInEmailLabel)}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextInput
          id="password"
          label={t(LocaleKeys.SignInPasswordLabel)}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button variant="primary" type="submit">
          {t(LocaleKeys.SignInButton)}
        </Button>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {t(LocaleKeys.SignInSignUpPrompt)}{" "}
          <LinkText
            to={AppRoutes.client.public.SIGN_UP}
            label={LocaleKeys.SignInSignUpLink}
          />
        </p>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t(LocaleKeys.SignInForgotPasswordPrompt)}{" "}
          <LinkText
            to={AppRoutes.client.public.FORGOT_PASSWORD}
            label={LocaleKeys.SignInForgotPasswordLink}
          />
        </p>
        <div className="mt-6">
          <GoogleSignIn
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
          />
        </div>
      </FormContainer>
    </PageLayout>
  );
};

export default SignIn;
