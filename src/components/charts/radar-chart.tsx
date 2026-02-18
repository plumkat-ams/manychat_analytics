"use client";

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLOR_ARRAY } from "@/lib/constants";

type RadarChartProps = {
  title: string;
  data: Array<Record<string, string | number>>;
  dimensions: string[];
  series: Array<{ key: string; label: string; color?: string }>;
  className?: string;
};

export function RadarChartCard({ title, data, dimensions, series, className }: RadarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadar cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              {series.map((s, i) => (
                <Radar
                  key={s.key}
                  name={s.label}
                  dataKey={s.key}
                  stroke={s.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]}
                  fill={s.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
            </RechartsRadar>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
