import React from "react";
import clsx from "clsx";

interface PrimaryBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({
  children,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = "w-full py-2 px-4 rounded-lg shadow";
  const enabledClasses =
    "bg-primary-light text-text-light hover:bg-primary-dark dark:bg-primary-dark dark:text-text-dark dark:hover:bg-primary-light";
  const disabledClasses =
    "bg-gray-400 text-gray-700 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400";

  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        baseClasses,
        disabled ? disabledClasses : enabledClasses,
        className
      )}
    >
      {children}
    </button>
  );
};

export default PrimaryBtn;
