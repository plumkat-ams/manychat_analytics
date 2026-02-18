"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLOR_ARRAY } from "@/lib/constants";
import { formatNumber } from "@/lib/format";

type StackedAreaChartProps = {
  title: string;
  data: Array<Record<string, string | number>>;
  areas: Array<{ key: string; label: string; color?: string }>;
  xKey?: string;
  className?: string;
};

export function StackedAreaChart({ title, data, areas, xKey = "date", className }: StackedAreaChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={xKey} tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              {areas.map((area, i) => (
                <Area
                  key={area.key}
                  type="monotone"
                  dataKey={area.key}
                  name={area.label}
                  stackId="1"
                  stroke={area.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]}
                  fill={area.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]}
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
