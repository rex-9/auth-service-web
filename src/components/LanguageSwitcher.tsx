import React from "react";
import { useTranslation } from "react-i18next";
import TextButton from "./TextButton";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex">
      <TextButton
        variant="primary"
        className="m-2"
        onClick={() => changeLanguage("en")}
        label="English"
      />
      <TextButton
        variant="primary"
        className="m-2"
        onClick={() => changeLanguage("es")}
        label="Español"
      />
    </div>
  );
};

export default LanguageSwitcher;
