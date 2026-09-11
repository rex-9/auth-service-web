// src/modules/admin/analytics/components/NotificationChannelsChart.tsx
import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { IAnalyticsBreakdowns } from "../types";

interface INotificationChannelsChartProps {
  breakdowns: IAnalyticsBreakdowns;
}

const COLORS = ["#ff5757", "#38bdf8", "#34d399", "#fbbf24", "#a855f7"];

export const NotificationChannelsChart: React.FC<
  INotificationChannelsChartProps
> = ({ breakdowns }) => {
  const subscriptionsData = Object.entries(
    breakdowns.subscriptions_by_interval || {},
  ).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const errorsData = Object.entries(breakdowns.errors_by_platform || {}).map(
    ([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }),
  );

  const displayData =
    subscriptionsData.length > 0
      ? subscriptionsData
      : errorsData.length > 0
        ? errorsData
        : [{ name: "No Data", value: 1 }];

  return (
    <div className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-body-m font-semibold text-base-content">
            Active Subscriptions by Interval
          </h3>
          <p className="text-caption text-base-content opacity-60">
            Distribution across monthly, yearly, and lifetime plans
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {displayData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  return (
                    <div className="rounded-md border border-base-300 bg-base-100 p-3 shadow-xl">
                      <p className="text-caption font-semibold text-base-content opacity-80">
                        {item.name}
                      </p>
                      <p className="text-body-m font-bold text-primary">
                        {item.value} active
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NotificationChannelsChart;
