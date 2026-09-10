import React from "react";
import {
  formatDateTime,
  formatLocalDate,
  formatLocalTime,
  formatRelativeTime,
  parseDateTimeParts,
  parseUtcDate,
  type TDateTimeValue,
} from "../../../helpers/date.helper";
import { AppLocales, useTranslate } from "../../../locales";
import { cn } from "../../helpers";

export const DateTimeFormats = {
  DATE_TIME: "date-time",
  ADMIN: "admin",
  DATE: "date",
  TIME: "time",
  RELATIVE: "relative",
} as const;

export type DateTimeFormat =
  (typeof DateTimeFormats)[keyof typeof DateTimeFormats];

export interface IDateTimeProps {
  value: TDateTimeValue;
  format?: DateTimeFormat;
  className?: string;
  fallback?: React.ReactNode;
}

/** Displays a Core UTC timestamp in the browser's local timezone. */
export const DateTime: React.FC<IDateTimeProps> = ({
  value,
  format = DateTimeFormats.DATE_TIME,
  className,
  fallback,
}) => {
  const t = useTranslate();
  const date = parseUtcDate(value);
  if (!date) return <>{fallback ?? t(AppLocales.Common.NotAvailable)}</>;

  if (format === DateTimeFormats.ADMIN) {
    const parts = parseDateTimeParts(date)!;
    return (
      <time
        className={cn(
          "inline-flex flex-col items-center justify-center whitespace-nowrap text-center leading-tight",
          className,
        )}
        dateTime={date.toISOString()}
        title={formatDateTime(date)}
      >
        <span>{parts.date}</span>
        <span className="text-caption text-base-content/70">{parts.time}</span>
      </time>
    );
  }

  const visibleValue =
    format === DateTimeFormats.DATE
      ? formatLocalDate(date)
      : format === DateTimeFormats.TIME
        ? formatLocalTime(date)
        : format === DateTimeFormats.RELATIVE
          ? formatRelativeTime(date)
          : formatDateTime(date);

  return (
    <time
      className={cn("whitespace-nowrap", className)}
      dateTime={date.toISOString()}
      title={formatDateTime(date)}
    >
      {visibleValue}
    </time>
  );
};
