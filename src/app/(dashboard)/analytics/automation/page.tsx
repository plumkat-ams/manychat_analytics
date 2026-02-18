"use client";

import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/dashboard/loading-skeleton";
import { trpc } from "@/lib/trpc";
import { useDateRange } from "@/hooks/use-date-range";
import { useAccount } from "@/hooks/use-account";
import { formatNumber, formatPercent } from "@/lib/format";
import {
  ArrowLeft,
  ChevronRight,
  Instagram,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  Trophy,
  Zap,
  Clock,
  Users,
  Target,
  Activity,
} from "lucide-react";
import { AiSummary } from "@/components/ai/ai-summary";
import { AskAiButton, AskAiModal, useFlowAnalysis } from "@/components/ai/ask-ai-modal";

/* ───── Channel icon helper ───── */
function ChannelIcons({ channels }: { channels: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {channels.map((ch) =>
        ch === "instagram" ? (
          <Instagram key={ch} className="h-3.5 w-3.5 text-pink-500" />
        ) : ch === "messenger" ? (
          <MessageCircle key={ch} className="h-3.5 w-3.5 text-blue-500" />
        ) : null
      )}
    </div>
  );
}

/* ───── Status badge ───── */
function StatusBadge({ status }: { status: "ok" | "warning" | "broken" }) {
  const config = {
    ok: { label: "OK", variant: "success" as const },
    warning: { label: "Warning", variant: "warning" as const },
    broken: { label: "Broken", variant: "destructive" as const },
  };
  const c = config[status];
  return (
    <Badge variant={c.variant} className="text-[11px]">
      {c.label}
    </Badge>
  );
}

