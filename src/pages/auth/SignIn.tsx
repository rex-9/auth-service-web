import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { useAuth } from "../../contexts";
import { api } from "../../services/api";
import {
  GoogleSignIn,
  TextInput,
  AlertMessage,
  PrimaryBtn,
  FormContainer,
} from "../../components";
import PageLayout from "../PageLayout";
import { User } from "../../models";
import { useTranslation } from "react-i18next";
import { LocaleKeys } from "../../locales/locales";

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
        try {
          const response = await api.post<{
            status: {
              code: number;
              success: boolean;
              message: string;
              error?: string;
            };
            data: { user: User; token: string };
          }>(AppRoutes.server.public.SIGN_IN_TOKEN, {
            token: authToken,
          });
          const { status, data } = response.data || {};
          if (status?.success && data) {
            setError("");
            login(data.token, data.user); // Update authentication state with token
          } else {
            setError(status?.error ?? "An error occurred during login.");
          }
        } catch (error) {
          setError("Failed to log in with the provided token.");
        }
      } else if (errorParam) {
        setError(errorParam);
      }
    };

    handleAuthToken();
  }, [location, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post<{
        status: {
          code: number;
          success: boolean;
          message: string;
          error?: string;
        };
        data: { user: User; token: string };
      }>(AppRoutes.server.public.SIGN_IN_EMAIL, { user: { email, password } });
      const { status, data } = response.data || {};
      if (status?.success && data) {
        setError("");
        login(data.token, data.user); // Update authentication state with token
      } else {
        setError(status?.error ?? "An error occurred during login.");
      }
    } catch (error) {
      setError(`An error occurred during login. error: ${error}`);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    if (response.credential) {
      const res = await api.post<{
        status: {
          code: number;
          success: boolean;
          message: string;
          error?: string;
        };
        data: { user: User; token: string };
      }>(AppRoutes.server.public.SIGN_IN_GOOGLE, {
        token: response.credential,
      });
      const { status, data } = res.data || {};
      if (status?.success && data) {
        setError("");
        login(data.token, data.user); // Update authentication state with token
      } else {
        setError(status?.error ?? "An error occurred during login.");
      }
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
        <PrimaryBtn type="submit">{t(LocaleKeys.SignInButton)}</PrimaryBtn>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          {t(LocaleKeys.SignInSignUpPrompt)}{" "}
          <Link
            to={AppRoutes.client.public.SIGN_UP}
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            {t(LocaleKeys.SignInSignUpLink)}
          </Link>
        </p>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {t(LocaleKeys.SignInForgotPasswordPrompt)}{" "}
          <Link
            to={AppRoutes.client.public.FORGOT_PASSWORD}
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            {t(LocaleKeys.SignInForgotPasswordLink)}
          </Link>
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
