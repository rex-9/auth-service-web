// src/design/components/button/Button.tsx

import React from "react";
import { cn } from "../../helpers";
import {
  ButtonVariant,
  ButtonVariants,
  ComponentSize,
  ComponentSizes,
} from "../../constants";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
  variant = ButtonVariants.PRIMARY,
  size = ComponentSizes.MD,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...props
}) => {
  const isNeon = variant === ButtonVariants.NEON && !disabled && !isLoading;

  const variants: Record<ButtonVariant, string> = {
    // Primary: Normal state has border with coral text -> Hover turns solid coral with bright neon box shadow (Pic 1)
    [ButtonVariants.PRIMARY]:
      "border border-glass-border bg-glass-tag-bg text-primary font-bold tracking-wider hover:bg-primary hover:text-white hover:border-primary hover:shadow-neon-lg active:scale-95 transition-all duration-300",

    // Neon: Normal state has frosted glass + running animated laser borders + glowing text (Pic 2) -> Hover turns solid coral with large neon aura (Pic 3)
    [ButtonVariants.NEON]:
      "relative overflow-hidden border border-glass-border bg-glass-card backdrop-blur-md text-glow-white font-bold tracking-wider [text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_20px_var(--color-primary-dark)] hover:bg-primary hover:text-white hover:border-primary hover:shadow-neon-lg hover:[text-shadow:0_0_8px_#fff2f4,0_0_16px_var(--color-primary)] active:scale-95 transition-all duration-400",

    [ButtonVariants.SECONDARY]:
      "border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20 transition-all duration-300",

    [ButtonVariants.TERTIARY]:
      "text-base-content hover:bg-base-200 active:bg-base-300 transition-all duration-200",
  };

  const sizes: Partial<Record<ComponentSize, string>> = {
    [ComponentSizes.XS]: "px-2 py-1 text-caption",
    [ComponentSizes.SM]: "px-3 py-1 text-body-s",
    [ComponentSizes.MD]: "px-4 py-2 text-body-m",
    [ComponentSizes.LG]: "px-6 py-3 text-body-l",
    [ComponentSizes.XL]: "px-8 py-4 text-body-l font-bold",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      {...props}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap select-none",
        "font-medium transition-all duration-200 ease-out",
        "rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/40",
        variants[variant],
        sizes[size] || sizes[ComponentSizes.MD],
        fullWidth && "w-full",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
        isLoading && "cursor-wait",
        className,
      )}
    >
      {isNeon && (
        <>
          <span className="absolute top-0 -left-full w-full h-px bg-gradient-to-r from-transparent to-primary animate-neon-border-1" />
          <span className="absolute -top-full right-0 w-px h-full bg-gradient-to-b from-transparent to-primary animate-neon-border-2" />
          <span className="absolute bottom-0 -right-full w-full h-px bg-gradient-to-l from-transparent to-primary animate-neon-border-3" />
          <span className="absolute -bottom-full left-0 w-px h-full bg-gradient-to-t from-transparent to-primary animate-neon-border-4" />
        </>
      )}
      {isLoading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        children
      )}
    </button>
  );
};
