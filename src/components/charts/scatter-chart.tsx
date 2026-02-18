"use client";

import {
  ScatterChart as RechartsScatter,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS, CHART_COLOR_ARRAY } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/format";

type ScatterDataPoint = {
  x: number;
  y: number;
  z: number;
  name?: string;
  category?: string;
};

type ScatterChartProps = {
  title: string;
  data: ScatterDataPoint[];
  xLabel: string;
  yLabel: string;
  categories?: string[];
  className?: string;
};

export function ScatterChartCard({ title, data, xLabel, yLabel, categories, className }: ScatterChartProps) {
  const groupedData = categories
    ? categories.map((cat) => ({
        name: cat,
        data: data.filter((d) => d.category === cat),
      }))
    : [{ name: "All", data }];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsScatter margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                dataKey="x"
                name={xLabel}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => formatNumber(v)}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={yLabel}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => formatPercent(v)}
              />
              <ZAxis type="number" dataKey="z" range={[40, 400]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number, name: string) => {
                  if (name === xLabel) return [formatNumber(value), name];
                  if (name === yLabel) return [formatPercent(value), name];
                  return [value, name];
                }}
              />
              <Legend />
              {groupedData.map((group, i) => (
                <Scatter
                  key={group.name}
                  name={group.name}
                  data={group.data}
                  fill={CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]}
                  fillOpacity={0.7}
                />
              ))}
            </RechartsScatter>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
