import React from "react";
import { Link } from "react-router-dom";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";

export interface IBreadcrumbItem {
  label: React.ReactNode;
  to?: string;
}

export interface IBreadcrumbsProps {
  items: IBreadcrumbItem[];
  className?: string;
  ariaLabel?: string;
}

export const Breadcrumbs: React.FC<IBreadcrumbsProps> = ({
  items,
  className,
  ariaLabel = "Breadcrumb",
}) => (
  <nav aria-label={ariaLabel} className={cn("min-w-0", className)}>
    <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-body-s text-base-content/60">
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;

        return (
          <React.Fragment key={`${index}-${String(item.label)}`}>
            {index > 0 && (
              <li aria-hidden="true" className="shrink-0">
                <iconsLib.chevronRight className="h-3.5 w-3.5" />
              </li>
            )}
            <li className="min-w-0">
              {!isCurrent && item.to ? (
                <Link
                  to={item.to}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "block max-w-64 truncate",
                    isCurrent && "font-semibold text-base-content",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  </nav>
);
