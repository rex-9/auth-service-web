import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { api } from "../../services/api";
import {
  AlertMessage,
  FormContainer,
  PrimaryBtn,
  TextInput,
} from "../../components";
import { PageLayout } from "..";
import { useTranslation } from "react-i18next";
import { LocaleKeys } from "../../locales/locales";

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await api.post<{ message: string }>(
      AppRoutes.server.public.SIGN_UP,
      {
        email,
        password,
        password_confirmation: passwordConfirmation,
      }
    );
    if (error) {
      setError(error);
    } else {
      setError("");
      navigate(`${AppRoutes.client.public.CONFIRM_EMAIL}?email=${email}`);
    }
  };

  return (
    <PageLayout>
      <FormContainer title={t(LocaleKeys.SignUpTitle)} onSubmit={handleSubmit}>
        {error && <AlertMessage type="error" message={error} />}
        <TextInput
          id="email"
          label={t(LocaleKeys.SignUpEmailLabel)}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextInput
          id="password"
          label={t(LocaleKeys.SignUpPasswordLabel)}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextInput
          id="passwordConfirmation"
          label={t(LocaleKeys.SignUpPasswordConfirmationLabel)}
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <PrimaryBtn type="submit">{t(LocaleKeys.SignUpButton)}</PrimaryBtn>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t(LocaleKeys.SignUpSignInPrompt)}{" "}
          <Link
            to={AppRoutes.client.public.SIGN_IN}
            className="text-primary-light dark:text-primary-dark hover:underline"
          >
            {t(LocaleKeys.SignUpSignInLink)}
          </Link>
        </p>
      </FormContainer>
    </PageLayout>
  );
};

export default SignUp;
