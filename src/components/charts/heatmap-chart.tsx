"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatPercent } from "@/lib/format";

type HeatmapData = {
  row: string;
  col: string;
  value: number;
};

type HeatmapChartProps = {
  title: string;
  data: HeatmapData[];
  rows: string[];
  cols: string[];
  valueLabel?: string;
  colorMin?: string;
  colorMax?: string;
  className?: string;
};

function getHeatmapColor(value: number, min: number, max: number): string {
  if (max === min) return "hsl(209, 100%, 50%)";
  const ratio = (value - min) / (max - min);
  const lightness = 95 - ratio * 50;
  return `hsl(209, 90%, ${lightness}%)`;
}

export function HeatmapChart({
  title,
  data,
  rows,
  cols,
  valueLabel = "Value",
  className,
}: HeatmapChartProps) {
  const dataMap = new Map(data.map((d) => [`${d.row}-${d.col}`, d.value]));
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 1);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <TooltipProvider>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-1 text-xs text-muted-foreground" />
                  {cols.map((col) => (
                    <th key={col} className="p-1 text-center text-xs text-muted-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row}>
                    <td className="p-1 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {row}
                    </td>
                    {cols.map((col) => {
                      const value = dataMap.get(`${row}-${col}`) ?? 0;
                      return (
                        <td key={col} className="p-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="h-8 w-full rounded-sm cursor-pointer transition-opacity hover:opacity-80"
                                style={{ backgroundColor: getHeatmapColor(value, minVal, maxVal) }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {row}, {col}: {valueLabel} {formatPercent(value)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
