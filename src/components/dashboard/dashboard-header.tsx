"use client";

import { DateRangePicker } from "./date-range-picker";
import type { DatePreset } from "@/lib/date-utils";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  dateRange?: DatePreset;
  onDateRangeChange?: (value: DatePreset) => void;
};

export function DashboardHeader({ title, description, badge, dateRange, onDateRangeChange }: DashboardHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          {badge && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-muted-foreground/20">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {dateRange && onDateRangeChange && (
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      )}
    </div>
  );
}
