// src/design/components/common/Badge.tsx

import React from "react";
import { cn } from "../../helpers";
import {
  BadgeVariant,
  BadgeVariants,
  ComponentSize,
  ComponentSizes,
} from "../../constants";

export interface IBadgeProps extends React.HTMLAttributes<
  HTMLSpanElement | HTMLAnchorElement
> {
  variant?: BadgeVariant;
  size?: ComponentSize;
  href?: string;
  target?: string;
  rel?: string;
}

export const Badge: React.FC<IBadgeProps> = ({
  variant = BadgeVariants.DEFAULT,
  size = ComponentSizes.SM,
  href,
  target = href ? "_blank" : undefined,
  rel = href ? "noopener noreferrer" : undefined,
  className,
  children,
  ...props
}) => {
  const variants: Record<BadgeVariant, string> = {
    [BadgeVariants.DEFAULT]:
      "bg-base-200 text-base-content border border-border",
    [BadgeVariants.NEON]:
      "border border-glass-tag bg-glass-tag-bg text-white font-semibold font-primary transition-all duration-200 hover:bg-glass-tag-bg-hover hover:border-primary hover:text-white hover:shadow-neon",
    [BadgeVariants.PRIMARY]:
      "bg-primary/10 text-primary border border-primary/30",
    [BadgeVariants.SECONDARY]:
      "bg-secondary/10 text-secondary border border-secondary/30",
    [BadgeVariants.SUCCESS]:
      "bg-success/15 text-success border border-success/30 font-medium",
    [BadgeVariants.WARNING]:
      "bg-warning/15 text-warning border border-warning/30 font-medium",
    [BadgeVariants.ERROR]:
      "bg-error/15 text-error border border-error/30 font-medium",
    [BadgeVariants.INFO]:
      "bg-info/15 text-info border border-info/30 font-medium",
  };

  const sizes: Partial<Record<ComponentSize, string>> = {
    [ComponentSizes.XS]: "px-2 py-1 text-xs rounded-sm",
    [ComponentSizes.SM]: "px-2 py-1 text-sm rounded",
    [ComponentSizes.MD]: "px-3 py-1 text-base rounded-md",
    [ComponentSizes.LG]: "px-4 py-2 text-lg rounded-lg",
    [ComponentSizes.XL]: "px-5 py-2 text-xl rounded-xl",
  };

  const badgeClassName = cn(
    "inline-flex items-center justify-center select-none",
    variants[variant],
    sizes[size] || sizes[ComponentSizes.MD],
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        {...props}
        className={badgeClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <span {...props} className={badgeClassName}>
      {children}
    </span>
  );
};
