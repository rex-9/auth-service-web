/** Cross-client timestamp cases mirrored by Core and Mobile contract tests. */
export const DATE_TIME_CONTRACT_FIXTURES = {
  utc: "2026-09-10T12:00:00Z",
  explicitOffset: "2026-09-10T19:00:00+07:00",
  zoneLessUtc: "2026-09-10T12:00:00",
  dstBefore: "2026-03-08T06:59:59Z",
  dstAfter: "2026-03-08T07:00:00Z",
  invalid: "not-a-timestamp",
  missing: null,
} as const;
