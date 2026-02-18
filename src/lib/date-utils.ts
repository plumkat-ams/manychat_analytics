import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  parseISO,
  isValid,
} from "date-fns";

export type DateRange = {
  from: Date;
  to: Date;
};

export type DatePreset = "7d" | "14d" | "30d" | "90d" | "custom";

export function getDatePresetRange(preset: DatePreset): DateRange {
  const now = new Date();
  switch (preset) {
    case "7d":
      return { from: subDays(now, 7), to: now };
    case "14d":
      return { from: subDays(now, 14), to: now };
    case "30d":
      return { from: subDays(now, 30), to: now };
    case "90d":
      return { from: subDays(now, 90), to: now };
    default:
      return { from: subDays(now, 30), to: now };
  }
}

export function formatDate(date: Date | string, fmt: string = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) ? format(d, fmt) : "Invalid date";
}

export function formatShortDate(date: Date | string): string {
  return formatDate(date, "MMM d");
}

export function getDaysInRange(range: DateRange): Date[] {
  return eachDayOfInterval({ start: range.from, end: range.to });
}

export function getWeeksInRange(range: DateRange): Date[] {
  return eachWeekOfInterval({ start: range.from, end: range.to });
}

export function daysBetween(from: Date, to: Date): number {
  return differenceInDays(to, from);
}

export { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, format, parseISO };
