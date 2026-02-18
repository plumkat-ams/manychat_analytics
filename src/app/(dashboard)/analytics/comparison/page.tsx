"use client";

import { useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { BarChartCard, RadarChartCard, BulletChart, CalendarHeatmap } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/dashboard/loading-skeleton";
import { trpc } from "@/lib/trpc";
import { useDateRange } from "@/hooks/use-date-range";
import { useAccount } from "@/hooks/use-account";
import { formatNumber, formatPercent, formatCurrency } from "@/lib/format";
import { subDays } from "@/lib/date-utils";
import { AiSummary } from "@/components/ai/ai-summary";

type ComparisonMetric = {
  label: string;
  valueA: number | string;
  valueB: number | string;
};

export default function ComparisonPage() {
  const { preset, setPreset, from, to } = useDateRange("30d");
  const { accountId } = useAccount();

  // Period comparison: current vs previous
  const periodDays = preset === "7d" ? 7 : preset === "14d" ? 14 : preset === "90d" ? 90 : 30;
  const periodBFrom = subDays(new Date(from), periodDays).toISOString();
  const periodBTo = from;

  // Memoize to avoid creating new Date objects each render (which would cause infinite re-fetches)
  const yearRange = useMemo(() => {
    const now = new Date();
    return {
      from: subDays(now, 365).toISOString(),
      to: now.toISOString(),
    };
  }, []);

  const periodComparison = trpc.comparison.comparePeriods.useQuery(
    {
      accountId,
      periodA: { from, to },
      periodB: { from: periodBFrom, to: periodBTo },
    },
    { enabled: !!accountId }
  );

  const contentComparison = trpc.comparison.getContentTypeComparison.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const goalProgress = trpc.comparison.getGoalProgress.useQuery(
    { accountId },
    { enabled: !!accountId }
  );

  const dailyEngagement = trpc.comparison.getDailyEngagement.useQuery(
    { accountId, from: yearRange.from, to: yearRange.to },
    { enabled: !!accountId }
  );

  // Build comparison table
  const comparisonMetrics: ComparisonMetric[] = periodComparison.data
    ? [
        { label: "New Subscribers", valueA: formatNumber(periodComparison.data.periodA.newSubscribers), valueB: formatNumber(periodComparison.data.periodB.newSubscribers) },
        { label: "Messages Sent", valueA: formatNumber(periodComparison.data.periodA.messagesSent), valueB: formatNumber(periodComparison.data.periodB.messagesSent) },
        { label: "Open Rate", valueA: formatPercent(periodComparison.data.periodA.openRate), valueB: formatPercent(periodComparison.data.periodB.openRate) },
        { label: "Conversions", valueA: formatNumber(periodComparison.data.periodA.conversions), valueB: formatNumber(periodComparison.data.periodB.conversions) },
        { label: "Revenue", valueA: formatCurrency(periodComparison.data.periodA.revenue), valueB: formatCurrency(periodComparison.data.periodB.revenue) },
        { label: "IG Reach", valueA: formatNumber(periodComparison.data.periodA.igReach), valueB: formatNumber(periodComparison.data.periodB.igReach) },
      ]
    : [];

  // Transform content comparison for radar chart
  const radarData = contentComparison.data?.length
    ? ["Reach", "Engagement", "Saves", "Shares", "Comments"].map((dimension) => {
        const entry: Record<string, string | number> = { dimension };
        for (const ct of contentComparison.data) {
          const key = ct.contentType;
          switch (dimension) {
            case "Reach": entry[key] = ct.avgReach ?? 0; break;
            case "Engagement": entry[key] = (ct.avgEngagement ?? 0) * 10; break;
            case "Saves": entry[key] = ct.avgSaves ?? 0; break;
            case "Shares": entry[key] = ct.avgShares ?? 0; break;
            case "Comments": entry[key] = ct.avgComments ?? 0; break;
          }
        }
        return entry;
      })
    : [];

  const radarSeries = contentComparison.data?.map((ct) => ({
    key: ct.contentType,
    label: ct.contentType,
  })) ?? [];

  // Transform goal progress for bullet chart
  const bulletData = goalProgress.data?.map((g) => ({
    metric: g.goalName,
    target: g.target,
    current: g.current,
    projected: g.projected,
  })) ?? [];

  // Transform daily engagement for calendar heatmap
  const calendarData = dailyEngagement.data?.map((d) => ({
    date: d.date,
    value: d.count,
  })) ?? [];

  return (
    <DashboardShell>
      <DashboardHeader
        title="Benchmarking & Comparisons"
        description="Compare performance across time periods, flows, and content types"
        badge="Later"
        dateRange={preset}
        onDateRangeChange={setPreset}
      />

      {/* AI SUMMARY */}
      <AiSummary view="comparison" />

      {/* Period-over-Period Comparison */}
      {periodComparison.isLoading ? (
        <ChartSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Period Comparison: Current vs. Previous {periodDays} Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-primary">Current Period</h4>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Previous Period</h4>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {comparisonMetrics.map((metric) => (
                <div key={metric.label} className="grid grid-cols-3 items-center gap-4 border-b py-2">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className="text-right text-sm font-semibold text-primary">{metric.valueA}</span>
                  <span className="text-right text-sm text-muted-foreground">{metric.valueB}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Radar Chart: Content Type Comparison */}
        {contentComparison.isLoading ? (
          <ChartSkeleton />
        ) : radarData.length > 0 ? (
          <RadarChartCard
            title="Content Type Comparison"
            data={radarData}
            dimensions={["Reach", "Engagement", "Saves", "Shares", "Comments"]}
            series={radarSeries}
          />
        ) : null}

        {/* Goal Progress Bullet Chart */}
        {goalProgress.isLoading ? (
          <ChartSkeleton />
        ) : bulletData.length > 0 ? (
          <BulletChart title="Monthly Goals vs. Current Trajectory" data={bulletData} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No conversion goals configured. Set up goals in the Conversion dashboard.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Calendar Heatmap */}
      {dailyEngagement.isLoading ? (
        <ChartSkeleton />
      ) : (
        <CalendarHeatmap
          title="Daily Engagement Intensity (Past Year)"
          data={calendarData}
        />
      )}
    </DashboardShell>
  );
}
