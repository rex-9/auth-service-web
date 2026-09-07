import React from "react";
import { cn } from "../../helpers";

export interface IMetricIndicator {
  label: React.ReactNode;
  value: React.ReactNode;
  detail?: React.ReactNode;
}

export interface IMetricIndicatorsProps {
  items: readonly IMetricIndicator[];
  ariaLabel?: string;
  className?: string;
}

export const MetricIndicators: React.FC<IMetricIndicatorsProps> = ({
  items,
  ariaLabel,
  className,
}) => (
  <div
    role="group"
    aria-label={ariaLabel}
    className={cn(
      "grid overflow-hidden rounded-md border border-base-300 bg-base-200/30",
      className,
    )}
    style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
  >
    {items.map((item, index) => (
      <div
        key={index}
        className={cn(
          "min-w-0 px-2 py-2",
          index > 0 && "border-l border-base-300",
        )}
      >
        <div className="truncate text-caption font-semibold uppercase text-primary">
          {item.label}
        </div>
        <div className="mt-0.5 truncate text-caption font-semibold text-base-content">
          {item.value}
        </div>
        {item.detail && (
          <div className="truncate text-[0.6875rem] text-base-content/50">
            {item.detail}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default MetricIndicators;
