import { FC } from "react";
import { useLocalization } from "../hooks/useLocalization";
import { FormSelect } from ".";
import { languages } from "../constants";

const LanguageSwitcher: FC = () => {
  const { i18n } = useLocalization();

  return (
    <FormSelect
      name="language"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      options={languages.map((lang) => ({
        value: lang.value,
        label: lang.label,
      }))}
    />
  );
};

export default LanguageSwitcher;
