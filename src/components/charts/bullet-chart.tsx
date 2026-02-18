"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatCurrency } from "@/lib/format";
import { CHART_COLORS } from "@/lib/constants";

type BulletItem = {
  metric: string;
  target: number;
  current: number;
  projected: number;
  format?: "number" | "currency";
};

type BulletChartProps = {
  title: string;
  data: BulletItem[];
  className?: string;
};

export function BulletChart({ title, data, className }: BulletChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => {
            const maxVal = Math.max(item.target, item.projected, item.current) * 1.1;
            const currentPct = (item.current / maxVal) * 100;
            const targetPct = (item.target / maxVal) * 100;
            const projectedPct = (item.projected / maxVal) * 100;
            const fmt = item.format === "currency" ? formatCurrency : formatNumber;
            const onTrack = item.projected >= item.target;

            return (
              <div key={item.metric} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.metric}</span>
                  <span className="text-muted-foreground">
                    {fmt(item.current)} / {fmt(item.target)}
                  </span>
                </div>
                <div className="relative h-6 w-full rounded-md bg-muted">
                  {/* Projected bar (background) */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-md opacity-30"
                    style={{
                      width: `${Math.min(projectedPct, 100)}%`,
                      backgroundColor: onTrack ? CHART_COLORS.success : CHART_COLORS.warning,
                    }}
                  />
                  {/* Current bar */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{
                      width: `${Math.min(currentPct, 100)}%`,
                      backgroundColor: onTrack ? CHART_COLORS.success : CHART_COLORS.warning,
                    }}
                  />
                  {/* Target marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-foreground"
                    style={{ left: `${Math.min(targetPct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Projected: {fmt(item.projected)}</span>
                  <span className={onTrack ? "text-green-600" : "text-yellow-600"}>
                    {onTrack ? "On track" : "Behind pace"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
