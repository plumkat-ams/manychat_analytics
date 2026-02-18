"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/format";
import { CHART_COLORS } from "@/lib/constants";

type FunnelStep = {
  stage: string;
  count: number;
  rate: number;
};

type FunnelChartProps = {
  title: string;
  data: FunnelStep[];
  className?: string;
};

export function FunnelChart({ title, data, className }: FunnelChartProps) {
  const maxCount = data[0]?.count ?? 1;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((step, i) => {
            const widthPercent = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
            const opacity = 1 - i * 0.15;

            return (
              <div key={step.stage} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.stage}</span>
                  <span className="text-muted-foreground">
                    {formatNumber(step.count)}
                    {i > 0 && (
                      <span className="ml-2 text-xs">
                        ({formatPercent(step.rate)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-8 w-full rounded-md bg-muted">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{
                      width: `${Math.max(widthPercent, 2)}%`,
                      backgroundColor: CHART_COLORS.primary,
                      opacity,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
