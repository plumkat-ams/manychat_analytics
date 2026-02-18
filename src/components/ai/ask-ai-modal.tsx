"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAccount } from "@/hooks/use-account";
import {
  Sparkles,
  X,
  ExternalLink,
  Bot,
  Loader2,
} from "lucide-react";
import type { AiAnalysis } from "@/server/mock-data";

/* ─────────── Ask AI Button ─────────── */

type AskAiButtonProps = {
  label?: string;
  onClick: () => void;
  size?: "sm" | "md";
};

export function AskAiButton({ label = "Ask AI", onClick, size = "sm" }: AskAiButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 font-semibold text-white shadow-sm transition-all hover:from-violet-600 hover:to-indigo-600 hover:shadow-md active:scale-95 ${
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
      }`}
    >
      <Sparkles className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {label}
    </button>
  );
}

/* ─────────── Ask AI Modal ─────────── */

type AskAiModalProps = {
  open: boolean;
  onClose: () => void;
  analysis: AiAnalysis | undefined;
  isLoading: boolean;
};

export function AskAiModal({ open, onClose, analysis, isLoading }: AskAiModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-2xl dark:border-violet-800/40 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/50 bg-gradient-to-r from-violet-50 to-indigo-50 px-5 py-4 dark:from-violet-950/30 dark:to-indigo-950/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-md">
              <Bot className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground">
                {isLoading ? "Analyzing..." : analysis?.title ?? "AI Analysis"}
              </h3>
              <p className="text-[11px] text-muted-foreground">Powered by AI</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <p className="text-sm text-muted-foreground">Analyzing your data...</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                {analysis.sections.map((section, si) => (
                  <div key={si}>
                    {section.heading && (
                      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {section.heading}
                      </h4>
                    )}
                    <div className="space-y-2">
                      {section.points.map((point, pi) => (
                        <div
                          key={pi}
                          className="flex items-start gap-2.5 rounded-lg bg-muted/40 px-3 py-2.5 text-[13px] leading-relaxed text-foreground/90"
                        >
                          <span className="mt-0.5 shrink-0 text-xs font-bold text-violet-500">
                            {si === 0 ? `${pi + 1}.` : "→"}
                          </span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No analysis available.</p>
            )}
          </div>

          {/* Actions */}
          {analysis && analysis.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border/50 bg-muted/20 px-5 py-3">
              {analysis.actions.map((action, i) => (
                <a
                  key={i}
                  href={action.href}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    action.variant === "primary"
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
      </div>
    </div>
  );
}

/* ─────────── Wrapper hooks for each context ─────────── */

export function useFlowAnalysis() {
  const { accountId } = useAccount();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  const analysis = trpc.ai.analyzeFlow.useQuery(
    { accountId, flowId: selectedFlowId! },
    { enabled: !!accountId && !!selectedFlowId }
  );

  const openAnalysis = useCallback((flowId: string) => {
    setSelectedFlowId(flowId);
  }, []);

  const closeAnalysis = useCallback(() => {
    setSelectedFlowId(null);
  }, []);

  return {
    isOpen: !!selectedFlowId,
    analysis: analysis.data,
    isLoading: analysis.isLoading && !!selectedFlowId,
    openAnalysis,
    closeAnalysis,
  };
}

export function useContentAnalysis() {
  const { accountId } = useAccount();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const analysis = trpc.ai.analyzeContent.useQuery(
    { accountId, postId: selectedPostId! },
    { enabled: !!accountId && !!selectedPostId }
  );

  const openAnalysis = useCallback((postId: string) => {
    setSelectedPostId(postId);
  }, []);

  const closeAnalysis = useCallback(() => {
    setSelectedPostId(null);
  }, []);

  return {
    isOpen: !!selectedPostId,
    analysis: analysis.data,
    isLoading: analysis.isLoading && !!selectedPostId,
    openAnalysis,
    closeAnalysis,
  };
}

export function useCoverageAnalysis() {
  const { accountId } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const analysis = trpc.ai.analyzeCoverage.useQuery(
    { accountId },
    { enabled: !!accountId && isOpen }
  );

  return {
    isOpen,
    analysis: analysis.data,
    isLoading: analysis.isLoading && isOpen,
    openAnalysis: () => setIsOpen(true),
    closeAnalysis: () => setIsOpen(false),
  };
}
