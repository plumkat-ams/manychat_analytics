import { AnalyticsTabs } from "@/components/dashboard/analytics-tabs";

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <AnalyticsTabs />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
