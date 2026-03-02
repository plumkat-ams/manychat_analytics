"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Zap,
  MessageCircle,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { signOut } from "next-auth/react";

const mainNavItems = [
  { href: "/home", label: "Home", icon: LayoutDashboard },
  { href: "#", label: "Contacts", icon: Users },
  { href: "#", label: "Automations", icon: Zap },
  { href: "#", label: "Live Chat", icon: MessageCircle },
  { href: "#", label: "Broadcasting", icon: Megaphone },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "#", label: "Settings", icon: Settings },
];

type SidebarProps = {
  onOpenAiChat?: () => void;
};

export function Sidebar({ onOpenAiChat }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-white">M</span>
        </div>
        <span className="text-[15px] font-semibold text-white">Manychat</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive =
              item.href !== "#" && pathname.startsWith(item.href);
            const isDisabled = item.href === "#";
            const Icon = item.icon;

            return (
              <li key={item.label}>
                {isDisabled ? (
                  <span
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-foreground/40 cursor-default"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-active text-sidebar-active-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-white"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                    {isActive && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5" />
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* AI Chat Button */}
      <div className="px-3 py-2">
        <button
          onClick={onOpenAiChat}
          className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 px-3 py-2.5 text-[13px] font-semibold text-violet-300 transition-all hover:from-violet-500/30 hover:to-indigo-500/30 hover:text-white"
        >
          <Sparkles className="h-[18px] w-[18px]" />
          Ask AI
          <span className="ml-auto rounded-md bg-violet-500/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-200">
            New
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
