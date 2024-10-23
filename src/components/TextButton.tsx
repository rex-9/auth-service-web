import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "flat";
}

const TextButton: React.FC<TextButtonProps> = ({
  label,
  disabled,
  className,
  variant = "flat",
  ...props
}) => {
  const { t } = useTranslation();

  const baseClasses = "py-2 px-4 rounded-lg shadow";
  const primaryEnabledClasses =
    "w-full cursor-pointer bg-primary-light text-text-light hover:bg-primary-dark dark:bg-primary-dark dark:text-text-dark dark:hover:bg-primary-light";
  const primaryDisabledClasses =
    "w-full bg-gray-400 text-text-dark cursor-not-allowed dark:bg-gray-600 dark:text-gray-400";
  const flatEnabledClasses =
    "w-fit cursor-pointer shadow-none bg-transparent text-text-light hover:bg-hover-light dark:text-text-dark dark:hover:bg-hover-dark";
  const flatDisabledClasses =
    "w-fit shadow-none bg-transparent text-text-dark cursor-not-allowed dark:text-gray-400";

  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        baseClasses,
        variant === "primary"
          ? disabled
            ? primaryDisabledClasses
            : primaryEnabledClasses
          : disabled
          ? flatDisabledClasses
          : flatEnabledClasses,
        className
      )}
    >
      {t(label)}
    </button>
  );
};

export default TextButton;
