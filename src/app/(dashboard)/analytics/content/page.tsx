"use client";

import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/dashboard/loading-skeleton";
import { trpc } from "@/lib/trpc";
import { useDateRange } from "@/hooks/use-date-range";
import { useAccount } from "@/hooks/use-account";
import { formatNumber, formatPercent } from "@/lib/format";
import { formatDate } from "@/lib/date-utils";
import {
  Film,
  LayoutGrid,
  ImageIcon,
  BookOpen,
  Zap,
  Eye,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { AiSummary } from "@/components/ai/ai-summary";
import { AskAiButton, AskAiModal, useContentAnalysis } from "@/components/ai/ask-ai-modal";

/* ──────────── helpers ──────────── */

type SortKey = "leadsPerKReach" | "reach" | "engagementRate" | "saves" | "leads" | "publishedAt";

function TypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t === "reel" || t === "video") return <Film className="h-3.5 w-3.5" />;
  if (t === "carousel") return <LayoutGrid className="h-3.5 w-3.5" />;
  if (t === "story") return <BookOpen className="h-3.5 w-3.5" />;
  return <ImageIcon className="h-3.5 w-3.5" />;
}

function CoverageBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-12 rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="text-[11px] text-muted-foreground">{value}%</span>
    </div>
  );
}

type SmartFilter = "all" | "high-reach-low-auto" | "high-saves-low-leads";

/* ──────────── page ──────────── */

