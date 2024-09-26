import React from "react";
import { useTranslation } from "react-i18next";
import PrimaryBtn from "./PrimaryBtn";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex">
      <PrimaryBtn className="m-2" onClick={() => changeLanguage("en")}>
        English
      </PrimaryBtn>
      <PrimaryBtn className="m-2" onClick={() => changeLanguage("es")}>
        Español
      </PrimaryBtn>
    </div>
  );
};

export default LanguageSwitcher;
