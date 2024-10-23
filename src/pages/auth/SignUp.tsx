import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import {
  AlertMessage,
  FormContainer,
  Button,
  TextInput,
  LinkText,
} from "../../components";
import { PageLayout } from "..";
import { useTranslation } from "react-i18next";
import { LocaleKeys } from "../../locales/locales";
import authService from "../../services/authService";

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.signUpWithEmail(
      email,
      password,
      passwordConfirmation,
      setError,
      navigate
    );
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
        <Button variant="primary" type="submit">
          {t(LocaleKeys.SignUpButton)}
        </Button>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t(LocaleKeys.SignUpSignInPrompt)}{" "}
          <LinkText
            className="mt-4"
            to={AppRoutes.client.public.SIGN_IN}
            label={LocaleKeys.SignUpSignInLink}
          />
        </p>
      </FormContainer>
    </PageLayout>
  );
};

export default SignUp;
