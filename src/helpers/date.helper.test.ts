import { describe, it, expect } from "vitest";
import React from "react";
import {
  formatDateTime,
  formatAdminDate,
  parseDateTimeParts,
} from "./date.helper";

describe("date.helper", () => {
  it("formats date in 24-hour format: DD Mon YY - HH:mm:ss", () => {
    const testDate = new Date(2026, 8, 1, 13, 51, 40); // 1 Sept 2026 13:51:40
    expect(formatDateTime(testDate)).toBe("01 Sept 26 - 13:51:40");
    expect(formatAdminDate(testDate, { inline: true })).toBe(
      "01 Sept 26 - 13:51:40",
    );
    expect(parseDateTimeParts(testDate)).toEqual({
      date: "01 Sept 26",
      time: "13:51:40",
    });
    expect(React.isValidElement(formatAdminDate(testDate))).toBe(true);
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

  it("returns Not available for falsy or invalid values", () => {
    expect(formatDateTime(null)).toBe("Not available");
    expect(formatDateTime(undefined)).toBe("Not available");
    expect(formatDateTime("invalid-date")).toBe("Not available");
  });
});
