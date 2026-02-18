"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAccount } from "@/hooks/use-account";
import {
  Sparkles,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type AiSummaryProps = {
  view: "overview" | "content" | "automation" | "audience" | "conversion" | "comparison";
};

const iconMap = {
  chart: BarChart3,
  alert: AlertTriangle,
  lightbulb: Lightbulb,
  growth: TrendingUp,
};

const iconColorMap = {
  chart: "text-blue-500",
  alert: "text-amber-500",
  lightbulb: "text-violet-500",
  growth: "text-emerald-500",
};

export function AiSummary({ view }: AiSummaryProps) {
  const { accountId } = useAccount();
  const [expanded, setExpanded] = useState(true);

  const summary = trpc.ai.getViewSummary.useQuery(
    { accountId, view },
    { enabled: !!accountId }
  );

  if (!summary.data) return null;

  const { title, items } = summary.data;

  return (
    <div className="relative overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 via-blue-50 to-indigo-50 dark:border-violet-800/40 dark:from-violet-950/30 dark:via-blue-950/20 dark:to-indigo-950/30">
      {/* Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-white/30 dark:hover:bg-white/5"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
              AI Summary
            </span>
            <span className="text-sm font-semibold text-foreground">{title}</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Body */}
      {expanded && (
        <div className="space-y-1.5 px-4 pb-3.5">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon];
            const colorClass = iconColorMap[item.icon];
            return (
              <div key={i} className="flex items-start gap-2.5">
                <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${colorClass}`} />
                <span className="text-[13px] leading-relaxed text-foreground/80">
                  {item.text}
                  {item.linkLabel && item.linkTarget && (
                    <Link
                      href={item.linkTarget}
                      className="ml-1.5 inline-flex items-center gap-0.5 text-[12px] font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      {item.linkLabel}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
