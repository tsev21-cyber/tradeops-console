"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Demo only — no real authentication. Production: verify password + TOTP,
    // issue short-lived JWT + refresh, write a LOGIN_MFA audit event.
    setTimeout(() => router.push("/"), 600);
  }

  const input =
    "w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm text-text outline-none focus:border-primary";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold text-text">TradeOps</p>
            <p className="text-[11px] uppercase tracking-wider text-faint">Internal Console</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-lg font-semibold text-text">Sign in</h1>
          <p className="mt-1 text-xs text-muted">Master Trader access · MFA required</p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className="text-xs text-faint">Email</label>
              <input className={input} type="email" defaultValue="trader@tradeops.internal" autoComplete="username" />
            </div>
            <div>
              <label className="text-xs text-faint">Password</label>
              <input className={input} type="password" defaultValue="demo-password" autoComplete="current-password" />
            </div>
            <div>
              <label className="text-xs text-faint">MFA code (TOTP)</label>
              <input className={`${input} tnum tracking-[0.3em]`} inputMode="numeric" maxLength={6} defaultValue="481920" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {loading ? "Verifying…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-faint">
          Prototype for technical validation. No real authentication — any input signs in.
          Production uses password + TOTP, short-lived JWTs, and an audit trail.
        </p>
      </div>
    </div>
  );
}
