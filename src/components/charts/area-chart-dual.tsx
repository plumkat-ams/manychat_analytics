"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";

type DualAxisAreaChartProps = {
  title: string;
  data: Array<Record<string, string | number>>;
  leftKey: string;
  rightKey: string;
  leftLabel: string;
  rightLabel: string;
  xKey?: string;
};

export function DualAxisAreaChart({
  title,
  data,
  leftKey,
  rightKey,
  leftLabel,
  rightLabel,
  xKey = "date",
}: DualAxisAreaChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="gradientLeft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientRight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={xKey} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => formatNumber(v)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey={leftKey}
                name={leftLabel}
                stroke={CHART_COLORS.primary}
                fill="url(#gradientLeft)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey={rightKey}
                name={rightLabel}
                stroke={CHART_COLORS.secondary}
                fill="url(#gradientRight)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
