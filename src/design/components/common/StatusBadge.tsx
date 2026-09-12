// src/design/components/common/StatusBadge.tsx
import React from "react";
import { Badge, IBadgeProps } from "./Badge";
import { BadgeSizes, BadgeVariants, BadgeVariant } from "../../constants";

export interface IStatusBadgeProps extends Omit<IBadgeProps, "children"> {
  status: string | boolean | undefined | null;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
  // Success / Active
  active: BadgeVariants.SUCCESS,
  resolved: BadgeVariants.SUCCESS,
  paid: BadgeVariants.SUCCESS,
  confirmed: BadgeVariants.SUCCESS,
  completed: BadgeVariants.SUCCESS,
  success: BadgeVariants.SUCCESS,
  live: BadgeVariants.SUCCESS,
  ready: BadgeVariants.SUCCESS,
  optimal: BadgeVariants.SUCCESS,
  true: BadgeVariants.SUCCESS,

  // Warning / In-Progress / Moderate
  pending: BadgeVariants.WARNING,
  in_progress: BadgeVariants.WARNING,
  in_review: BadgeVariants.WARNING,
  triaged: BadgeVariants.WARNING,
  unresolved: BadgeVariants.WARNING,
  medium: BadgeVariants.WARNING,
  low: BadgeVariants.WARNING,
  warning: BadgeVariants.WARNING,
  trialing: BadgeVariants.WARNING,

  // Danger / Error / Critical
  inactive: BadgeVariants.SECONDARY,
  revoked: BadgeVariants.ERROR,
  failed: BadgeVariants.ERROR,
  rejected: BadgeVariants.ERROR,
  canceled: BadgeVariants.ERROR,
  cancelled: BadgeVariants.ERROR,
  expired: BadgeVariants.ERROR,
  high: BadgeVariants.ERROR,
  urgent: BadgeVariants.ERROR,
  critical: BadgeVariants.ERROR,
  bug: BadgeVariants.ERROR,
  error: BadgeVariants.ERROR,
  false: BadgeVariants.SECONDARY,

  // Info / New / Primary
  new: BadgeVariants.INFO,
  open: BadgeVariants.INFO,
  feature: BadgeVariants.INFO,
  info: BadgeVariants.INFO,
  processing: BadgeVariants.INFO,
  custom: BadgeVariants.PRIMARY,
  system: BadgeVariants.DEFAULT,
  general: BadgeVariants.DEFAULT,
};

const formatStatusText = (status: string): string => {
  return status
    .split(/[_\-\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const StatusBadge: React.FC<IStatusBadgeProps> = ({
  status,
  label,
  children,
  size = BadgeSizes.XS,
  variant,
  className,
  ...props
}) => {
  if (status === undefined || status === null) return null;

  const rawKey =
    typeof status === "boolean"
      ? String(status)
      : String(status).toLowerCase().trim();
  const computedVariant =
    variant || STATUS_VARIANT_MAP[rawKey] || BadgeVariants.DEFAULT;
  const content =
    children ||
    label ||
    (typeof status === "string" ? formatStatusText(status) : String(status));

  return (
    <Badge
      size={size}
      variant={computedVariant}
      className={className}
      {...props}
    >
      {content}
    </Badge>
  );
};

export default StatusBadge;
