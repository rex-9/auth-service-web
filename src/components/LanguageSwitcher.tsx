import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex">
      <Button
        variant="primary"
        className="m-2"
        onClick={() => changeLanguage("en")}
      >
        English
      </Button>
      <Button
        variant="primary"
        className="m-2"
        onClick={() => changeLanguage("es")}
      >
        Español
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
