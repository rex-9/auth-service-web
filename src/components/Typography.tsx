import { FC, HTMLAttributes } from "react";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "small";
  color?: "primary" | "secondary" | "default";
}

const Typography: FC<TypographyProps> = ({
  variant = "body",
  color = "default",
  className = "",
  children,
  ...props
}) => {
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    default: "text-base-content",
  };

  const variantClasses = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold",
    h4: "text-xl font-bold",
    body: "text-base",
    small: "text-sm",
  };

  const Component = variant.startsWith("h") ? variant : "p";

  return (
    <Component
      className={`${variantClasses[variant]} ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
