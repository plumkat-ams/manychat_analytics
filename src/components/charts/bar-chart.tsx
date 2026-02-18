"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS, CHART_COLOR_ARRAY } from "@/lib/constants";
import { formatNumber } from "@/lib/format";

type BarChartProps = {
  title: string;
  data: Array<Record<string, string | number>>;
  bars: Array<{ key: string; label: string; color?: string; stackId?: string }>;
  xKey?: string;
  horizontal?: boolean;
  className?: string;
};

export function BarChartCard({ title, data, bars, xKey = "name", horizontal = false, className }: BarChartProps) {
  const Chart = horizontal ? RechartsBarChart : RechartsBarChart;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <Chart
              data={data}
              layout={horizontal ? "vertical" : "horizontal"}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              {horizontal ? (
                <>
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => formatNumber(v)} />
                  <YAxis dataKey={xKey} type="category" tick={{ fill: "hsl(var(--muted-foreground))" }} width={120} className="text-xs" />
                </>
              ) : (
                <>
                  <XAxis dataKey={xKey} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => formatNumber(v)} />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              {bars.map((bar, i) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.label}
                  fill={bar.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]}
                  stackId={bar.stackId}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </Chart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
