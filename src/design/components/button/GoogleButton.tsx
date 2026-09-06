// src/design/components/button/GoogleButton.tsx

import React from "react";
import { cn } from "../../helpers";
import { icons } from "../../../assets";
import { Image } from "..";

export interface IGoogleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const GoogleButton: React.FC<IGoogleButtonProps> = ({
  isLoading = false,
  fullWidth = true,
  disabled,
  type = "button",
  className,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      {...props}
      className={cn(
        "px-4 py-2 rounded-md",
        "font-medium text-body-m transition-all duration-200 ease-out",
        "bg-base-200 text-base-content border-2 border-base-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40",
        "flex items-center justify-center gap-3",
        "hover:bg-base-300 active:scale-95",
        (isLoading || disabled) && "opacity-50 cursor-not-allowed",
        fullWidth && "w-full",
        className,
      )}
    >
      <Image asset={icons.google} className="w-6 h-6 object-contain" />
      <span>{isLoading ? "Signing in..." : children}</span>
    </button>
  );
};
