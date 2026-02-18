"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useDateRange } from "@/hooks/use-date-range";
import { useAccount } from "@/hooks/use-account";
import { formatNumber, formatPercent } from "@/lib/format";
import { formatShortDate } from "@/lib/date-utils";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Zap,
  Target,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Instagram,
  MessageCircle,
  CheckCircle2,
  Image as ImageIcon,
  Film,
  LayoutGrid,
  BookOpen,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { AiSummary } from "@/components/ai/ai-summary";
import { AskAiButton, AskAiModal, useCoverageAnalysis } from "@/components/ai/ask-ai-modal";

/* ──────────────────── Helpers ──────────────────── */

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return <span className="text-xs text-emerald-500 font-medium">New</span>;
  const delta = ((current - previous) / previous) * 100;
  const isUp = delta >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isUp ? "text-emerald-500" : "text-red-500"}`}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isUp ? "+" : ""}{delta.toFixed(1)}%
    </span>
  );
}

function ContentTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t === "reel" || t === "video") return <Film className="h-3.5 w-3.5" />;
  if (t === "carousel") return <LayoutGrid className="h-3.5 w-3.5" />;
  if (t === "story") return <BookOpen className="h-3.5 w-3.5" />;
  return <ImageIcon className="h-3.5 w-3.5" />;
}

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === "instagram") return <Instagram className="h-3.5 w-3.5 text-pink-500" />;
  if (channel === "messenger") return <MessageCircle className="h-3.5 w-3.5 text-primary" />;
  return <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />;
}

function CoverageDot({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

/* ──────────────────── Trend mini-chart ──────────────────── */

function TrendChart({
  title,
  data,
  days,
  setDays,
  color,
  valuePrefix,
  valueSuffix,
}: {
  title: string;
  data: Array<{ date: string; value: number }>;
  days: number;
  setDays: (d: number) => void;
  color: string;
  valuePrefix?: string;
  valueSuffix?: string;
}) {
  const sliced = data.slice(-days);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <div className="flex gap-1">
            {[30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  days === d
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sliced} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => formatShortDate(v)}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `${valuePrefix ?? ""}${formatNumber(v)}${valueSuffix ?? ""}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: 12,
                }}
                formatter={(v: number) => [
                  `${valuePrefix ?? ""}${v.toFixed(1)}${valueSuffix ?? ""}`,
                  title,
                ]}
                labelFormatter={(l) => formatShortDate(l as string)}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`url(#grad-${title})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* ──────────────────── Main page ──────────────────── */

export default function OverviewPage() {
  const { preset, setPreset, from, to } = useDateRange("30d");
  const { accountId } = useAccount();

  const coverageAi = useCoverageAnalysis();
  const [touchDays, setTouchDays] = useState(30);
  const [leadDays, setLeadDays] = useState(30);
  const [followerDays, setFollowerDays] = useState(30);

  const snapshot = trpc.overview.getBusinessSnapshot.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const topContent = trpc.overview.getTopContent.useQuery(
    { accountId, from, to, limit: 5 },
    { enabled: !!accountId }
  );

  const topFlows = trpc.overview.getTopFlows.useQuery(
    { accountId, from, to, limit: 5 },
    { enabled: !!accountId }
  );

  const alerts = trpc.overview.getAlerts.useQuery(
    { accountId },
    { enabled: !!accountId }
  );

  const opportunities = trpc.overview.getOpportunities.useQuery(
    { accountId },
    { enabled: !!accountId }
  );

  const trends = trpc.overview.getProgressTrends.useQuery(
    { accountId },
    { enabled: !!accountId }
  );

  const s = snapshot.data;

  return (
    <DashboardShell>
      <DashboardHeader
        title="Overview"
        description="Your ManyChat command center"
        dateRange={preset}
        onDateRangeChange={setPreset}
      />

      {/* ─── AI SUMMARY ─── */}
      <AiSummary view="overview" />

      {/* ─── 1. BUSINESS SNAPSHOT ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Leads */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Leads</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">
                    {s ? formatNumber(s.leads.current) : "—"}
                  </p>
                  {s && <DeltaBadge current={s.leads.current} previous={s.leads.previous} />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Touch Rate */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Touch Rate</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">
                    {s ? formatPercent(s.touchRate.value) : "—"}
                  </p>
                  {s && <DeltaBadge current={s.touchRate.value} previous={s.touchRate.previous} />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Saved */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Clock className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold text-foreground">
                  {s ? `${s.timeSaved.hours}h` : "—"}
                </p>
                <p className="text-[11px] text-muted-foreground">automated vs manual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Follower Growth */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Follower Growth</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">
                    {s ? `+${formatNumber(s.followerGrowth.netNew)}` : "—"}
                  </p>
                  {s && (
                    <span className="text-xs font-medium text-emerald-500">
                      +{s.followerGrowth.percentChange}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 2. WHERE RESULTS COME FROM ─── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Content</CardTitle>
              <span className="text-[11px] text-muted-foreground">by leads / 1K reach</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_70px_80px] gap-2 border-b pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <span>Content</span>
                <span className="text-right">Leads/1K</span>
                <span className="text-right">Leads</span>
                <span className="text-right">Coverage</span>
              </div>
              {/* Rows */}
              {topContent.data?.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_80px_70px_80px] items-center gap-2 border-b border-border/50 py-2.5 last:border-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <ContentTypeIcon type={item.type} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.type} · {formatNumber(item.reach)} reach</p>
                    </div>
                  </div>
                  <p className="text-right text-sm font-semibold text-primary">{item.leadsPerKReach.toFixed(1)}</p>
                  <p className="text-right text-sm text-foreground">{formatNumber(item.leads)}</p>
                  <div className="flex justify-end">
                    <CoverageDot value={item.automationCoverage} />
                  </div>
                </div>
              ))}
              {!topContent.data && (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Flows */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Flows</CardTitle>
              <span className="text-[11px] text-muted-foreground">by conversions</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_70px_60px] gap-2 border-b pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <span>Flow</span>
                <span className="text-right">Conv. Rate</span>
                <span className="text-right">Leads</span>
                <span className="text-right">Status</span>
              </div>
              {/* Rows */}
              {topFlows.data?.map((flow) => (
                <div
                  key={flow.id}
                  className="grid grid-cols-[1fr_80px_70px_60px] items-center gap-2 border-b border-border/50 py-2.5 last:border-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex shrink-0 gap-0.5">
                      {flow.channels.map((ch) => (
                        <ChannelIcon key={ch} channel={ch} />
                      ))}
                    </div>
                    <p className="truncate text-sm font-medium text-foreground">{flow.name}</p>
                  </div>
                  <p className="text-right text-sm font-semibold text-primary">
                    {formatPercent(flow.conversionRate)}
                  </p>
                  <p className="text-right text-sm text-foreground">{formatNumber(flow.leads)}</p>
                  <div className="flex justify-end">
                    {flow.status === "ok" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}
              {!topFlows.data && (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 3 & 4. BROKEN / RISKY  +  MISSED OPPORTUNITIES ─── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* What's Broken or Risky */}
        {alerts.data && alerts.data.length > 0 && (
          <Card className="border-red-200 dark:border-red-900/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <CardTitle className="text-red-600 dark:text-red-400">Broken or Risky</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {alerts.data.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center gap-2.5 border-b border-border/50 py-2.5 last:border-0"
                  >
                    {alert.severity === "critical" ? (
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{alert.title}</p>
                      <p className={`text-[11px] font-medium ${
                        alert.severity === "critical" ? "text-red-500" : "text-amber-500"
                      }`}>
                        {alert.estimatedImpact}
                      </p>
                    </div>
                    <button
                      className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        alert.action === "Fix"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "border border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950"
                      }`}
                    >
                      {alert.action}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Missed Opportunities */}
        {opportunities.data && opportunities.data.length > 0 && (
          <Card className="border-blue-200 dark:border-blue-900/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-blue-600 dark:text-blue-400">Missed Opportunities</CardTitle>
                <div className="ml-auto">
                  <AskAiButton
                    label="AI: fastest path to 30% touch rate"
                    size="sm"
                    onClick={coverageAi.openAnalysis}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {opportunities.data.map((opp) => (
                  <div
                    key={opp.id}
                    className="flex items-center gap-2.5 border-b border-border/50 py-2.5 last:border-0"
                  >
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{opp.title}</p>
                      <div className="flex items-center gap-2 text-[11px] font-medium">
                        {opp.estimatedLeads != null && (
                          <span className="text-blue-500">~{opp.estimatedLeads} leads</span>
                        )}
                        <span className="text-emerald-500">{opp.estimatedRevenue}</span>
                      </div>
                    </div>
                    <button className="shrink-0 rounded-md border border-primary/30 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/5">
                      Build
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── 5. PROGRESS / TRENDS ─── */}
      {trends.data && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Progress &amp; Trends</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            <TrendChart
              title="Touch Rate"
              data={trends.data.touchRate}
              days={touchDays}
              setDays={setTouchDays}
              color={CHART_COLORS.primary}
              valueSuffix="%"
            />
            <TrendChart
              title="Leads"
              data={trends.data.leads}
              days={leadDays}
              setDays={setLeadDays}
              color={CHART_COLORS.secondary}
            />
            <TrendChart
              title="Follower Growth"
              data={trends.data.followerGrowth}
              days={followerDays}
              setDays={setFollowerDays}
              color={CHART_COLORS.tertiary}
              valuePrefix="+"
            />
          </div>
        </div>
      )}

      {/* Ask AI Modal */}
      <AskAiModal
        open={coverageAi.isOpen}
        onClose={coverageAi.closeAnalysis}
        analysis={coverageAi.analysis}
        isLoading={coverageAi.isLoading}
      />
    </DashboardShell>
  );
}
