import React from "react";
import { cn } from "../../helpers";

export interface ISegmentedProgressBarItem {
  label: string;
  value: number;
  className: string;
}

export interface ISegmentedProgressBarProps {
  items: readonly ISegmentedProgressBarItem[];
  ariaLabel: string;
  className?: string;
}

export const SegmentedProgressBar: React.FC<ISegmentedProgressBarProps> = ({
  items,
  ariaLabel,
  className,
}) => {
  const total = items.reduce((sum, item) => sum + Math.max(item.value, 0), 0);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn("flex h-2 w-full overflow-hidden rounded-full bg-base-200", className)}
    >
      {items.map((item) => (
        <div
          key={item.label}
          title={`${item.label}: ${total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%`}
          className={cn("h-full transition-all duration-300", item.className)}
          style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%` }}
        />
      ))}
    </div>
  );
};

export default SegmentedProgressBar;
