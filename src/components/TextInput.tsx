import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface TextInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  containerClassName?: string;
  inputClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  required = false,
  placeholder,
  containerClassName,
  inputClassName,
}) => {
  const { t } = useTranslation();

  return (
    <div className={clsx("mb-4 w-full", containerClassName)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-light dark:text-text-dark"
      >
        {t(label)}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark sm:text-sm bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark",
          inputClassName
        )}
        required={required}
      />
    </div>
  );
};

export default TextInput;
