import { useTranslation } from "react-i18next";
import { AppLocales } from "../locales/app_locales";

export const useLocalization = () => {
  const { t, i18n } = useTranslation();
  return { t, i18n, AppLocales };
};
