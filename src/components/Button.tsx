import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "flat";
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  className,
  variant = "flat",
  ...props
}) => {
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
      {children}
    </button>
  );
};

export default Button;
