"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, formatPercent, formatCurrency, formatDelta } from "@/lib/format";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { TrendingUp, TrendingDown } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: number;
  previousValue?: number;
  format?: "number" | "percent" | "currency";
  sparklineData?: number[];
  className?: string;
};

export function MetricCard({
  label,
  value,
  previousValue,
  format = "number",
  sparklineData,
  className,
}: MetricCardProps) {
  const formattedValue =
    format === "percent" ? formatPercent(value) : format === "currency" ? formatCurrency(value) : formatNumber(value);

  const delta = previousValue !== undefined ? formatDelta(value, previousValue) : null;

  const chartData = sparklineData?.map((v, i) => ({ index: i, value: v })) ?? [];

  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{formattedValue}</p>
            {delta && (
              <div className={`flex items-center gap-1 text-xs font-medium ${delta.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {delta.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {delta.value}
              </div>
            )}
          </div>
          {chartData.length > 0 && (
            <div className="h-12 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_COLORS.primary}
                    fill={`url(#gradient-${label})`}
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
