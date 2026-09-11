import React from "react";
import { cn } from "../../../design/helpers";

export interface IAdminDetailSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const AdminDetailSection: React.FC<IAdminDetailSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  contentClassName,
}) => (
  <section
    className={cn(
      "overflow-hidden rounded-xl border border-base-300 bg-base-100",
      className,
    )}
  >
    <header className="flex items-start gap-3 border-b border-base-300 px-4 py-4 sm:px-6">
      {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />}
      <div className="min-w-0">
        <h2 className="text-body-m font-semibold text-base-content">{title}</h2>
        {description && (
          <p className="mt-0.5 text-body-s text-base-content/60">
            {description}
          </p>
        )}
      </div>
    </header>
    <div className={cn("p-4 sm:p-6", contentClassName)}>{children}</div>
  </section>
);

export interface IAdminDetailFieldProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
}

export const AdminDetailField: React.FC<IAdminDetailFieldProps> = ({
  label,
  value,
  className,
}) => (
  <div className={cn("min-w-0", className)}>
    <dt className="text-caption font-semibold uppercase tracking-wide text-base-content/50">
      {label}
    </dt>
    <dd className="mt-1 wrap-break-word text-body-m font-medium text-base-content">
      {value ?? "—"}
    </dd>
  </div>
);

export const AdminDetailGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <dl
    className={cn(
      "grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3",
      className,
    )}
  >
    {children}
  </dl>
);
