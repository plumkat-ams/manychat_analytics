"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/date-utils";

type CalendarData = {
  date: string;
  value: number;
};

type CalendarHeatmapProps = {
  title: string;
  data: CalendarData[];
  className?: string;
};

function getColor(value: number, max: number): string {
  if (value === 0) return "hsl(var(--muted))";
  const ratio = Math.min(value / max, 1);
  if (ratio < 0.25) return "hsl(262, 83%, 90%)";
  if (ratio < 0.5) return "hsl(262, 83%, 75%)";
  if (ratio < 0.75) return "hsl(262, 83%, 60%)";
  return "hsl(262, 83%, 45%)";
}

export function CalendarHeatmap({ title, data, className }: CalendarHeatmapProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const dataMap = new Map(data.map((d) => [d.date, d.value]));

  // Generate weeks grid
  const sortedDates = data.map((d) => d.date).sort();
  const startDate = sortedDates[0] ? new Date(sortedDates[0]) : new Date();
  const endDate = sortedDates[sortedDates.length - 1] ? new Date(sortedDates[sortedDates.length - 1]) : new Date();

  const weeks: Array<Array<{ date: string; value: number; dayOfWeek: number }>> = [];
  let currentWeek: Array<{ date: string; value: number; dayOfWeek: number }> = [];

  const cursor = new Date(startDate);
  // Align to start of week (Sunday)
  cursor.setDate(cursor.getDate() - cursor.getDay());

  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().split("T")[0];
    const dayOfWeek = cursor.getDay();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push({
      date: dateStr,
      value: dataMap.get(dateStr) ?? 0,
      dayOfWeek,
    });

    cursor.setDate(cursor.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const dayLabels = ["Sun", "", "Tue", "", "Thu", "", "Sat"];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <TooltipProvider>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 pr-1">
                {dayLabels.map((label, i) => (
                  <div key={i} className="h-3 text-[10px] leading-3 text-muted-foreground">
                    {label}
                  </div>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, di) => {
                    const day = week.find((d) => d.dayOfWeek === di);
                    if (!day) return <div key={di} className="h-3 w-3" />;

                    return (
                      <Tooltip key={di}>
                        <TooltipTrigger asChild>
                          <div
                            className="h-3 w-3 rounded-sm cursor-pointer"
                            style={{ backgroundColor: getColor(day.value, maxVal) }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {formatDate(day.date)}: {day.value} events
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <div
              key={ratio}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: getColor(ratio * maxVal, maxVal) }}
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
