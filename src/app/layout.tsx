import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc-provider";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manychat Analytics Dashboard",
  description: "Unified analytics for Manychat and Instagram performance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <TRPCProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
