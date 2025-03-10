import { FC, ButtonHTMLAttributes } from "react";
import { useLocalization } from "../hooks";

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "icon";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button: FC<TextButtonProps> = ({
  label,
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  ...props
}) => {
  const { t } = useLocalization();

  if (variant === "icon") {
    return (
      <button
        className={`rounded-lg transition-colors ${className}`}
        {...props}
      >
        {label ? t(label) : children}
      </button>
    );
  }

  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    ghost: "btn-ghost",
  };
  const sizeClasses = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isLoading ? "loading" : ""}
        ${className}
      `}
      {...props}
    >
      {label ? t(label) : children}
    </button>
  );
};

export default Button;
