import React from "react";
import { clsx } from "ts-clsx";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = "p-1 rounded-full shadow";
  const enabledClasses =
    "cursor-pointer shadow-none bg-transparent hover:bg-hover-light dark:hover:bg-hover-dark";
  const disabledClasses = "shadow-none bg-transparent cursor-not-allowed";

  const defaultWidthClass = "w-8";
  const defaultHeightClass = "h-8";
  const hasWidthClass = className?.includes("w-");
  const hasHeightClass = className?.includes("h-");

  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        baseClasses,
        disabled ? disabledClasses : enabledClasses,
        !hasWidthClass && defaultWidthClass,
        !hasHeightClass && defaultHeightClass,
        className
      )}
    >
      {icon}
    </button>
  );
};

export default IconButton;
