// src/design/components/common/Tabs.tsx
import React from "react";
import { cn } from "../../helpers";
import { ComponentSize, ComponentSizes } from "../../constants";

export const TabVariants = {
  SEGMENTED: "segmented",
  UNDERLINE: "underline",
  PILLS: "pills",
} as const;

export type TabVariant = (typeof TabVariants)[keyof typeof TabVariants];

export interface ITabItem<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
  disabled?: boolean;
}

export interface ITabsProps<T extends string = string> {
  items: ITabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: ComponentSize;
  variant?: TabVariant;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  ariaLabel?: string;
}

export const Tabs = <T extends string = string>({
  items,
  value,
  onChange,
  size = ComponentSizes.MD,
  variant = TabVariants.SEGMENTED,
  className,
  tabClassName,
  activeTabClassName,
  ariaLabel = "Navigation Tabs",
}: ITabsProps<T>): React.ReactElement => {
  const sizeStyles: Partial<
    Record<ComponentSize, { container: string; tab: string }>
  > = {
    [ComponentSizes.SM]: {
      container: "p-0.5 gap-0.5",
      tab: "px-2.5 py-1 text-caption",
    },
    [ComponentSizes.MD]: {
      container: "p-1 gap-1",
      tab: "px-3.5 py-1.5 text-body-s",
    },
    [ComponentSizes.LG]: {
      container: "p-1.5 gap-1.5",
      tab: "px-4 py-2 text-body-m",
    },
  };

  const selectedSize = sizeStyles[size] || sizeStyles[ComponentSizes.MD]!;

  if (variant === TabVariants.UNDERLINE) {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          "flex items-center gap-6 border-b border-base-300 w-full",
          className,
        )}
      >
        {items.map((tab) => {
          const isActive = tab.value === value;
          const Icon = tab.icon;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 py-3 font-semibold transition-all duration-200 outline-none",
                isActive
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-base-content/70 hover:text-base-content hover:border-base-300",
                tab.disabled && "opacity-40 cursor-not-allowed",
                tabClassName,
                isActive && activeTabClassName,
              )}
            >
              <span className={cn("inline-flex items-center gap-1.5", Icon && "max-sm:flex-col max-sm:gap-1")}>
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span>{tab.label}</span>
              </span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-2 py-0.5 text-xs",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-base-200 text-base-content/60",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded-lg bg-base-200 border border-base-300/50 select-none",
        selectedSize.container,
        className,
      )}
    >
      {items.map((tab) => {
        const isActive = tab.value === value;
        const Icon = tab.icon;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition-all duration-150 outline-none",
              selectedSize.tab,
              isActive
                ? "bg-base-100 text-primary shadow-sm border border-base-300/60"
                : "text-base-content/70 hover:text-base-content hover:bg-base-300/40",
              tab.disabled && "opacity-40 cursor-not-allowed",
              tabClassName,
              isActive && activeTabClassName,
            )}
          >
            <span className={cn("inline-flex items-center gap-1.5", Icon && "max-sm:flex-col max-sm:gap-1")}>
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{tab.label}</span>
            </span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-base-300 text-base-content/60",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
