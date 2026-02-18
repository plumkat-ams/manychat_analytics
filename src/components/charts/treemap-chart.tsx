"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLOR_ARRAY } from "@/lib/constants";
import { formatNumber } from "@/lib/format";

type TreemapItem = {
  name: string;
  value: number;
  color?: string;
};

type TreemapChartProps = {
  title: string;
  data: TreemapItem[];
  className?: string;
};

export function TreemapChart({ title, data, className }: TreemapChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {sorted.map((item, i) => {
            const percent = total > 0 ? (item.value / total) * 100 : 0;
            const minWidth = Math.max(percent * 2, 60);

            return (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center rounded-md p-3 text-white transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: item.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length],
                  flexBasis: `${Math.max(percent, 15)}%`,
                  flexGrow: percent > 30 ? 2 : 1,
                  minWidth: `${minWidth}px`,
                  minHeight: "80px",
                }}
              >
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="text-xs opacity-90">{formatNumber(item.value)}</span>
                <span className="text-xs opacity-75">{percent.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
