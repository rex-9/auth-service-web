import React from "react";
import { clsx } from "ts-clsx";

interface TypographyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "secondary",
  className = "text-base font-normal",
  ...props
}) => {
  const primaryClasses = "text-primary-light dark:text-primary-dark";
  const secondaryClasses = "text-text-light dark:text-text-dark";
  return (
    <p
      {...props}
      className={clsx(
        variant === "primary" ? primaryClasses : secondaryClasses,
        className
      )}
    >
      {children}
    </p>
  );
};

export default Typography;
