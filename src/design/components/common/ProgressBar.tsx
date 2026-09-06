import React from "react";
import { cn } from "../../helpers";
import {
  ProgressBarSizes,
  ProgressBarVariants,
  type ProgressBarSize,
  type ProgressBarVariant,
} from "../../constants";

interface IProgressBarProps {
  /** Progress value between 0 and 100 */
  value: number;
  /** Optional label to display */
  label?: string;
  /** Optional size variant */
  size?: ProgressBarSize;
  /** Optional color variant */
  variant?: ProgressBarVariant;
  /** Whether to show percentage text */
  showPercentage?: boolean;
  /** Optional className override */
  className?: string;
}

const SIZE_CLASSES: Record<ProgressBarSize, string> = {
  [ProgressBarSizes.SM]: "h-1.5",
  [ProgressBarSizes.MD]: "h-2.5",
  [ProgressBarSizes.LG]: "h-4",
} as const;

const VARIANT_CLASSES: Record<ProgressBarVariant, string> = {
  [ProgressBarVariants.PRIMARY]: "bg-primary",
  [ProgressBarVariants.SUCCESS]: "bg-success",
  [ProgressBarVariants.WARNING]: "bg-warning",
  [ProgressBarVariants.ERROR]: "bg-error",
} as const;

export const ProgressBar: React.FC<IProgressBarProps> = ({
  value,
  label,
  size = ProgressBarSizes.MD,
  variant = ProgressBarVariants.PRIMARY,
  showPercentage = false,
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between text-body-s">
          {label && (
            <span className="text-base-content opacity-70">{label}</span>
          )}
          {showPercentage && (
            <span className="text-base-content font-medium">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-base-200",
          SIZE_CLASSES[size],
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${Math.round(clampedValue)}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            VARIANT_CLASSES[variant],
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
