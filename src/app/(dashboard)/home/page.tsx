"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { useAccount } from "@/hooks/use-account";
import {
  Sparkles,
  Send,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Zap,
  Bot,
  Loader2,
  ExternalLink,
  Bookmark,
  Download,
  Share2,
  User,
  Users,
  MessageCircle,
  Eye,
  ChevronDown,
  Pause,
  Target,
  Clock,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type {
  AiChatMessage,
  AiCustomDashboard,
  AiCustomDashboardSection,
  HomeInsightCard,
} from "@/server/mock-data";

/* ─────────── Custom Dashboard Renderer (for AI chat responses) ─────────── */

function TrendIcon({ trend }: { trend?: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function DashboardMetrics({ section }: { section: AiCustomDashboardSection }) {
  if (!section.metrics) return null;
  return (
    <div>
      {section.title && (
        <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {section.title}
        </h4>
      )}
      <div className="grid gap-2.5 sm:grid-cols-3">
        {section.metrics.map((m, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-card p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">{m.value}</span>
              {m.trend && <TrendIcon trend={m.trend} />}
            </div>
            {m.comparison && (
              <p className={`mt-0.5 text-[11px] font-medium ${m.trend === "up" ? "text-emerald-500" : m.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
                {m.comparison}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardTable({ section }: { section: AiCustomDashboardSection }) {
  if (!section.headers || !section.rows) return null;
  return (
    <div>
      {section.title && (
        <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">{section.title}</h4>
      )}
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              {section.headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border/30 last:border-0">
                {row.cells.map((cell, ci) => (
                  <td key={ci} className={`px-3 py-2 text-sm ${ci === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardInsight({ section }: { section: AiCustomDashboardSection }) {
  if (!section.text) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-3 dark:border-violet-800/30 dark:bg-violet-950/20">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
      <p className="text-[13px] leading-relaxed text-foreground/80">{section.text}</p>
    </div>
  );
}

function CustomDashboard({ dashboard }: { dashboard: AiCustomDashboard }) {
  return (
    <div className="space-y-4 rounded-2xl border border-violet-200 bg-gradient-to-b from-white to-violet-50/30 p-5 dark:border-violet-800/30 dark:from-gray-900 dark:to-violet-950/10">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">{dashboard.title}</h3>
          <p className="text-[11px] text-violet-500">{dashboard.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" title="Save"><Bookmark className="h-3.5 w-3.5" /></button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" title="Export"><Download className="h-3.5 w-3.5" /></button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" title="Share"><Share2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      {dashboard.sections.map((section, i) => {
        if (section.type === "metrics") return <DashboardMetrics key={i} section={section} />;
        if (section.type === "table") return <DashboardTable key={i} section={section} />;
        if (section.type === "insight") return <DashboardInsight key={i} section={section} />;
        return null;
      })}
      {dashboard.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border/30 pt-3">
          {dashboard.actions.map((action, i) => (
            <a key={i} href={action.href} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${i === 0 ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm hover:from-violet-600 hover:to-indigo-600" : "border border-border bg-card text-foreground hover:bg-muted"}`}>
              {action.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ─────────── Insight Card tag styles ─────────── */

const insightTagConfig: Record<HomeInsightCard["tag"], { label: string; color: string }> = {
  opportunity: {
    label: "OPPORTUNITY",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  going_viral: {
    label: "GOING VIRAL",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  needs_fix: {
    label: "NEEDS FIX",
    color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
};

/* ─────────── Highlight icon/color mapping (matches Analytics) ─────────── */

const highlightMeta: Record<string, { icon: typeof Target; bg: string; fg: string }> = {
  Leads:        { icon: Target,      bg: "bg-primary/10",      fg: "text-primary" },
  "Touch Rate": { icon: Zap,         bg: "bg-blue-500/10",     fg: "text-blue-500" },
  Revenue:      { icon: DollarSign,  bg: "bg-emerald-500/10",  fg: "text-emerald-500" },
  "Active Flows": { icon: Zap,       bg: "bg-amber-500/10",    fg: "text-amber-500" },
  Followers:    { icon: Users,        bg: "bg-violet-500/10",   fg: "text-violet-500" },
  "Time Saved": { icon: Clock,       bg: "bg-emerald-500/10",  fg: "text-emerald-500" },
  _default:     { icon: BarChart3,    bg: "bg-muted",           fg: "text-muted-foreground" },
};

/* ─────────── Category pills for AI input ─────────── */

const CATEGORY_PROMPTS: Array<{ label: string; icon: React.ReactNode; prompt: string }> = [
  { label: "Growth", icon: <TrendingUp className="h-3.5 w-3.5" />, prompt: "How can I grow my audience faster?" },
  { label: "Content", icon: <Sparkles className="h-3.5 w-3.5" />, prompt: "What content should I create next?" },
  { label: "Reels", icon: <Eye className="h-3.5 w-3.5" />, prompt: "Show me how my Reels are performing" },
  { label: "Audience", icon: <Users className="h-3.5 w-3.5" />, prompt: "Tell me about my audience quality" },
];

/* ═══════════════════════════════ HOME PAGE ═══════════════════════════════ */

export default function HomePage() {
  const { accountId } = useAccount();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState(false);

  const profile = trpc.ai.getHomeProfile.useQuery(
    { accountId },
    { enabled: !!accountId }
  );
  const highlights = trpc.ai.getHomeHighlights.useQuery(
    { accountId },
    { enabled: !!accountId }
  );
  const insights = trpc.ai.getHomeInsights.useQuery(
    { accountId },
    { enabled: !!accountId }
  );
  const automations = trpc.ai.getActiveAutomations.useQuery(
    { accountId },
    { enabled: !!accountId }
  );

  const chatMutation = trpc.ai.chat.useMutation();

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !accountId) return;
      const userMsg: AiChatMessage = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setQuery("");
      setChatMode(true);
      setIsTyping(true);
      try {
        const response = await chatMutation.mutateAsync({ accountId, message: text.trim() });
        setMessages((prev) => [...prev, response]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again.", customDashboard: null }]);
      } finally {
        setIsTyping(false);
      }
    },
    [accountId, chatMutation]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(query);
    }
  };

  const activeCount = automations.data?.filter((a) => a.status === "active").length ?? 0;
  const totalTriggers = automations.data?.reduce((sum, a) => sum + a.triggered, 0) ?? 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-8">

        {/* ════════════ PROFILE HEADER ════════════ */}
        {!chatMode && profile.data && (
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-red-400 to-yellow-400 text-white">
              <span className="text-lg font-bold">{profile.data.displayName.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{profile.data.username}</span>
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-muted-foreground">{profile.data.displayName}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                <span><strong className="text-foreground">{profile.data.posts}</strong> posts</span>
                <span><strong className="text-foreground">{profile.data.followers}</strong> followers</span>
                <span><strong className="text-foreground">{profile.data.following}</strong> following</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{profile.data.bio}</span>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ GREETING + GOAL + AI INPUT ════════════ */}
        <div className={`transition-all duration-500 ${chatMode ? "mb-6" : "mb-10"}`}>
          {!chatMode && profile.data && (
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Hey {profile.data.displayName.split(" ")[0]}, what will you create today?
              </h1>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Based on your profile your goal is to</span>
              </div>
              <button className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold text-foreground">
                <Users className="h-4.5 w-4.5 text-primary" />
                {profile.data.goal}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* AI Chat Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className={`overflow-hidden rounded-2xl border bg-card shadow-lg transition-all focus-within:border-primary/40 focus-within:shadow-xl focus-within:shadow-primary/5 ${chatMode ? "border-border" : "border-border/60"}`}>
              <textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI anything about your growth, content, or automations..."
                rows={chatMode ? 2 : 2}
                className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                disabled={isTyping}
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-[11px] text-muted-foreground">AI-powered</span>
                </div>
                <button
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </form>

          {/* Category Pills */}
          {!chatMode && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {CATEGORY_PROMPTS.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => sendMessage(cat.prompt)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 py-2 text-[12px] font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ════════════ CHAT MESSAGES ════════════ */}
        {chatMode && messages.length > 0 && (
          <div className="mb-8 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-violet-500 to-indigo-500 text-white"}`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[85%] space-y-3 ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-md" : "bg-muted/60 text-foreground rounded-tl-md"}`}>
                    <MessageContent text={msg.content} />
                  </div>
                  {msg.customDashboard && <CustomDashboard dashboard={msg.customDashboard} />}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-muted/60 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Analyzing your data...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════ PERSONALIZED AI INSIGHTS (3 cards) ════════════ */}
        {!chatMode && insights.data && (
          <div className="mb-10">
            <h2 className="mb-4 text-base font-bold text-foreground">
              Personalized for @{profile.data?.username ?? "you"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {insights.data.map((insight) => {
                const tag = insightTagConfig[insight.tag];
                return (
                  <div
                    key={insight.id}
                    className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    <span className={`mb-3 w-fit rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tag.color}`}>
                      {tag.label}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {insight.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[12px] leading-relaxed text-muted-foreground">
                      {insight.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                      <TrendingDown className="h-3 w-3" />
                      {insight.stat}
                    </div>
                    <Link
                      href={insight.href}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      {insight.actionLabel}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════ KEY INSIGHTS (Analytics-style metric cards) ════════════ */}
        {!chatMode && highlights.data && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Key Insights</h2>
              <Link href="/analytics" className="text-xs font-medium text-primary hover:text-primary/80">
                View full dashboard →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.data.map((h) => {
                const meta = highlightMeta[h.label] ?? highlightMeta._default;
                const Icon = meta.icon;
                return (
                  <Link key={h.id} href={h.href} className="block">
                    <Card className="transition-all hover:shadow-md">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}>
                            <Icon className={`h-5 w-5 ${meta.fg}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{h.label}</p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-foreground">{h.value}</p>
                              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                                h.trend === "up" ? "text-emerald-500" : h.trend === "down" ? "text-red-500" : "text-muted-foreground"
                              }`}>
                                {h.trend === "up" && <TrendingUp className="h-3 w-3" />}
                                {h.trend === "down" && <TrendingDown className="h-3 w-3" />}
                                {h.trend === "neutral" && <Minus className="h-3 w-3" />}
                                {h.change}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════ AUTOMATIONS RUNNING ════════════ */}
        {!chatMode && automations.data && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4.5 w-4.5 text-primary" />
                  <h2 className="text-base font-bold text-foreground">Automations Running</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {activeCount} active
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                {totalTriggers.toLocaleString()} total triggers
              </div>
            </div>

            {/* Filter tabs */}
            <div className="mb-4 flex gap-1">
              {[
                { label: `All ${automations.data.length}`, active: true },
                { label: "Active", active: false },
                { label: "Paused", active: false },
              ].map((tab) => (
                <button
                  key={tab.label}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    tab.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {automations.data
                .filter((a) => a.status === "active")
                .map((automation) => (
                <div
                  key={automation.id}
                  className="rounded-xl border border-border/60 bg-card p-5 transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        automation.icon === "users"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {automation.icon === "users" ? <Users className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Active</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{automation.updatedAgo}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground">{automation.name}</h3>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{automation.description}</p>

                  <div className="mt-4 flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-foreground">{automation.triggered.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Triggered</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{automation.replied.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Replied</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{automation.converted.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Converted</p>
                    </div>
                  </div>

                  <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted/60 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Pause className="h-3 w-3" />
                    Pause
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
