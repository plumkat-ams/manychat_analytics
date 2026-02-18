"use client";

import { useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartSkeleton, TableSkeleton } from "@/components/dashboard/loading-skeleton";
import { trpc } from "@/lib/trpc";
import { useDateRange } from "@/hooks/use-date-range";
import { useAccount } from "@/hooks/use-account";
import { formatNumber, formatPercent } from "@/lib/format";
import { CHART_COLORS } from "@/lib/constants";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  UserPlus,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Film,
  ExternalLink,
  Users,
  Activity,
} from "lucide-react";
import { AiSummary } from "@/components/ai/ai-summary";

/* ───── helpers ───── */
function RingProgress({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AudiencePage() {
  const { preset, setPreset, from, to } = useDateRange("30d");
  const { accountId } = useAccount();

  /* ── queries ── */
  const conversion = trpc.audience.getFollowerConversion.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const sources = trpc.audience.getSourceAttribution.useQuery(
    { accountId, from, to, limit: 5 },
    { enabled: !!accountId }
  );

  const quality = trpc.audience.getQualityTrend.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const insights = trpc.audience.getInsights.useQuery(
    { accountId },
    { enabled: !!accountId }
  );

  /* ── chart data ── */
  const qualityChartData = useMemo(() => {
    if (!quality.data) return [];
    return quality.data.map((d) => ({
      date: d.date.slice(5),
      "New Followers": d.newFollowers,
      "Touch Rate %": d.touchRatePct,
    }));
  }, [quality.data]);

  const conv = conversion.data;

  return (
    <DashboardShell>
      <DashboardHeader
        title="Audience"
        description="Follower conversion, source attribution & quality trends"
        dateRange={preset}
        onDateRangeChange={setPreset}
      />

      {/* ═══════ AI SUMMARY ═══════ */}
      <AiSummary view="audience" />

      {/* ═══════ 1. FOLLOWER CONVERSION ANALYSIS ═══════ */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            Follower Conversion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conversion.isLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : conv ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* New Followers */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    New Followers
                  </p>
                  <p className="text-2xl font-bold">{formatNumber(conv.newFollowers)}</p>
                </div>
              </div>

              {/* Entered Flows */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <RingProgress pct={conv.enteredFlowsPct} color={CHART_COLORS.secondary} />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Entered Flows (7d)
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPercent(conv.enteredFlowsPct)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(conv.enteredFlowsWithin7d)} of {formatNumber(conv.newFollowers)}
                  </p>
                </div>
              </div>

              {/* Became Leads */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <RingProgress pct={conv.becameLeadsPct} color={CHART_COLORS.success} />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Became Leads
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPercent(conv.becameLeadsPct)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(conv.becameLeads)} leads
                  </p>
                </div>
              </div>

              {/* Conversion: New vs Existing */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    New vs Existing
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatPercent(conv.newFollowerConvRate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    vs {formatPercent(conv.existingAudienceConvRate)} existing
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* ═══════ 2. FOLLOWER SOURCE ATTRIBUTION ═══════ */}
      {sources.isLoading ? (
        <TableSkeleton />
      ) : sources.data && sources.data.length > 0 ? (
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Film className="h-4 w-4 text-primary" />
              Top Content by Follower Acquisition
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              Linked to Content
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Content</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2 text-right">New Followers</th>
                    <th className="px-3 py-2 text-right">Leads</th>
                    <th className="px-3 py-2 text-right">Conv. Rate</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {sources.data.map((item, idx) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-3 py-2.5 font-medium text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="max-w-[280px] truncate px-3 py-2.5 font-medium">
                        {item.caption}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant="outline" className="text-[10px]">
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                        +{formatNumber(item.followers)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        {formatNumber(item.leads)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(item.conversionRate, 100)}%` }}
                            />
                          </div>
                          <span className="tabular-nums">{formatPercent(item.conversionRate)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <a
                          href={`/analytics/content?highlight=${item.id}`}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* ═══════ 3. AUDIENCE QUALITY TRENDS ═══════ */}
      {quality.isLoading ? (
        <ChartSkeleton />
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Audience Quality — New Followers vs Touch Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qualityChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    interval={4}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickFormatter={(v: number) => String(v)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    tickFormatter={(v: number) => `${v}%`}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="New Followers"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Touch Rate %"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-4 rounded" style={{ backgroundColor: CHART_COLORS.primary }} />
                New Followers (left axis)
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-4 rounded border-b border-dashed" style={{ borderColor: CHART_COLORS.success }} />
                Touch Rate % (right axis)
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══════ 4. SMART INSIGHTS ═══════ */}
      {insights.data && insights.data.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" />
              Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.data.map((insight, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
                  insight.type === "tip"
                    ? "bg-blue-50 dark:bg-blue-950/30"
                    : "bg-amber-50 dark:bg-amber-950/30"
                }`}
              >
                {insight.type === "tip" ? (
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                )}
                <span className="text-muted-foreground">{insight.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}
