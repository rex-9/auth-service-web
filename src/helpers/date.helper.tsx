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

export type TDateTimeValue = Date | string | number | null | undefined;

const ISO_DATE_TIME_WITHOUT_ZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/;

/** Parse API timestamps as UTC, including ISO values whose zone suffix was omitted. */
export const parseUtcDate = (value: TDateTimeValue): Date | null => {
  if (value === null || value === undefined || value === "") return null;
  const normalized =
    typeof value === "string" && ISO_DATE_TIME_WITHOUT_ZONE.test(value)
      ? `${value}Z`
      : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getBrowserTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export const getLocalUtcOffset = (value: Date = new Date()): string => {
  const offsetMinutes = -value.getTimezoneOffset();
  if (offsetMinutes === 0) return "UTC";
  const sign = offsetMinutes >= 0 ? "+" : "−";
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
};

/** Serialize an instant into the UTC ISO contract used by Core. */
export const toUtcIsoString = (value: TDateTimeValue): string | null =>
  parseUtcDate(value)?.toISOString() ?? null;

/** Convert a value from a browser `datetime-local` input into UTC for Core. */
export const localDateTimeInputToUtcIso = (value: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/** Convert a Core UTC timestamp into a browser `datetime-local` input value. */
export const utcToLocalDateTimeInput = (value: TDateTimeValue): string => {
  const date = parseUtcDate(value);
  if (!date) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const getUtcNowIso = (): string => new Date().toISOString();

export const formatLocalDate = (
  value: TDateTimeValue,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = parseUtcDate(value);
  return date ? date.toLocaleDateString(undefined, options) : "Not available";
};

export const formatLocalTime = (
  value: TDateTimeValue,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = parseUtcDate(value);
  return date ? date.toLocaleTimeString(undefined, options) : "Not available";
};

/**
 * Parse date and time into discrete formatted segments
 */
export const parseDateTimeParts = (
  value?: Date | string | number | null,
): IDateTimeParts | null => {
  if (!value) return null;
  const date = parseUtcDate(value);
  if (!date) return null;

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
