"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AiChatPanel } from "@/components/ai/ai-chat";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onOpenAiChat={() => setAiChatOpen(true)} />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
        {/* Floating AI Chat Button */}
        <button
          onClick={() => setAiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30 active:scale-95"
          title="Ask AI"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </button>
      </main>
      <AiChatPanel open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
