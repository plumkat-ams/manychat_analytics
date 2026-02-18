"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/analytics", label: "Overview", exact: true },
  { href: "/analytics/audience", label: "Audience" },
  { href: "/analytics/content", label: "Content" },
  { href: "/analytics/automation", label: "Automation" },
  { href: "/analytics/conversion", label: "Conversion" },
  { href: "/analytics/comparison", label: "Benchmarking" },
];

export function AnalyticsTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-card">
      <nav className="flex gap-0 px-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors hover:text-foreground",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
