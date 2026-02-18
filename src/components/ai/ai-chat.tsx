"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAccount } from "@/hooks/use-account";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Loader2,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Bookmark,
  Download,
  Share2,
} from "lucide-react";
import type {
  AiChatMessage,
  AiCustomDashboard,
  AiCustomDashboardSection,
  AiCustomDashboardMetric,
} from "@/server/mock-data";

/* ─────────── Custom Dashboard Renderer ─────────── */

function TrendIcon({ trend }: { trend?: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function MetricsSection({ section }: { section: AiCustomDashboardSection }) {
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
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card p-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {m.label}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">{m.value}</span>
              {m.trend && <TrendIcon trend={m.trend} />}
            </div>
            {m.comparison && (
              <p className={`mt-0.5 text-[11px] font-medium ${
                m.trend === "up" ? "text-emerald-500" : m.trend === "down" ? "text-red-500" : "text-muted-foreground"
              }`}>
                {m.comparison}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSection({ section }: { section: AiCustomDashboardSection }) {
  if (!section.headers || !section.rows) return null;
  return (
    <div>
      {section.title && (
        <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {section.title}
        </h4>
      )}
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              {section.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border/30 last:border-0">
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2 text-sm ${
                      ci === 0 ? "font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InsightSection({ section }: { section: AiCustomDashboardSection }) {
  if (!section.text) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50/50 px-4 py-3 dark:border-violet-800/30 dark:bg-violet-950/20">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
      <p className="text-[13px] leading-relaxed text-foreground/80">{section.text}</p>
    </div>
  );
}

function CustomDashboardView({ dashboard }: { dashboard: AiCustomDashboard }) {
  return (
    <div className="space-y-4 rounded-2xl border border-violet-200 bg-gradient-to-b from-white to-violet-50/30 p-4 dark:border-violet-800/30 dark:from-gray-900 dark:to-violet-950/10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">{dashboard.title}</h3>
          <p className="text-[11px] text-violet-500">{dashboard.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Save this view">
            <Bookmark className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Export">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Share">
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sections */}
      {dashboard.sections.map((section, i) => {
        switch (section.type) {
          case "metrics":
            return <MetricsSection key={i} section={section} />;
          case "table":
            return <TableSection key={i} section={section} />;
          case "insight":
            return <InsightSection key={i} section={section} />;
          default:
            return null;
        }
      })}

      {/* Actions */}
      {dashboard.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border/30 pt-3">
          {dashboard.actions.map((action, i) => (
            <a
              key={i}
              href={action.href}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === 0
                  ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm hover:from-violet-600 hover:to-indigo-600"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {action.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────── Chat Message Bubble ─────────── */

function ChatBubble({ message }: { message: AiChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={`max-w-[85%] space-y-3 ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-muted/60 text-foreground rounded-tl-md"
          }`}
        >
          <MessageContent text={message.content} />
        </div>
        {message.customDashboard && (
          <CustomDashboardView dashboard={message.customDashboard} />
        )}
      </div>
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

/* ─────────── Main Chat Panel ─────────── */

type AiChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function AiChatPanel({ open, onClose }: AiChatPanelProps) {
  const { accountId } = useAccount();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMutation = trpc.ai.chat.useMutation();
  const suggestedQueries = trpc.ai.getSuggestedQueries.useQuery(
    { accountId },
    { enabled: !!accountId && open }
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !accountId) return;

      const userMsg: AiChatMessage = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      try {
        const response = await chatMutation.mutateAsync({
          accountId,
          message: text.trim(),
        });
        setMessages((prev) => [...prev, response]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            customDashboard: null,
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [accountId, chatMutation]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative flex w-full max-w-xl flex-col bg-background shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-md">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-foreground">AI Analytics Agent</h2>
            <p className="text-[11px] text-muted-foreground">
              Ask about your flows, content, and automation
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30">
                <MessageSquare className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                Ask me anything about your analytics
              </h3>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                I can analyze data, build custom dashboards, and suggest actions.
              </p>

              {/* Suggested queries */}
              {suggestedQueries.data && (
                <div className="mt-6 w-full space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Try asking
                  </p>
                  {suggestedQueries.data.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="flex w-full items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5 text-left text-[13px] text-foreground/80 transition-all hover:border-violet-200 hover:bg-violet-50/50 dark:hover:border-violet-800/30 dark:hover:bg-violet-950/20"
                    >
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-muted/60 px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                    <span className="text-xs text-muted-foreground">Analyzing your data...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-muted/20 px-5 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your flows, content, and automation..."
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:focus:border-violet-700 dark:focus:ring-violet-900/30"
                disabled={isTyping}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm transition-all hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
