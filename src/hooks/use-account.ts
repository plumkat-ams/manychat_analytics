"use client";

import { useSession } from "next-auth/react";

export function useAccount() {
  const { data: session } = useSession();

  // In production, this would come from the session/database
  // For now, use a placeholder that gets replaced with real account data
  return {
    accountId: (session?.user as Record<string, string>)?.id ?? "",
    isLoading: !session,
    isAuthenticated: !!session?.user,
  };
}
