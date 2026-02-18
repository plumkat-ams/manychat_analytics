"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DatePreset } from "@/lib/date-utils";

type DateRangePickerProps = {
  value: DatePreset;
  onChange: (value: DatePreset) => void;
};

const presets: Array<{ value: DatePreset; label: string }> = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DatePreset)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select date range" />
      </SelectTrigger>
      <SelectContent>
        {presets.map((preset) => (
          <SelectItem key={preset.value} value={preset.value}>
            {preset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
