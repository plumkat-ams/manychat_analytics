"use client";

import { useState, useMemo } from "react";
import { type DatePreset, getDatePresetRange } from "@/lib/date-utils";

export function useDateRange(defaultPreset: DatePreset = "30d") {
  const [preset, setPreset] = useState<DatePreset>(defaultPreset);

  const range = useMemo(() => getDatePresetRange(preset), [preset]);

  return {
    preset,
    setPreset,
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    fromDate: range.from,
    toDate: range.to,
  };
}
