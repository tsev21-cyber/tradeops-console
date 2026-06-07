"use client";

import { useState } from "react";
import { Lock, Loader2, Check } from "lucide-react";
import { Card, CardHeader, Badge } from "@/components/ui";

interface Sealed {
  ciphertext: string;
  iv: string;
  authTag: string;
  wrappedDataKey: string;
  keyIv: string;
  keyAuthTag: string;
}

export function CredentialEncryptDemo() {
  const [secret, setSecret] = useState("sk_live_8f2a91c7e4b6d093a1f5");
  const [sealed, setSealed] = useState<Sealed | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function encrypt() {
    setLoading(true);
    setError(null);
    setSealed(null);
    try {
      const res = await fetch("/api/security/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      setSealed(data.sealed);
      setOk(data.roundTripOk);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    } finally {
      setLoading(false);
    }
  }

  const row = (label: string, value: string) => (
    <div className="flex flex-col gap-1 border-b border-border-soft py-2 last:border-0 sm:flex-row sm:items-center">
      <span className="w-40 shrink-0 text-xs text-faint">{label}</span>
      <code className="break-all font-mono text-xs text-text">{value}</code>
    </div>
  );

  return (
    <Card>
      <CardHeader
        title="Encrypt a secret"
        subtitle="Real AES-256-GCM envelope encryption — runs server-side"
        action={<Badge tone="primary"><Lock className="h-3 w-3" /> live crypto</Badge>}
      />
      <div className="space-y-4 p-5">
        <div>
          <label className="text-xs text-faint">Exchange API secret (demo value)</label>
          <div className="mt-1 flex gap-2">
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-sm text-text outline-none focus:border-primary"
            />
            <button
              onClick={encrypt}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Encrypt
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-down">Error: {error}</p>}

        {sealed && (
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-text">Sealed payload (what gets stored)</span>
              {ok && (
                <Badge tone="up"><Check className="h-3 w-3" /> round-trip verified</Badge>
              )}
            </div>
            {row("ciphertext", sealed.ciphertext)}
            {row("iv (nonce)", sealed.iv)}
            {row("authTag", sealed.authTag)}
            {row("wrapped data key", sealed.wrappedDataKey)}
            <p className="mt-3 text-xs leading-relaxed text-muted">
              The plaintext secret is <strong>never stored or returned</strong>. A random data key
              encrypts it; that data key is wrapped by the master key. In production the wrap/unwrap
              happens inside a KMS, so plaintext exists only in memory for the moment of an exchange call.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
