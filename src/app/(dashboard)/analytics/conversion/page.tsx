"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricCard, FunnelChart, BarChartCard } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCardSkeleton, ChartSkeleton } from "@/components/dashboard/loading-skeleton";
import { trpc } from "@/lib/trpc";
import { useDateRange } from "@/hooks/use-date-range";
import { useAccount } from "@/hooks/use-account";
import { formatNumber, formatCurrency } from "@/lib/format";
import { CHART_COLORS } from "@/lib/constants";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AiSummary } from "@/components/ai/ai-summary";

export default function ConversionPage() {
  const { preset, setPreset, from, to } = useDateRange("30d");
  const { accountId } = useAccount();

  const metrics = trpc.conversion.getMetrics.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const funnel = trpc.conversion.getJourneyFunnel.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const revenueByFlow = trpc.conversion.getRevenueByFlow.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const ttc = trpc.conversion.getTimeToConversion.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const revenueData = revenueByFlow.data?.map((r) => ({
    name: r.flowName.length > 25 ? r.flowName.slice(0, 25) + "..." : r.flowName,
    revenue: r.revenue,
    conversions: r.conversions,
  })) ?? [];

  const ttcData = (ttc.data as Array<{ bucket: string; count: number }>) ?? [];

  return (
    <DashboardShell>
      <DashboardHeader
        title="Conversion Tracking"
        description="Connect Instagram + Manychat activity to revenue"
        badge="Later"
        dateRange={preset}
        onDateRangeChange={setPreset}
      />

      {/* AI SUMMARY */}
      <AiSummary view="conversion" />

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : metrics.data ? (
          <>
            <MetricCard
              label="Conversions"
              value={metrics.data.conversions.current}
              previousValue={metrics.data.conversions.previous}
            />
            <MetricCard
              label="Revenue"
              value={metrics.data.revenue.current}
              previousValue={metrics.data.revenue.previous}
              format="currency"
            />
            <MetricCard
              label="Conversion Rate"
              value={metrics.data.conversionRate}
              format="percent"
            />
            <MetricCard
              label="Cost per Acquisition"
              value={metrics.data.cac}
              format="currency"
            />
          </>
        ) : null}
      </div>

      {/* Journey Funnel */}
      {funnel.isLoading ? (
        <ChartSkeleton />
      ) : funnel.data ? (
        <FunnelChart
          title="Full Journey Funnel: IG Impression -> Follow -> DM -> Subscriber -> Converted"
          data={funnel.data}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue by Flow */}
        {revenueByFlow.isLoading ? (
          <ChartSkeleton />
        ) : (
          <BarChartCard
            title="Revenue Attribution by Flow"
            data={revenueData}
            bars={[{ key: "revenue", label: "Revenue ($)" }]}
            horizontal
          />
        )}

        {/* Time-to-Conversion Histogram */}
        {ttc.isLoading ? (
          <ChartSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Time-to-Conversion Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ttcData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="bucket" tick={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs" />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Conversions"
                      fill={CHART_COLORS.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
