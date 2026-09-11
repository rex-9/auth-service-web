// src/modules/admin/analytics/analytics.service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../services/api.service", () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from "../../../services/api.service";
import AnalyticsService from "./analytics.service";
import AppRoutes from "../../../AppRoutes";

describe("AnalyticsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the analytics overview endpoint with params", async () => {
    const mockData = {
      period: "30d",
      start_date: "2026-08-01",
      end_date: "2026-08-31",
      grain: "daily" as const,
      kpis: {
        total_users: 10,
        new_users: 2,
        users_delta_pct: 0,
        total_revenue: 100,
        period_revenue: 20,
        revenue_delta_pct: 0,
        period_transactions: 1,
        transactions_delta_pct: 0,
        active_subscriptions: 1,
        total_messages: 10,
        user_messages: 5,
        ai_messages: 5,
        messages_delta_pct: 0,
        unresolved_errors: 0,
        period_errors: 0,
        period_feedbacks: 0,
      },
      time_series: [],
      breakdowns: {
        subscriptions_by_interval: {},
        feedback_ratings: {},
        errors_by_platform: {},
      },
    };

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        status: { code: 200, success: true, message: "OK" },
        data: mockData,
      },
    } as never);

    const result = await AnalyticsService.getOverview({ period: "30d" });

    expect(api.get).toHaveBeenCalledWith(
      AppRoutes.server.protected.admin.ANALYTICS_OVERVIEW,
      { period: "30d" },
    );
    expect(result.data?.data).toEqual(mockData);
  });
});
