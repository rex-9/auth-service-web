// src/modules/admin/analytics/analytics.controller.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./analytics.service", () => ({
  default: {
    getOverview: vi.fn(),
  },
}));

import AnalyticsService from "./analytics.service";
import AnalyticsController from "./analytics.controller";

describe("AnalyticsController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success with data on valid API response", async () => {
    const mockOverview = {
      period: "30d",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
      grain: "daily" as const,
      kpis: {
        total_users: 100,
        new_users: 20,
        users_delta_pct: 15.0,
        total_revenue: 1500.0,
        period_revenue: 300.0,
        revenue_delta_pct: 10.0,
        period_transactions: 10,
        transactions_delta_pct: 5.0,
        active_subscriptions: 8,
        total_messages: 50,
        user_messages: 25,
        ai_messages: 25,
        messages_delta_pct: 20.0,
        unresolved_errors: 1,
        period_errors: 2,
        period_feedbacks: 5,
      },
      time_series: [],
      breakdowns: {
        subscriptions_by_interval: {},
        feedback_ratings: {},
        errors_by_platform: {},
      },
    };

    vi.mocked(AnalyticsService.getOverview).mockResolvedValueOnce({
      data: {
        status: { code: 200, success: true, message: "OK" },
        data: mockOverview,
      },
    } as never);

    const result = await AnalyticsController.getOverview({ period: "30d" });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockOverview);
  });

  it("handles error response gracefully", async () => {
    vi.mocked(AnalyticsService.getOverview).mockResolvedValueOnce({
      data: null,
      error: "Unauthorized",
    } as never);

    const result = await AnalyticsController.getOverview({ period: "30d" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized");
  });
});
