// src/helpers/date.helper.tsx

import React from "react";
import { cn } from "../design/helpers";

const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
] as const;

export interface IDateTimeParts {
  date: string; // e.g. "05 Sept 26"
  time: string; // e.g. "00:40:32"
}

/**
 * Parse date and time into discrete formatted segments
 */
export const parseDateTimeParts = (
  value?: Date | string | number | null,
): IDateTimeParts | null => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTH_ABBREVIATIONS[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return {
    date: `${day} ${month} ${year}`,
    time: `${hours}:${minutes}:${seconds}`,
  };
};

/**
 * Format a date/time value into 24-hour inline format: `01 Sept 26 - 13:51:40`
 */
export const formatDateTime = (
  value?: Date | string | number | null,
): string => {
  const parts = parseDateTimeParts(value);
  if (!parts) return "Not available";

  return `${parts.date} - ${parts.time}`;
};

export interface IFormatAdminDateOptions {
  className?: string;
  inline?: boolean;
}

/**
 * Format an admin date/time for table cells:
 * Displays two rows centered:
 *   05 Sept 26
 *    00:40:32
 */
export const formatAdminDate = (
  value?: Date | string | number | null,
  options?: IFormatAdminDateOptions,
): React.ReactNode => {
  const parts = parseDateTimeParts(value);
  if (!parts) return "Not available";

  if (options?.inline) {
    return `${parts.date} - ${parts.time}`;
  }

  return (
    <span
      className={cn(
        "inline-flex flex-col items-center justify-center text-center leading-tight whitespace-nowrap",
        options?.className,
      )}
    >
      <span className="whitespace-nowrap">{parts.date}</span>
      <span className="whitespace-nowrap text-caption text-base-content/70">
        {parts.time}
      </span>
    </span>
  );
};

export default formatDateTime;

