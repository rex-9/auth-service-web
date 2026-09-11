import { describe, expect, it } from "vitest";
import { ANALYTICS_EVENTS, ANALYTICS_PARAMS } from "./analytics.constants";

describe("ANALYTICS_EVENTS", () => {
  it("keeps the shared action_noun event contract stable", () => {
    expect(Object.values(ANALYTICS_EVENTS)).toEqual([
      "sign_up",
      "sign_in",
      "sign_out",
      "begin_onboarding",
      "complete_onboarding",
      "view_page",
      "view_product",
      "purchase_product",
      "open_notification",
    ]);
  });

  it("uses the shared purchase amount parameter", () => {
    expect(ANALYTICS_PARAMS.UNIT_AMOUNT).toBe("unit_amount");
  });
});