export default function ContentPage() {
  const { preset, setPreset, from, to } = useDateRange("30d");
  const { accountId } = useAccount();
  const [sortBy, setSortBy] = useState<SortKey>("leadsPerKReach");
  const [contentTypeFilter, setContentTypeFilter] = useState<string | undefined>();
  const [smartFilter, setSmartFilter] = useState<SmartFilter>("all");
  const contentAi = useContentAnalysis();

  const summary = trpc.content.getSummary.useQuery(
    { accountId, from, to },
    { enabled: !!accountId }
  );

  const posts = trpc.content.getPosts.useQuery(
    { accountId, from, to, sortBy, contentType: contentTypeFilter, limit: 50 },
    { enabled: !!accountId }
  );

  /* smart-filter the posts client-side */
  const filteredPosts = useMemo(() => {
    if (!posts.data) return [];
    const all = [...posts.data];
    if (smartFilter === "all") return all;

    const reaches = all.map((p) => p.reach).sort((a, b) => a - b);
    const saves = all.map((p) => p.saves).sort((a, b) => a - b);
    const leads = all.map((p) => p.leads).sort((a, b) => a - b);
    const p75reach = reaches[Math.floor(reaches.length * 0.75)] ?? 0;
    const p75saves = saves[Math.floor(saves.length * 0.75)] ?? 0;
    const p25leads = leads[Math.floor(leads.length * 0.25)] ?? 0;

    if (smartFilter === "high-reach-low-auto") {
      return all.filter((p) => p.reach >= p75reach && p.automationCoverage <= 25);
    }
    if (smartFilter === "high-saves-low-leads") {
      return all.filter((p) => p.saves >= p75saves && p.leads <= p25leads);
    }
    return all;
  }, [posts.data, smartFilter]);

  const sm = summary.data;

  return (
    <DashboardShell>
      <DashboardHeader
        title="Content & Campaigns"
        description="Which posts and formats drive outcomes"
        dateRange={preset}
        onDateRangeChange={setPreset}
      />

      {/* ─── AI SUMMARY ─── */}
      <AiSummary view="content" />

      {/* ─── TOP REGION: Summary ─── */}
      {sm && (
        <div className="space-y-4">
          {/* Headline */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-4.5 w-4.5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{sm.headline}</p>
              <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                <span>{sm.totalPosts} posts</span>
                <span>{formatNumber(sm.totalReach)} reach</span>
                <span>{formatNumber(sm.totalLeads)} leads</span>
              </div>
            </CardContent>
          </Card>

          {/* Best content types */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sm.byType.map((t) => (
              <Card key={t.type}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <TypeIcon type={t.type} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{t.type}s</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{t.count} posts</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">{formatPercent(t.avgEngagementRate)}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Eng. Rate</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{t.leadsPerKReach}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Leads/1K</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{t.leadsShare}%</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lead Share</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── MAIN TABLE ─── */}
      {posts.isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>All Content</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {/* Smart presets */}
                <div className="flex rounded-lg border border-input overflow-hidden text-[11px]">
                  {([
                    { key: "all", label: "All" },
                    { key: "high-reach-low-auto", label: "High Reach, Low Auto" },
                    { key: "high-saves-low-leads", label: "High Saves, Low Leads" },
                  ] as const).map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setSmartFilter(f.key)}
                      className={`px-2.5 py-1 font-medium transition-colors ${
                        smartFilter === f.key
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Type filter */}
                <select
                  value={contentTypeFilter ?? ""}
                  onChange={(e) => setContentTypeFilter(e.target.value || undefined)}
                  className="h-7 rounded-lg border border-input bg-card px-2 text-[11px] text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">All Types</option>
                  {["Reel", "Carousel", "Post", "Story"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="h-7 rounded-lg border border-input bg-card px-2 text-[11px] text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="leadsPerKReach">Leads / 1K Reach</option>
                  <option value="leads">Total Leads</option>
                  <option value="reach">Reach</option>
                  <option value="engagementRate">Engagement Rate</option>
                  <option value="saves">Saves</option>
                  <option value="publishedAt">Date</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <th className="px-2 py-2 text-left">Content</th>
                    <th className="px-2 py-2 text-left">Type</th>
                    <th className="px-2 py-2 text-left">Date</th>
                    <th className="px-2 py-2 text-right">Reach</th>
                    <th className="px-2 py-2 text-right">Eng. Rate</th>
                    <th className="px-2 py-2 text-right">Saves</th>
                    <th className="px-2 py-2 text-right">Coverage</th>
                    <th className="px-2 py-2 text-right">Leads</th>
                    <th className="px-2 py-2 text-right">Leads/1K</th>
                    <th className="px-2 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      {/* Content */}
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <TypeIcon type={post.contentType} />
                          </div>
                          <span className="max-w-[220px] truncate text-sm text-foreground">
                            {post.caption?.slice(0, 55) ?? "No caption"}
                          </span>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-2 py-2.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          <TypeIcon type={post.contentType} />
                          {post.contentType}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-2 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(post.publishedAt)}
                      </td>
                      {/* Reach */}
                      <td className="px-2 py-2.5 text-right text-sm">{formatNumber(post.reach)}</td>
                      {/* Engagement Rate */}
                      <td className="px-2 py-2.5 text-right text-sm">{formatPercent(post.engagementRate)}</td>
                      {/* Saves */}
                      <td className="px-2 py-2.5 text-right text-sm">{formatNumber(post.saves)}</td>
                      {/* Automation Coverage */}
                      <td className="px-2 py-2.5">
                        <div className="flex justify-end">
                          <CoverageBar value={post.automationCoverage} />
                        </div>
                      </td>
                      {/* Leads */}
                      <td className="px-2 py-2.5 text-right text-sm font-medium">{formatNumber(post.leads)}</td>
                      {/* Leads per 1K reach */}
                      <td className="px-2 py-2.5 text-right text-sm font-semibold text-primary">
                        {post.leadsPerKReach}
                      </td>
                      {/* Action */}
                      <td className="px-2 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <AskAiButton
                            label={post.leadsPerKReach > 10 ? "How to replicate" : post.automationCoverage === 0 ? "Ask AI" : "Analyze"}
                            onClick={() => contentAi.openAnalysis(post.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-sm text-muted-foreground">
                        {smartFilter !== "all"
                          ? "No posts match this filter. Try adjusting or switch to All."
                          : "No posts found for this period."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ask AI Modal */}
      <AskAiModal
        open={contentAi.isOpen}
        onClose={contentAi.closeAnalysis}
        analysis={contentAi.analysis}
        isLoading={contentAi.isLoading}
      />
    </DashboardShell>
  );
}
