// src/modules/admin/analytics/types.ts
import { TAnalyticsPeriod, TAnalyticsGrain } from "../constants";

export interface IAnalyticsKpis {
  total_users: number;
  new_users: number;
  users_delta_pct: number;

  total_revenue: number;
  period_revenue: number;
  revenue_delta_pct: number;

  period_transactions: number;
  transactions_delta_pct: number;

  active_subscriptions: number;

  total_messages: number;
  user_messages: number;
  ai_messages: number;
  messages_delta_pct: number;

  unresolved_errors: number;
  period_errors: number;
  period_feedbacks: number;
}

export interface IAnalyticsTimeSeriesPoint {
  date: string;
  key: string;
  revenue: number;
  transactions: number;
  new_users: number;
  user_messages: number;
  ai_messages: number;
}

export interface IAnalyticsBreakdowns {
  subscriptions_by_interval: Record<string, number>;
  feedback_ratings: Record<string, number>;
  errors_by_platform: Record<string, number>;
}

export interface IAnalyticsOverview {
  period: TAnalyticsPeriod | string;
  start_date: string;
  end_date: string;
  grain: TAnalyticsGrain;
  kpis: IAnalyticsKpis;
  time_series: IAnalyticsTimeSeriesPoint[];
  breakdowns: IAnalyticsBreakdowns;
}

export interface IAnalyticsParams {
  period?: TAnalyticsPeriod | string;
  start_date?: string;
  end_date?: string;
}
