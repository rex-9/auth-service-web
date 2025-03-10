import React from "react";
import { useLocalization } from "../hooks";
import { DropdownPicker } from ".";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useLocalization();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageOptions = [
    { value: "en", label: "🇺🇸 English" },
    { value: "es", label: "🇪🇸 Español" },
    // Add more languages as needed
  ];

  return (
    <DropdownPicker
      options={languageOptions}
      value={i18n.language}
      onChange={changeLanguage}
    />
  );
};

export default LanguageSwitcher;
