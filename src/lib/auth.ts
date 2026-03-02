import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MOCK_ACCOUNT_ID } from "@/lib/mock-account";

export const authConfig: NextAuthConfig = {
  providers: [
    // In production, replace with OAuth provider (e.g., Facebook/Instagram)
    CredentialsProvider({
      name: "Manychat API Token",
      credentials: {
        apiToken: { label: "Manychat API Token", type: "password" },
      },
      async authorize(credentials) {
        const rawToken = credentials?.apiToken;
        if (rawToken == null || typeof rawToken !== "string") return null;
        const apiToken = rawToken.trim();

        // Demo mode: use mock data for dashboard testing (no API call)
        if (apiToken === "demo") {
          return {
            id: MOCK_ACCOUNT_ID,
            name: "Demo Account",
            image: null,
            apiToken: "demo",
          };
        }

        try {
          // Verify the API token with Manychat
          const response = await fetch("https://api.manychat.com/fb/page/getInfo", {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) return null;

          const data = await response.json();
          if (data.status === "success") {
            return {
              id: data.data.id,
              name: data.data.name,
              image: data.data.avatar,
              apiToken,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.apiToken = (user as Record<string, unknown>).apiToken;
        token.sub = (user as { id?: string }).id ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.apiToken) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).apiToken = token.apiToken;
      }
      // Ensure session.user.id is set (required for useAccount / dashboard queries)
      if (session.user) {
        (session.user as unknown as Record<string, string>).id = (token.sub as string) ?? "";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/analytics") || nextUrl.pathname.startsWith("/home");

      if (isProtected) {
        return isLoggedIn;
      }
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/home", nextUrl));
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