/* ───── Funnel step bar ───── */
function StepBar({
  step,
  maxReached,
}: {
  step: { stepNumber: number; name: string; type: string; reached: number; completed: number; dropOff: number; dropOffRate: number };
  maxReached: number;
}) {
  const widthPct = maxReached > 0 ? (step.reached / maxReached) * 100 : 0;
  const completedPct = step.reached > 0 ? (step.completed / step.reached) * 100 : 0;
  const color =
    step.dropOffRate <= 5 ? "bg-emerald-500" : step.dropOffRate <= 20 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="flex items-center gap-3">
      <div className="w-5 shrink-0 text-center text-xs font-medium text-muted-foreground">
        {step.stepNumber}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{step.name}</span>
          <span className="text-xs text-muted-foreground">{step.type}</span>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-md bg-muted/40">
          <div
            className={`absolute inset-y-0 left-0 ${color} transition-all`}
            style={{ width: `${widthPct}%` }}
          />
          <div className="relative flex h-full items-center justify-between px-2 text-[11px] font-medium text-white mix-blend-difference">
            <span>{formatNumber(step.reached)} reached</span>
            <span>{completedPct.toFixed(0)}% completed</span>
          </div>
        </div>
        <div className="flex gap-4 text-[11px] text-muted-foreground">
          <span>Completed: {formatNumber(step.completed)}</span>
          <span>Drop-off: {formatNumber(step.dropOff)} ({step.dropOffRate.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function AutomationPage() {
  const { preset, setPreset, from, to } = useDateRange("30d");
  const { accountId } = useAccount();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const flowAi = useFlowAnalysis();

  /* ── queries ── */
  const flows = trpc.automation.getFlows.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const flowSteps = trpc.automation.getFlowSteps.useQuery(
    { flowId: selectedFlowId! },
    { enabled: !!selectedFlowId }
  );

  const flowIssues = trpc.automation.getFlowIssues.useQuery(
    { flowId: selectedFlowId! },
    { enabled: !!selectedFlowId }
  );

  const insights = trpc.automation.getInsights.useQuery(
    { accountId },
    { enabled: !!accountId }
  );

  /* ── derived ── */
  const leaderboard = useMemo(
    () => (flows.data ? [...flows.data].sort((a, b) => b.leads - a.leads) : []),
    [flows.data]
  );

  const selectedFlow = useMemo(
    () => flows.data?.find((f) => f.id === selectedFlowId) ?? null,
    [flows.data, selectedFlowId]
  );

  const maxReached = useMemo(
    () => Math.max(...(flowSteps.data?.map((s) => s.reached) ?? [1])),
    [flowSteps.data]
  );

  /* ── totals for hero cards ── */
  const totals = useMemo(() => {
    if (!flows.data) return null;
    return {
      totalFlows: flows.data.length,
      totalEntries: flows.data.reduce((s, f) => s + f.entries, 0),
      totalLeads: flows.data.reduce((s, f) => s + f.leads, 0),
      totalTimeSaved: flows.data.reduce((s, f) => s + f.timeSaved, 0),
      avgConvRate:
        flows.data.length > 0
          ? flows.data.reduce((s, f) => s + f.conversionRate, 0) / flows.data.length
          : 0,
    };
  }, [flows.data]);

  /* ───────────── FLOW DETAIL VIEW ───────────── */
  if (selectedFlowId && selectedFlow) {
    return (
      <DashboardShell>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFlowId(null)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/60"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h2 className="text-lg font-semibold">{selectedFlow.name}</h2>
          <StatusBadge status={selectedFlow.status} />
          <ChannelIcons channels={selectedFlow.channels} />
          <div className="ml-auto">
            <AskAiButton
              label={selectedFlow.status !== "ok" ? "Ask AI why this is underperforming" : "Ask AI to analyze"}
              size="md"
              onClick={() => flowAi.openAnalysis(selectedFlow.id)}
            />
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Entries", value: formatNumber(selectedFlow.entries), icon: Users },
            { label: "Completion", value: formatPercent(selectedFlow.completionRate), icon: Activity },
            { label: "Leads", value: formatNumber(selectedFlow.leads), icon: Target },
            { label: "Conv. rate", value: formatPercent(selectedFlow.conversionRate), icon: Zap },
            { label: "Time saved", value: `${selectedFlow.timeSaved}h`, icon: Clock },
          ].map((m) => (
            <Card key={m.label} className="p-3">
              <div className="flex items-center gap-2">
                <m.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="text-lg font-bold">{m.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Funnel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Flow Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flowSteps.isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : (
              flowSteps.data?.map((step) => (
                <StepBar key={step.id} step={step} maxReached={maxReached} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Top issues */}
        {flowIssues.data && flowIssues.data.length > 0 && (
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                Top Issues in This Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {flowIssues.data.map((issue) => (
                <div
                  key={issue.stepNumber}
                  className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/30"
                >
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-amber-600">
                    Step {issue.stepNumber}
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">{issue.stepName}:</span>{" "}
                    {issue.issue}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </DashboardShell>
    );
  }

  /* ───────────── MAIN LIST VIEW ───────────── */
  return (
    <DashboardShell>
      <DashboardHeader
        title="Automation Performance"
        description="Every flow with conversion data and health metrics"
        dateRange={preset}
        onDateRangeChange={setPreset}
      />

      {/* ── AI SUMMARY ── */}
      <AiSummary view="automation" />

      {/* ── Hero summary cards ── */}
      {totals && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Total Flows", value: String(totals.totalFlows), icon: Activity },
            { label: "Total Entries", value: formatNumber(totals.totalEntries), icon: Users },
            { label: "Total Leads", value: formatNumber(totals.totalLeads), icon: Target },
            { label: "Avg Conv. Rate", value: formatPercent(totals.avgConvRate), icon: Zap },
            { label: "Time Saved", value: `${totals.totalTimeSaved}h`, icon: Clock },
          ].map((m) => (
            <Card key={m.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <m.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="text-xl font-bold">{m.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Flow Leaderboard / Table ── */}
      {flows.isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Flow Leaderboard
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Ranked by leads generated
            </span>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Flow</th>
                    <th className="px-3 py-2">Channels</th>
                    <th className="px-3 py-2 text-right">Entries</th>
                    <th className="px-3 py-2 text-right">Completion</th>
                    <th className="px-3 py-2 text-right">Leads</th>
                    <th className="px-3 py-2 text-right">Conv. Rate</th>
                    <th className="px-3 py-2 text-right">Time Saved</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((flow, idx) => (
                    <tr
                      key={flow.id}
                      className="group cursor-pointer border-b transition-colors hover:bg-muted/50"
                      onClick={() => setSelectedFlowId(flow.id)}
                    >
                      <td className="px-3 py-3 font-medium text-muted-foreground">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <span className="font-medium">{flow.name}</span>
                        {flow.issueTag && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-500/20">
                            {flow.issueTag}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <ChannelIcons channels={flow.channels} />
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {formatNumber(flow.entries)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                flow.completionRate >= 70
                                  ? "bg-emerald-500"
                                  : flow.completionRate >= 40
                                  ? "bg-amber-400"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${flow.completionRate}%` }}
                            />
                          </div>
                          <span className="tabular-nums">{flow.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {formatNumber(flow.leads)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {formatPercent(flow.conversionRate)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                        {flow.timeSaved}h
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={flow.status} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(flow.status === "broken" || flow.status === "warning") && (
                            <AskAiButton
                              label="Ask AI"
                              onClick={() => flowAi.openAnalysis(flow.id)}
                            />
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">
                        No flows found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Smart Insights ── */}
      {insights.data && insights.data.length > 0 && (
        <Card>
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

      {/* Ask AI Modal */}
      <AskAiModal
        open={flowAi.isOpen}
        onClose={flowAi.closeAnalysis}
        analysis={flowAi.analysis}
        isLoading={flowAi.isLoading}
      />
    </DashboardShell>
  );
}
