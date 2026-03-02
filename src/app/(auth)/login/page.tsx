"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [apiToken, setApiToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError("");

    const form = e.currentTarget;
    const tokenInput = form.elements.namedItem("apiToken");
    const token =
      (tokenInput && "value" in tokenInput ? String(tokenInput.value).trim() : apiToken.trim()) ||
      "";

    if (!token) {
      setError("Please enter your API token.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        apiToken: token,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid API token. Please check your Manychat API token.");
      } else if (result?.ok !== false) {
        router.push("/analytics");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[480px] flex-col justify-between bg-[hsl(225,62%,17%)] p-10 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-base font-bold text-white">M</span>
          </div>
          <span className="text-lg font-semibold">Manychat</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold leading-tight">
            Analytics that drive
            <br />
            your growth
          </h2>
          <p className="text-[15px] leading-relaxed text-white/70">
            Get actionable insights into your subscriber growth, content performance,
            automation efficiency, and conversion tracking — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { label: "Audience Intelligence", desc: "Subscriber growth & retention" },
              { label: "Content Performance", desc: "Posts, reach & engagement" },
              { label: "Automation Health", desc: "Flow metrics & step funnels" },
              { label: "Conversion Tracking", desc: "Revenue attribution & ROI" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-white/10 p-3">
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="mt-0.5 text-[11px] text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} Manychat Analytics Dashboard
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-base font-bold text-white">M</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Manychat</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Connect your account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your Manychat API token to access analytics
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center text-sm">
              <span className="font-medium text-primary">Try it out</span>
              <span className="text-muted-foreground"> — use token </span>
              <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">demo</code>
              <span className="text-muted-foreground"> to explore with mock data</span>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="apiToken"
                className="block text-sm font-medium text-foreground"
              >
                API Token
              </label>
              <input
                id="apiToken"
                name="apiToken"
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Enter your API token"
                autoComplete="off"
                className="block w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                Find this in Manychat Settings &rarr; API &rarr; Get API Key
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              aria-busy={loading}
              className={`w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md ${loading ? "cursor-wait opacity-80" : ""}`}
            >
              {loading ? "Connecting..." : "Connect Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
