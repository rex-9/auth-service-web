import { describe, it, expect } from "vitest";
import {
  formatDateTime,
  formatRelativeTime,
  localDateTimeInputToUtcIso,
  parseUtcDate,
  parseDateTimeParts,
  toUtcIsoString,
  utcToLocalDateTimeInput,
} from "./date.helper";
import { DATE_TIME_CONTRACT_FIXTURES } from "./dateTimeContract.fixture";

describe("date.helper", () => {
  it("formats date in 24-hour format: DD Mon YY - HH:mm:ss", () => {
    const testDate = new Date(2026, 8, 1, 13, 51, 40); // 1 Sept 2026 13:51:40
    expect(formatDateTime(testDate)).toBe("01 Sept 26 - 13:51:40");
    expect(parseDateTimeParts(testDate)).toEqual({
      date: "01 Sept 26",
      time: "13:51:40",
    });
  });

  it("pads single digit days, hours, minutes, seconds with leading zeroes", () => {
    const testDate = new Date(2026, 0, 5, 9, 4, 3); // 5 Jan 2026 09:04:03
    expect(formatDateTime(testDate)).toBe("05 Jan 26 - 09:04:03");
  });

  it("correctly handles string timestamps", () => {
    const d = new Date();
    d.setFullYear(2026, 8, 2);
    d.setHours(14, 30, 0, 0);
    const formatted = formatDateTime(d.toISOString());
    expect(formatted).toContain("Sept 26 - ");
  });

  it("treats zone-less API timestamps as UTC", () => {
    expect(parseUtcDate("2026-09-02T14:30:00")?.toISOString()).toBe(
      "2026-09-02T14:30:00.000Z",
    );
  });

  it("normalizes UTC, explicit offsets, zone-less values, and DST instants", () => {
    const fixture = DATE_TIME_CONTRACT_FIXTURES;
    expect(parseUtcDate(fixture.utc)?.toISOString()).toBe(
      "2026-09-10T12:00:00.000Z",
    );
    expect(parseUtcDate(fixture.explicitOffset)?.toISOString()).toBe(
      "2026-09-10T12:00:00.000Z",
    );
    expect(parseUtcDate(fixture.zoneLessUtc)?.toISOString()).toBe(
      "2026-09-10T12:00:00.000Z",
    );
    expect(
      parseUtcDate(fixture.dstAfter)!.getTime() -
        parseUtcDate(fixture.dstBefore)!.getTime(),
    ).toBe(1_000);
    expect(parseUtcDate(fixture.invalid)).toBeNull();
    expect(parseUtcDate(fixture.missing)).toBeNull();
  });

  it("serializes local date values to the UTC API contract", () => {
    const local = new Date(2026, 8, 2, 14, 30);
    expect(toUtcIsoString(local)).toBe(local.toISOString());
  });

  it("round trips browser-local date-time input values through UTC", () => {
    const input = "2026-09-02T14:30";
    const utc = localDateTimeInputToUtcIso(input);

    expect(utc).not.toBeNull();
    expect(utcToLocalDateTimeInput(utc)).toBe(input);
  });

  it("returns Not available for falsy or invalid values", () => {
    expect(formatDateTime(null)).toBe("Not available");
    expect(formatDateTime(undefined)).toBe("Not available");
    expect(formatDateTime("invalid-date")).toBe("Not available");
  });

  it("formats relative instants through the centralized local-time boundary", () => {
    const now = new Date("2026-09-10T12:00:00Z");
    expect(formatRelativeTime("2026-09-10T11:55:00Z", now)).toBe(
      "5 minutes ago",
    );
    expect(formatRelativeTime("invalid", now)).toBeNull();
  });
});
